import type { AxiosResponse } from "axios";
import callApi from "../Api";

interface IClinic {
  nome_clinica: string;
  Cnpj: string;
  Endereco: string;
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
