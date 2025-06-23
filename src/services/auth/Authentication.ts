import type { AxiosResponse } from "axios";
import callApi from "../Api";
import { AuthenticationUtils } from "../../utils/AuthenticationUtils";
import type { UserType } from "../../stores/user";

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
  // public static async logout(): Promise<void> {
  //   // Simula uma chamada de API para logout
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve();
  //     }, 1000);
  //   });
  // }

  // public static async register(
  //   email: string,
  //   password: string
  // ): Promise<string> {
  //   // Simula uma chamada de API para registro
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       if (email && password) {
  //         resolve("fake-jwt-token");
  //       } else {
  //         reject(new Error("Dados inválidos para registro"));
  //       }
  //     }, 1000);
  //   });
  // }

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
        const data = await response.data;
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
          error.response.data?.message || "Erro ao recuperar dados do usuário";
        const status = error.status || 500;
        return { error: errorMessage, status, ...({} as UserType) };
    }
  }
}
