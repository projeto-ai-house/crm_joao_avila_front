// Tipos de mensagens WebSocket baseados na documentação

export type MessageType =
  | "connection"
  | "message"
  | "message_received"
  | "agent_response"
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

export interface OutgoingMessage {
  type: "message" | "ping";
  data?: {
    message: string;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "error";
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
