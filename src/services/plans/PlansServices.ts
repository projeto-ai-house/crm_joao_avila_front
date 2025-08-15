import type { AxiosResponse } from "axios";
import callApi from "../Api";

export interface IPlan {
  id: string;
  nome: string;
  descricao?: string;
  limite_conversas?: number;
  periodo_dias?: number;
  valor?: number;
  ativo?: boolean;
}

const ROUTE: string = "/planos";
export class PlansServices {
  public static async getPlans(): Promise<
    AxiosResponse<{ message: string; data: IPlan[] }>
  > {
    return callApi(ROUTE, "get");
  }

  public static async putPlan(body: {
    planoID: string;
    status: boolean;
  }): Promise<AxiosResponse<{ message: string; data: IPlan | null }>> {
    return callApi(ROUTE, "put", undefined, body);
  }
}
