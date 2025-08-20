import type { AxiosResponse } from "axios";
import callApi from "../Api";

interface IUser {
  Email: string;
  Nome: string;
  Cpf: string;
  DataNascimento: string;
  Convenio?: string;
  PasswordHash: string;
  Telefone: string;
  RoleID: string;
  ClinicaID?: string;
}

interface IAddUser extends IUser {}

interface IUpdateUser {
  Usuario: {
    ID: string;
    Email?: string;
    Cpf?: string;
    data_nascimento?: string;
    Telefone?: string;
    Convenio?: string;
    password_hash?: string;
    nome_completo?: string;
  };
  Role?: {
    role_id: string;
  };
}

const ROUTE: string = "/usuario";
export class UsersServices {
  public static async getUsers(params: {
    page: number;
    limit?: number;
  }): Promise<AxiosResponse> {
    return callApi(ROUTE, "get", params, undefined, undefined, true);
  }
  public static async postUser(body: IAddUser): Promise<AxiosResponse> {
    return callApi(ROUTE, "post", undefined, body);
  }
  public static async putUser(body: IUpdateUser): Promise<AxiosResponse> {
    return callApi(ROUTE, "put", undefined, body);
  }
  public static async deleteUser(id: string): Promise<AxiosResponse> {
    return callApi(ROUTE, "delete", { id });
  }
}
