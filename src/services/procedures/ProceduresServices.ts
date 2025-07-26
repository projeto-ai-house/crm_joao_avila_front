import type { AxiosResponse } from "axios";
import callApi from "../Api";

export interface IProcedure {
  nome: string;
  duracao_min: number;
}

const ROUTE: string = "/procedimentos";

export class ProceduresServices {
  public static async getProcedures(): Promise<AxiosResponse> {
    return callApi(ROUTE, "get", undefined, undefined, undefined, true);
  }
  public static async postProcedure(body: IProcedure): Promise<AxiosResponse> {
    return callApi(ROUTE, "post", undefined, body);
  }
  public static async putProcedure(body: IProcedure): Promise<AxiosResponse> {
    return callApi(ROUTE, "put", undefined, body);
  }
  public static async deleteProcedure(id: string): Promise<AxiosResponse> {
    return callApi(`${ROUTE}/${id}`, "delete");
  }
}
