import type { AxiosResponse } from "axios";
import type { UserType } from "../../stores/user";
import { AuthenticationUtils } from "../../utils/AuthenticationUtils";
import callApi from "../Api";

const ROUTE: string = "/auth";

interface IUserWithError extends UserType {
  error: string | null;
  status?: number;
}
export class Authentication {
  public static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse> {
    // Simula uma chamada de API para autenticação
    const response = await callApi(ROUTE + "/login", "post", null, {
      Email: email,
      Senha: password,
    });
    if (response.status === 200) {
      const data = await response.data;
      new AuthenticationUtils().storageToken(data?.data?.Token);
    }
    return response;
  }

  public static async recoverUserData(): Promise<IUserWithError> {
    // Simula uma chamada de API para recuperar os dados do usuário
    try {
      const response = await callApi(
        ROUTE + "/eu",
        "get",
        undefined,
        undefined,
        undefined,
        true
      );
      if (response.status === 200) {
        const data = await response?.data;
        return { ...data?.data, error: null };
      } else {
        const errorMessage =
          response.data?.data?.message || "Erro ao recuperar dados do usuário";
        const status = response.status || 500;
        return { error: errorMessage, status, ...({} as UserType) };
      }
    } catch (error: any) {
      // console.error("Erro ao recuperar dados do usuário:", error);
      const errorMessage =
        error.response?.data?.message || "Erro ao recuperar dados do usuário";
      const status = error.status || 500;
      return { error: errorMessage, status, ...({} as UserType) };
    }
  }

  public static async recoverUserPassword(
    email: string
  ): Promise<AxiosResponse> {
    // Simula uma chamada de API para recuperar a senha do usuário
    return callApi(ROUTE + "/token", "post", null, {
      Email: email,
    });
  }

  public static async validateToken(
    email: string,
    token: string
  ): Promise<AxiosResponse> {
    // Simula uma chamada de API para validar o token de recuperação
    return callApi(ROUTE + "/token", "put", null, {
      Email: email,
      Token: token,
    });
  }
}
