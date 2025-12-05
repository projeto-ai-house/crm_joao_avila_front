// Tipos de mensagens WebSocket baseados na documentação

export type MessageType =
  | "connection"
  | "message"
  | "message_received"
  | "agent_response"
  | "history"
  | "ping"
  | "pong"
  | "error";

export interface WebSocketMessage {
  type: MessageType;
  data?: any;
  timestamp?: string;
}

export interface ConnectionMessage {
  type: "connection";
  data: {
    status: "connected";
    connection_id: string;
  };
  timestamp: string;
}

export interface MessageReceivedMessage {
  type: "message_received";
  data: {
    status: "sent_to_webhook";
    message: string;
  };
  timestamp: string;
}

export interface AgentResponseMessage {
  type: "agent_response";
  data: {
    message: string;
    connection_id: string;
  };
  timestamp: string;
}

export interface ErrorMessage {
  type: "error";
  data: {
    error: string;
  };
  timestamp: string;
}

/**
 * Mensagem individual do histórico (formato do backend)
 * @property direction - "incoming": enviada pelo usuário | "outgoing": enviada pelo agente
 * @property created_at - ISO8601 timestamp (ex: "2025-12-05T12:49:52.011651Z")
 */
export interface HistoryMessageItem {
  id: string;
  clinica_id: string;
  connection_id: string;
  message: string;
  direction: "incoming" | "outgoing";
  has_attachments: boolean;
  created_at: string;
  attachments?: AttachmentInfo[];
}

/**
 * Mensagem de histórico enviada pelo servidor via WebSocket
 * Recebida logo após a conexão ser estabelecida
 *
 * @example
 * {
 *   "type": "history",
 *   "data": {
 *     "messages": [
 *       {
 *         "id": "814638b5-4d8c-4c14-b3f5-63fb8efddc67",
 *         "clinica_id": "2a5cdea4-9604-4772-9949-db446b13cbf9",
 *         "connection_id": "conn_1764938989789768691_2536",
 *         "message": "opa",
 *         "direction": "incoming",
 *         "has_attachments": false,
 *         "created_at": "2025-12-05T12:49:52.011651Z"
 *       }
 *     ]
 *   },
 *   "timestamp": "2025-12-05T09:52:20.924026058-03:00"
 * }
 */
export interface HistoryMessage {
  type: "history";
  data: {
    messages: HistoryMessageItem[];
  };
  timestamp: string;
}

export interface OutgoingMessage {
  type: "message" | "ping";
  data?: {
    message: string;
  };
}

export interface AttachmentInfo {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  caption?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "error";
  attachments?: AttachmentInfo[];
  hasAttachments?: boolean;
}

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export interface WebSocketConfig {
  baseUrl: string;
  clinicaId: string;
  userId: string;
  token: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}
