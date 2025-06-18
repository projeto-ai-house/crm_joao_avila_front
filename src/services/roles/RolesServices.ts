import type { AxiosResponse } from "axios";
import callApi from "../Api";

const ROUTE: string = "/auth";
export class RolesServices {
  public static async getRoles(params: any): Promise<AxiosResponse> {
    return callApi(ROUTE + `/auth/roles/${params.id}`, "get");
  }
}
