import type { AxiosResponse } from "axios";
import callApi from "../Api";

export interface IReferral {
  id: string;
  codigo_indicacao: string;
  status_link: string;
  created_at: string;
  total_submissoes: number;
  gerado_por_ceo_nome: string;
  gerado_na_clinica_nome: string;
  gerado_na_clinica_cnpj: string;
}

interface IReferralSubscription {
  codigo_indicacao: string;
  nome_dono_indicado: string;
  nome_clinica_indicada: string;
  cnpj_indicado: string;
  telefone_whatsapp_indicado: string;
  email_indicado: string;
}

const ROUTE: string = "/indicacao";
export class ReferralsServices {
  public static async getReferrals(params: {
    pagina: number;
    limite: number;
  }): Promise<AxiosResponse> {
    return callApi(ROUTE, "get", params, undefined, undefined, true);
  }

  public static async getReferralSubs(id: string): Promise<AxiosResponse> {
    return callApi(
      `${ROUTE}/${id}`,
      "get",
      undefined,
      undefined,
      undefined,
      true
    );
  }

  public static async generateReferral(): Promise<AxiosResponse> {
    return callApi(ROUTE + "/gerar", "post", undefined);
  }

  public static async putReferralStatus(
    id: string,
    status_link: "ATIVO" | "INATIVO"
  ): Promise<AxiosResponse> {
    return callApi(`${ROUTE}/${id}`, "put", { status_link });
  }

  // Subscriptions
  public static async postReferralSubscription(
    body: IReferralSubscription
  ): Promise<AxiosResponse> {
    return callApi(`${ROUTE}/form`, "post", undefined, body);
  }
}
