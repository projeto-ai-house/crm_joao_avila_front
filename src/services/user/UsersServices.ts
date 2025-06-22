import type { AxiosResponse } from "axios";
import callApi from "../Api";

interface IUser {
  Email: string;
  Nome: string;
  Cpf: string;
  DataNascimento: string;
  Convenio: string;
  PasswordHash: string;
  Telefone: string;
  RoleID: string;
  ClinicaID: string;
}

const ROUTE: string = "/usuario";
export class UsersServices {
  public static async getUsers(params: {
    page: number;
  }): Promise<AxiosResponse> {
    return callApi(ROUTE, "get", params);
  }
  public static async postUser(body: IUser): Promise<AxiosResponse> {
    return callApi(ROUTE, "post", undefined, body);
  }
}
