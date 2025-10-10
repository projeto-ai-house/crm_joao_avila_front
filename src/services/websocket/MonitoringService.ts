import { callApi } from "../Api";

export interface IWebSocketConnection {
  id: string;
  clinica_id: string;
  user_id: string;
  connection_id: string;
  status: "connected" | "disconnected";
  connected_at: string;
  disconnected_at: string | null;
  last_activity: string;
  user_name?: string;
  user_email?: string;
}

export interface IAgentMessage {
  id: string;
  connection_id: string;
  message: string;
  direction: "incoming" | "outgoing";
  created_at: string;
  clinica_id: string;
  user_id: string;
}

export interface IConnectionsResponse {
  connections: IWebSocketConnection[];
  total: number;
  pagina: number;
  limite: number;
}

export interface IMessagesResponse {
  messages: IAgentMessage[];
  total: number;
}

export class MonitoringService {
  /**
   * Listar conexões ativas de uma clínica
   */
  static async listConnections(
    clinicaId: string,
    status?: "connected" | "disconnected" | "all"
  ) {
    const params: any = {};
    if (status && status !== "all") {
      params.status = status;
    }

    return callApi(
      `/websocket/connections/clinica/${clinicaId}`,
      "get",
      params,
      undefined,
      undefined,
      true
    );
  }

  /**
   * Buscar histórico de mensagens de uma conexão
   */
  static async getMessages(connectionId: string) {
    return callApi(
      `/websocket/messages/${connectionId}`,
      "get",
      undefined,
      undefined,
      undefined,
      true
    );
  }

  /**
   * Listar todas as conexões (admin)
   */
  static async listAllConnections(
    status?: "connected" | "disconnected" | "all",
    pagina = 1,
    limite = 50
  ) {
    const params: any = { pagina, limite };
    if (status && status !== "all") {
      params.status = status;
    }

    return callApi(
      "/websocket/connections",
      "get",
      params,
      undefined,
      undefined,
      true
    );
  }
}
