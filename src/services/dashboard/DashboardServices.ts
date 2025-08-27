import type { AxiosResponse } from "axios";
import callApi from "../Api";

const ROUTE: string = "/dashboard";
export class DashboardServices {
  public static async getDaySchedule(): Promise<
    AxiosResponse<{ message: string; data: any[] }>
  > {
    return callApi(
      ROUTE + "/dia/agendamentos",
      "get",
      undefined,
      undefined,
      undefined,
      true
    );
  }

  public static async getMonthSchedule(): Promise<
    AxiosResponse<{ message: string; data: any[] }>
  > {
    return callApi(
      ROUTE + "/mes/agendamentos",
      "get",
      undefined,
      undefined,
      undefined,
      true
    );
  }

  public static async getDayAI(): Promise<
    AxiosResponse<{ message: string; data: any }>
  > {
    return callApi(
      ROUTE + "/dia/IA",
      "get",
      undefined,
      undefined,
      undefined,
      true
    );
  }

  public static async getMonthAI(): Promise<
    AxiosResponse<{ message: string; data: any }>
  > {
    return callApi(
      ROUTE + "/mes/IA",
      "get",
      undefined,
      undefined,
      undefined,
      true
    );
  }

  public static async getBirthdays(): Promise<
    AxiosResponse<{ message: string; data: any }>
  > {
    return callApi(
      ROUTE + "/aniversariantes",
      "get",
      undefined,
      undefined,
      undefined,
      true
    );
  }

  public static async getDaySchedulesList(params: {
    data: string;
  }): Promise<AxiosResponse<{ message: string; data: any }>> {
    return callApi(
      ROUTE + "/horarios-ocupados",
      "get",
      params,
      undefined,
      undefined,
      true
    );
  }
}
