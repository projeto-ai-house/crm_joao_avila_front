import type { AxiosResponse } from "axios";
import callApi from "../Api";

export interface IAnamnese {
  id?: string;
  queixa_principal?: string;
  historia_doenca_atual?: string;
  historia_familiar?: string;
  historia_pessoal?: string;
  revisao_sistemas?: string;
  habitos_de_vida?: string;
  medicamentos_em_uso?: string;
  alergias?: string;
}

const ROUTE: string = "/anamenese";
export class AnamneseServices {
  public static async getAnamneses(patient_id: string): Promise<AxiosResponse> {
    return callApi(ROUTE, "get", { paciente_id: patient_id });
  }
  public static async postAnamnese(data: IAnamnese): Promise<AxiosResponse> {
    return callApi(ROUTE, "post", data);
  }
  public static async putAnamnese(data: IAnamnese): Promise<AxiosResponse> {
    return callApi(ROUTE, "put", data);
  }
  public static async deleteAnamnese(id: string): Promise<AxiosResponse> {
    return callApi(`${ROUTE}/${id}`, "delete");
  }
}
