import type { AxiosResponse } from "axios";
import callApi from "../Api";

export interface IPatient {
  id?: string;
  foto_path?: string;
  nome_completo: string;
  data_nascimento: string;
  data_nascimento_datepicker: Date | null; // Mantém Date para o DatePicker
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
  convenio_1_validade: Date | null;
  convenio_1_titular: string;
  convenio_2_plano: string;
  convenio_2_matricula: string;
  convenio_2_token: string;
  convenio_2_validade: Date | null;
  convenio_2_titular: string;
  convenio_3_plano: string;
  convenio_3_matricula: string;
  convenio_3_token: string;
  convenio_3_validade: Date | null;
  convenio_3_titular: string;
  procedimento_ids?: string[];
  procedimentos?: Procedure[];
  parentes: Parent[];
  created_at?: string; // Data de criação
  updated_at?: string; // Data de atualização
}

export interface Procedure {
  id: string;
  medico_id: string;
  nome: string;
  duracao_min: number;
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
    pagina: number;
    limite: number;
  }): Promise<AxiosResponse> {
    return callApi(ROUTE, "get", params);
  }
  public static async getPatient(
    id: string
  ): Promise<AxiosResponse<{ data: IPatient }>> {
    return callApi(
      `${ROUTE}/${id}`,
      "get",
      undefined,
      undefined,
      undefined,
      true
    );
  }
  public static async postPatient(body: IPatient): Promise<AxiosResponse> {
    return callApi(ROUTE, "post", undefined, body);
  }
  public static async putPatient(
    id: string,
    body: IPatient
  ): Promise<AxiosResponse> {
    return callApi(`${ROUTE}/${id}`, "put", undefined, body);
  }
  public static async deletePatient(id: string): Promise<AxiosResponse> {
    return callApi(`${ROUTE}/${id}`, "delete");
  }

  // Image
  public static async postPatientImage(
    id: string,
    body: FormData
  ): Promise<AxiosResponse> {
    return callApi(`${ROUTE}/${id}/foto`, "post", undefined, body);
  }

  // Parents
  public static async postPatientParent(
    patientId: string,
    body: Parent
  ): Promise<AxiosResponse> {
    return callApi(
      `${ROUTE}/${patientId}/parentes`,
      "post",
      undefined,
      body,
      undefined,
      true
    );
  }
  public static async deletePatientParent(
    patientId: string,
    body: { cpf: Parent["cpf"] }
  ): Promise<AxiosResponse> {
    return callApi(
      `${ROUTE}/${patientId}/parentescos`,
      "delete",
      undefined,
      body,
      undefined,
      true
    );
  }

  // Procedures
  public static async postPatientProcedure(
    patientId: string,
    body: { procedimento_ids: string[] }
  ): Promise<AxiosResponse> {
    return callApi(
      `${ROUTE}/${patientId}/procedimentos`,
      "post",
      undefined,
      body,
      undefined,
      true
    );
  }
  public static async deletePatientProcedure(
    patientId: string,
    body: { procedimento_id: Procedure["id"] }
  ): Promise<AxiosResponse> {
    return callApi(
      `${ROUTE}/${patientId}/procedimentos/${body.procedimento_id}`,
      "delete",
      undefined,
      undefined,
      undefined,
      true
    );
  }
}
