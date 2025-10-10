import { callApi } from "../Api";
import type {
  AgentResponseMessage,
  ChatMessage,
  ConnectionMessage,
  ConnectionState,
  ErrorMessage,
  MessageReceivedMessage,
  OutgoingMessage,
  WebSocketConfig,
  WebSocketMessage,
} from "./WebSocketTypes";

export class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private connectionId: string | null = null;
  private state: ConnectionState = "disconnected";
  private reconnectAttempts = 0;
  private pingInterval: number | null = null;
  private messageQueue: string[] = [];
  private isConnecting = false;

  // Callbacks
  private onStateChangeCallback?: (state: ConnectionState) => void;
  private onMessageCallback?: (message: ChatMessage) => void;
  private onErrorCallback?: (error: string) => void;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      ...config,
    };
  }

  // Setters para callbacks
  public onStateChange(callback: (state: ConnectionState) => void): void {
    this.onStateChangeCallback = callback;
  }

  public onMessage(callback: (message: ChatMessage) => void): void {
    this.onMessageCallback = callback;
  }

  public onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  // Gerar Connection ID
  private async generateConnectionId(): Promise<string> {
    try {
      const response = await callApi(
        "/websocket/generate-connection-id",
        "post",
        undefined,
        undefined,
        "json",
        true,
        true
      );

      const connectionId = response.data?.data?.connection_id;
      if (!connectionId) {
        throw new Error("Connection ID não retornado pela API");
      }

      return connectionId;
    } catch (error) {
      console.error("Erro ao gerar connection_id:", error);
      throw error;
    }
  }

  // Conectar ao WebSocket
  public async connect(): Promise<void> {
    if (this.isConnecting || this.state === "connected") {
      console.log("Já está conectado ou conectando");
      return;
    }

    this.isConnecting = true;
    this.setState("connecting");

    try {
      // Gerar connection_id se não existir
      if (!this.connectionId) {
        this.connectionId = await this.generateConnectionId();
        console.log("Connection ID gerado:", this.connectionId);
      }

      // Construir URL do WebSocket
      const protocol = this.config.baseUrl.startsWith("https") ? "wss" : "ws";
      const baseUrl = this.config.baseUrl.replace(/^https?:\/\//, "");
      const wsUrl = `${protocol}://${baseUrl}/api/v1/websocket/ws?clinica_id=${this.config.clinicaId}&user_id=${this.config.userId}&connection_id=${this.connectionId}&token=${this.config.token}`;

      console.log("Conectando ao WebSocket:", wsUrl.replace(this.config.token, "***"));

      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      console.error("Erro ao conectar WebSocket:", error);
      this.isConnecting = false;
      this.setState("error");
      this.scheduleReconnect();
    }
  }

  // Configurar event handlers
  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log("WebSocket conectado");
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.setState("connected");
      this.startPingInterval();
      this.flushMessageQueue();
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket fechado:", event.code, event.reason);
      this.isConnecting = false;
      this.stopPingInterval();

      if (event.code !== 1000) {
        // Não foi fechamento normal
        this.setState("disconnected");
        this.scheduleReconnect();
      } else {
        this.setState("disconnected");
      }
    };

    this.ws.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
      this.isConnecting = false;
      this.setState("error");
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event);
    };
  }

  // Processar mensagens recebidas
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      console.log("Mensagem recebida:", message);

      switch (message.type) {
        case "connection":
          this.handleConnectionMessage(message as ConnectionMessage);
          break;

        case "message_received":
          this.handleMessageReceived(message as MessageReceivedMessage);
          break;

        case "agent_response":
          this.handleAgentResponse(message as AgentResponseMessage);
          break;

        case "pong":
          console.log("Pong recebido - conexão ativa");
          break;

        case "error":
          this.handleError(message as ErrorMessage);
          break;

        default:
          console.log("Mensagem desconhecida:", message);
      }
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
    }
  }

  // Handlers específicos
  private handleConnectionMessage(message: ConnectionMessage): void {
    console.log("Conectado - Connection ID:", message.data.connection_id);
    this.connectionId = message.data.connection_id;
  }

  private handleMessageReceived(message: MessageReceivedMessage): void {
    console.log("Mensagem enviada para webhook:", message.data.status);
    // Atualizar status da mensagem para "sent"
  }

  private handleAgentResponse(message: AgentResponseMessage): void {
    const chatMessage: ChatMessage = {
      id: `agent-${Date.now()}`,
      text: message.data.message,
      sender: "agent",
      timestamp: new Date(message.timestamp || Date.now()),
      status: "delivered",
    };

    if (this.onMessageCallback) {
      this.onMessageCallback(chatMessage);
    }
  }

  private handleError(message: ErrorMessage): void {
    console.error("Erro do servidor:", message.data.error);
    if (this.onErrorCallback) {
      this.onErrorCallback(message.data.error);
    }
  }

  // Enviar mensagem
  public sendMessage(text: string): boolean {
    const message: OutgoingMessage = {
      type: "message",
      data: { message: text },
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      return true;
    } else {
      // Adicionar à fila se não estiver conectado
      this.messageQueue.push(JSON.stringify(message));
      return false;
    }
  }

  // Enviar ping
  private sendPing(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const ping: OutgoingMessage = { type: "ping" };
      this.ws.send(JSON.stringify(ping));
    }
  }

  // Gerenciar ping interval
  private startPingInterval(): void {
    this.stopPingInterval();
    this.pingInterval = window.setInterval(() => {
      this.sendPing();
    }, 54000); // 54 segundos conforme documentação
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // Processar fila de mensagens
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message && this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(message);
      }
    }
  }

  // Reconexão automática
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= (this.config.maxReconnectAttempts || 10)) {
      console.log("Máximo de tentativas de reconexão atingido");
      this.setState("error");
      if (this.onErrorCallback) {
        this.onErrorCallback(
          "Não foi possível conectar ao servidor. Tente novamente mais tarde."
        );
      }
      return;
    }

    this.reconnectAttempts++;
    const delay =
      (this.config.reconnectInterval || 5000) *
      Math.pow(2, Math.min(this.reconnectAttempts, 5));

    console.log(
      `Tentativa ${this.reconnectAttempts}/${this.config.maxReconnectAttempts} - Reconectando em ${delay}ms...`
    );

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Gerenciar estado
  private setState(newState: ConnectionState): void {
    const oldState = this.state;
    this.state = newState;
    console.log(`Estado alterado: ${oldState} -> ${newState}`);

    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(newState);
    }
  }

  // Getters
  public getState(): ConnectionState {
    return this.state;
  }

  public getConnectionId(): string | null {
    return this.connectionId;
  }

  // Desconectar
  public disconnect(): void {
    this.stopPingInterval();
    if (this.ws) {
      this.ws.close(1000, "Desconexão manual");
      this.ws = null;
    }
    this.setState("disconnected");
  }
}
