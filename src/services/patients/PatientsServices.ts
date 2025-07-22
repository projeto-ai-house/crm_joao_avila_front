import type { AxiosResponse } from "axios";
import callApi from "../Api";

export interface IPatient {
  nome_completo: string;
  data_nascimento: string;
  sexo: string;
  cpf: string;
  rg: string;
  nacionalidade: string;
  profissao: string;
  altura_cm: number;
  peso_kg: number;
  imc: number;
  prioridade: string;
  cor_pele: string;
  estado_civil: string;
  escolaridade: string;
  indicacao: string;
  observacoes: string;
  telefone: string;
  celular: string;
  email: string;
  cep: string;
  endereco: string;
  numero_residencial: string;
  complemento: string;
  cidade: string;
  estado: string;
  pais: string;
  convenio_1_plano: string;
  convenio_1_matricula: string;
  convenio_1_token: string;
  convenio_1_validade: string;
  convenio_1_titular: string;
  convenio_2_plano: string;
  convenio_2_matricula: string;
  convenio_2_token: string;
  convenio_2_validade: string;
  convenio_2_titular: string;
  convenio_3_plano: string;
  convenio_3_matricula: string;
  convenio_3_token: string;
  convenio_3_validade: string;
  convenio_3_titular: string;
  procedimento_ids: string[];
  parentes: Parent[];
}

export interface Parent {
  nome: string;
  tipo_parentesco: string;
  data_nascimento: string;
  cpf: string;
  telefone: string;
}

const ROUTE: string = "/pacientes";
export class PatientsServices {
  public static async getPatients(params: {
    page: number;
  }): Promise<AxiosResponse> {
    return callApi(ROUTE, "get", params);
  }
  public static async postPatient(body: IPatient): Promise<AxiosResponse> {
    return callApi(ROUTE, "post", undefined, body);
  }
}
