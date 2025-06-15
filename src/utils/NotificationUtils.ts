// NotificationService.ts
import { app } from "../main";

type Severity = "success" | "info" | "warn" | "error";

export class NotificationService {
  public static tell(status: number, summary?: string, detail?: string): void {
    const { severity, defaultSummary, defaultDetail } =
      this.getByStatus(status);

    app.config.globalProperties.$toast.add({
      severity: severity as any,
      summary: summary || defaultSummary,
      detail: detail || defaultDetail,
      life: 5000,
    });
  }

  private static getByStatus(status: number): {
    severity: Severity;
    defaultSummary: string;
    defaultDetail: string;
  } {
    switch (status) {
      case 200:
      case 201:
      case 204:
        return {
          severity: "success",
          defaultSummary: "Sucesso",
          defaultDetail: "Operação realizada com sucesso.",
        };
      case 400:
        return {
          severity: "warn",
          defaultSummary: "Requisição inválida",
          defaultDetail: "Verifique os dados enviados.",
        };
      case 401:
        return {
          severity: "error",
          defaultSummary: "Não autorizado",
          defaultDetail: "Faça login para continuar.",
        };
      case 403:
        return {
          severity: "error",
          defaultSummary: "Proibido",
          defaultDetail: "Você não tem permissão para acessar este recurso.",
        };
      case 404:
        return {
          severity: "warn",
          defaultSummary: "Não encontrado",
          defaultDetail: "Recurso não encontrado.",
        };
      case 408:
        return {
          severity: "warn",
          defaultSummary: "Tempo esgotado",
          defaultDetail: "A solicitação levou muito tempo.",
        };
      case 500:
        return {
          severity: "error",
          defaultSummary: "Erro interno",
          defaultDetail: "Ocorreu um erro no servidor.",
        };
      case 502:
      case 503:
      case 504:
        return {
          severity: "error",
          defaultSummary: "Serviço indisponível",
          defaultDetail: "Tente novamente mais tarde.",
        };
      default:
        return {
          severity: "info",
          defaultSummary: `Status ${status}`,
          defaultDetail: `Resposta recebida: ${status}.`,
        };
    }
  }
}
