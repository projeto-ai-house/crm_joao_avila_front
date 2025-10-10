import { callApi } from "../Api";

export interface IWebhook {
  id: string;
  clinica_id: string;
  webhook_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ICreateWebhookPayload {
  clinica_id: string;
  webhook_url: string;
}

export interface IUpdateWebhookPayload {
  id: string;
  webhook_url: string;
  is_active: boolean;
}

export class WebhooksService {
  /**
   * Criar novo webhook para uma clínica
   */
  static async createWebhook(payload: ICreateWebhookPayload) {
    return callApi("/agent-webhook", "post", undefined, payload);
  }

  /**
   * Listar webhooks de uma clínica
   */
  static async listWebhooks(clinicaId: string, pagina = 1, limite = 5) {
    return callApi(
      "/agent-webhook",
      "get",
      { clinica_id: clinicaId, pagina, limite },
      undefined,
      undefined,
      true
    );
  }

  /**
   * Atualizar webhook
   */
  static async updateWebhook(payload: IUpdateWebhookPayload) {
    return callApi("/agent-webhook", "put", undefined, payload);
  }

  /**
   * Ativar webhook
   */
  static async activateWebhook(webhookId: string) {
    return callApi(
      `/agent-webhook/${webhookId}/activate`,
      "put",
      undefined,
      undefined,
      undefined,
      true
    );
  }

  /**
   * Desativar webhook
   */
  static async deactivateWebhook(webhookId: string) {
    return callApi(`/agent-webhook/${webhookId}/deactivate`, "put");
  }
}
