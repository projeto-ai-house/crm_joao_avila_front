import type { AxiosResponse } from "axios";
import callApi from "../Api";

interface IClinic {
  nome_clinica: string;
  Cnpj: string;
  Endereco: string;
  assinatura_id?: string;
  plano_custom?: boolean;
  plano_id?: string;
  plano_custom_dados?: {
    nome: string;
    limite_conversas: number;
    periodo_dias: number;
    valor: number;
    recorrente: boolean;
    data_inicio: string;
  };
}

const ROUTE: string = "/clinica";
export class ClinicsServices {
  public static async getClinics(params: {
    page: number;
  }): Promise<AxiosResponse> {
    return callApi(ROUTE, "get", params);
  }
  public static async postClinic(body: IClinic): Promise<AxiosResponse> {
    return callApi(ROUTE, "post", undefined, body);
  }
}
