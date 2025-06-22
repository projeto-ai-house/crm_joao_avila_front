import type { AxiosResponse } from "axios";
import callApi from "../Api";

const ROUTE: string = "/roles";
export class RolesServices {
  public static async getRoles(params: any): Promise<AxiosResponse> {
    return callApi(
      ROUTE + `/${params.id}`,
      "get",
      undefined,
      undefined,
      undefined,
      true
    );
  }
}
