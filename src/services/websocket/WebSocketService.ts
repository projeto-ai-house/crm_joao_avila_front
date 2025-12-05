import { callApi } from "../Api";
import type {
  AgentResponseMessage,
  ChatMessage,
  ConnectionMessage,
  ConnectionState,
  ErrorMessage,
  HistoryMessage,
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
  private onHistoryCallback?: (messages: ChatMessage[]) => void;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      ...config,
    };
  }

  /**
   * Converte URL relativa em URL completa
   */
  private getFullUrl(url: string): string {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${this.config.baseUrl}${cleanUrl}`;
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

  /**
   * Callback para receber histórico de mensagens
   * @param callback Função chamada quando o servidor envia mensagens antigas
   * - Mensagens já vêm convertidas para ChatMessage[]
   * - Ordenadas por timestamp (mais antigas primeiro)
   * - Anexos com URLs completas
   */
  public onHistory(callback: (messages: ChatMessage[]) => void): void {
    this.onHistoryCallback = callback;
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

      // console.log("Conectando ao WebSocket:", wsUrl.replace(this.config.token, "***"));

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
      // console.log("WebSocket conectado");
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.setState("connected");
      this.startPingInterval();
      this.flushMessageQueue();
    };

    this.ws.onclose = (event) => {
      // console.log("WebSocket fechado:", event.code, event.reason);
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

  /**
   * Processar mensagens recebidas via WebSocket
   *
   * O servidor pode enviar mensagens em diferentes formatos:
   * 1. Uma única mensagem JSON válida (caso comum)
   * 2. Múltiplas mensagens JSON separadas por newline (\n)
   * 3. Mensagens com caracteres extras (whitespace, newlines)
   *
   * Estratégia de parsing em camadas:
   * - Camada 1: Tenta parsear como JSON único (rápido)
   * - Camada 2: Se falhar, divide por \n e tenta cada linha
   * - Camada 3: Filtra linhas vazias/whitespace
   * - Camada 4: Logs detalhados se tudo falhar
   *
   * Esta abordagem garante:
   * - Performance (caso comum é otimizado)
   * - Resiliência (não quebra com formatos inesperados)
   * - Observabilidade (logs detalhados para debug)
   * - Tolerância a falhas (uma mensagem ruim não para tudo)
   *
   * @param event - MessageEvent do WebSocket contendo os dados brutos
   *
   * @example
   * // Caso 1: JSON único
   * {"type":"connection","data":{...}}
   *
   * @example
   * // Caso 2: Múltiplas mensagens
   * {"type":"connection","data":{...}}
   * {"type":"history","data":{...}}
   *
   * @example
   * // Caso 3: Com whitespace
   * {"type":"connection","data":{...}}
   *
   * {"type":"history","data":{...}}
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const rawData = event.data as string;

      // === VALIDAÇÃO INICIAL ===
      // Se for vazio ou só whitespace, ignorar silenciosamente
      // Isso previne erros desnecessários com mensagens vazias
      if (!rawData || !rawData.trim()) {
        return;
      }

      // === CAMADA 1: Parsing Direto (Caso Comum - Otimizado) ===
      // Tenta parsear como JSON único primeiro
      // Este é o caso mais comum e mais rápido
      try {
        const message: WebSocketMessage = JSON.parse(rawData);
        this.processMessage(message);
        return; // Sucesso! Retorna imediatamente
      } catch (firstError) {
        // === CAMADA 2: Múltiplas Mensagens ===
        // Se parsing direto falhou, pode ser múltiplas mensagens concatenadas
        // Exemplo: {"type":"a"}\n{"type":"b"}

        // Dividir por newline e filtrar linhas vazias/whitespace
        const lines = rawData.split('\n').filter(line => line.trim());

        if (lines.length > 1) {
          // === CAMADA 3: Processar Cada Linha Individualmente ===
          // Encontramos múltiplas linhas não-vazias
          // Tentar parsear cada uma como JSON separado
          lines.forEach(line => {
            try {
              const message: WebSocketMessage = JSON.parse(line.trim());
              this.processMessage(message);
            } catch (lineError) {
              // Log detalhado para debug
              console.error("❌ Erro ao processar linha JSON:", lineError);
              console.error("📄 Linha problemática:", line);
            }
          });
        } else {
          // === CAMADA 4: Erro Real - Logging Detalhado ===
          // Não é múltiplas mensagens e não é JSON válido
          // Logar informações para debug
          console.error("❌ Erro ao processar mensagem WebSocket:", firstError);
          console.error("📄 Dados recebidos (primeiros 200 chars):", rawData.substring(0, 200));
        }
      }
    } catch (error) {
      // === CAMADA 5: Catch Final - Erro Crítico ===
      // Algo deu muito errado - não deveria chegar aqui
      console.error("🔥 Erro crítico ao processar mensagem:", error);
    }
  }

  /**
   * Processa uma mensagem WebSocket individual já parseada
   *
   * Este método é chamado por handleMessage() após o parsing bem-sucedido.
   * Separa a lógica de parsing da lógica de processamento, permitindo:
   * - Reutilização de código (múltiplas mensagens usam o mesmo processador)
   * - Melhor testabilidade
   * - Código mais limpo e organizado
   *
   * @param message - Mensagem WebSocket já parseada e validada
   *
   * Tipos de mensagem suportados:
   * - "connection": Confirmação de conexão estabelecida
   * - "message_received": Confirmação de mensagem enviada para webhook
   * - "agent_response": Resposta do agente (n8n)
   * - "history": Histórico de mensagens antigas
   * - "pong": Resposta ao ping (keep-alive)
   * - "error": Erro do servidor
   */
  private processMessage(message: WebSocketMessage): void {
    // Para debug, descomentar a linha abaixo:
    // console.log("📨 Mensagem recebida:", message);

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

      case "history":
        this.handleHistory(message as HistoryMessage);
        break;

      case "pong":
        // Pong recebido - conexão está ativa
        // Para debug, descomentar: console.log("💓 Pong recebido");
        break;

      case "error":
        this.handleError(message as ErrorMessage);
        break;

      default:
        // Tipo de mensagem desconhecido - pode ser uma nova funcionalidade
        // Para debug, descomentar: console.log("❓ Tipo desconhecido:", message);
        break;
    }
  }

  // Handlers específicos
  private handleConnectionMessage(message: ConnectionMessage): void {
    // console.log("Conectado - Connection ID:", message.data.connection_id);
    this.connectionId = message.data.connection_id;
  }

  private handleMessageReceived(message: MessageReceivedMessage): void {
    // console.log("Mensagem enviada para webhook:", message.data.status);
    // Atualizar status da mensagem para "sent"
  }

  private handleAgentResponse(message: AgentResponseMessage): void {
    // Processar anexos se houver
    const rawAttachments = (message.data as any).attachments || [];
    const processedAttachments = rawAttachments.map((att: any) => ({
      ...att,
      file_url: this.getFullUrl(att.file_url), // Converter URL relativa em completa
    }));

    const chatMessage: ChatMessage = {
      id: `agent-${Date.now()}`,
      text: message.data.message,
      sender: "agent",
      timestamp: new Date(message.timestamp || Date.now()),
      status: "delivered",
      attachments: processedAttachments,
      hasAttachments: (message.data as any).has_attachments || false,
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

  /**
   * Handler para mensagens de histórico
   * Recebe mensagens antigas do servidor e as converte para ChatMessage[]
   *
   * Formato esperado do servidor:
   * {
   *   type: "history",
   *   data: {
   *     messages: [
   *       {
   *         id: "uuid",
   *         message: "texto",
   *         direction: "incoming" | "outgoing",
   *         has_attachments: boolean,
   *         created_at: "ISO8601",
   *         attachments: [...]
   *       }
   *     ]
   *   }
   * }
   *
   * Conversões realizadas:
   * - direction: "incoming" → sender: "user" (mensagem do usuário)
   * - direction: "outgoing" → sender: "agent" (resposta do agente)
   * - URLs relativas de anexos → URLs completas
   * - created_at (string) → timestamp (Date)
   * - Ordenação por timestamp (antigas → recentes)
   */
  private handleHistory(message: HistoryMessage): void {
    const historyItems = message.data.messages || [];

    // Converter mensagens do histórico para ChatMessage
    const chatMessages: ChatMessage[] = historyItems.map((item) => {
      // Processar anexos se houver
      const processedAttachments = (item.attachments || []).map((att) => ({
        ...att,
        file_url: this.getFullUrl(att.file_url),
      }));

      return {
        id: item.id,
        text: item.message,
        sender: item.direction === "incoming" ? "user" : "agent",
        timestamp: new Date(item.created_at),
        status: "delivered",
        attachments: processedAttachments,
        hasAttachments: item.has_attachments,
      };
    });

    // Ordenar por timestamp (mais antigas primeiro)
    chatMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (this.onHistoryCallback) {
      this.onHistoryCallback(chatMessages);
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
      // console.log("Máximo de tentativas de reconexão atingido");
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

    // console.log(
    //   `Tentativa ${this.reconnectAttempts}/${this.config.maxReconnectAttempts} - Reconectando em ${delay}ms...`
    // );

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Gerenciar estado
  private setState(newState: ConnectionState): void {
    const oldState = this.state;
    this.state = newState;
    // console.log(`Estado alterado: ${oldState} -> ${newState}`);

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
