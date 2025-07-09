import type { AxiosResponse } from "axios";
import callApi from "../Api";

interface IUserLinks {
  MedicoID: string;
  SecretariaID: string;
}

const ROUTE: string = "/usuario/secretaria";
export class UserLinksServices {
  public static async getUsers(): Promise<AxiosResponse> {
    return callApi(ROUTE, "get");
  }
  public static async postUser(body: IUserLinks): Promise<AxiosResponse> {
    return callApi(ROUTE, "post", undefined, body);
  }
  public static async deleteUser(body: IUserLinks): Promise<AxiosResponse> {
    return callApi(ROUTE, "delete", undefined, body);
  }
}
