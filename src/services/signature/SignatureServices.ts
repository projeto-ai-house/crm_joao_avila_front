import type { AxiosResponse } from "axios";
import callApi from "../Api";

const ROUTE: string = "/assinatura";
export class SignatureServices {
  public static async getHistory(params: {
    assinatura_id: string;
    pagina: number;
    limite: number;
  }): Promise<AxiosResponse> {
    return callApi(ROUTE + "/historico", "get", params);
  }
}
