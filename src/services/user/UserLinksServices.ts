import type { AxiosResponse } from "axios";
import callApi from "../Api";

interface IUserLinks {
  MedicoID: string;
  SecretariaID: string;
}

const ROUTE: string = "/usuario/secretaria";
export class UserLinksServices {
  public static async getLinks(): Promise<AxiosResponse> {
    return callApi(ROUTE, "get", undefined, undefined, undefined, true);
  }
  public static async postLink(body: IUserLinks): Promise<AxiosResponse> {
    return callApi(ROUTE, "post", undefined, body, undefined, true);
  }
  public static async deleteLink(body: IUserLinks): Promise<AxiosResponse> {
    return callApi(ROUTE, "delete", undefined, body, undefined, true);
  }
}
