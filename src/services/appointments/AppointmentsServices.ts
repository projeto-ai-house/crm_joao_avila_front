import type { AxiosResponse } from "axios";
import callApi from "../Api";

interface IAppointments {
  id: string;
  medico_id: string;
  titulo: string;
  data_hora: string; // ISO 8601 datetime string
  duracao_sec: number;
  status: string;
  convenio: string;
  telefone_contato: string;
  nome_cliente: string;
  data_nascimento: string; // ISO 8601 date string
  medico: {
    id: string;
    nome_completo: string;
    email: string;
  };
}

interface ICreateAppointment {
  titulo: string;
  convenio: string;
  Nome_paciente: string;
  telefone_contato: string;
  data_hora: string; // ISO 8601 datetime
  data_nascimento: string; // ISO 8601 datetime
  MedicoID: string;
}

interface IDeleteAppointments {
  id: IAppointments["id"];
}

const ROUTE: string = "/agendamentos";

export class AppointmentsServices {
  public static async getAppointments(params: {
    page: number;
    dataInicio: string;
    dataFim: string;
  }): Promise<AxiosResponse> {
    return callApi(ROUTE, "get", params);
  }
  public static async createAppointment(
    appointmentData: ICreateAppointment
  ): Promise<AxiosResponse> {
    return callApi(ROUTE, "post", undefined, appointmentData);
  }
  public static async deleteAppointment(
    deleteData: IDeleteAppointments
  ): Promise<AxiosResponse> {
    return callApi(ROUTE, "delete", undefined, deleteData);
  }
}
