import type { AxiosResponse } from "axios";
import callApi from "../Api";

const ROUTE: string = "/auth";
export class Authentication {
  public static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse> {
    // Simula uma chamada de API para autenticação
    return callApi(ROUTE + "/login", "post", null, {
      Email: email,
      Senha: password,
    });
  }
  // public static async logout(): Promise<void> {
  //   // Simula uma chamada de API para logout
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve();
  //     }, 1000);
  //   });
  // }
  public static async register(
    email: string,
    password: string
  ): Promise<string> {
    // Simula uma chamada de API para registro
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          resolve("fake-jwt-token");
        } else {
          reject(new Error("Dados inválidos para registro"));
        }
      }, 1000);
    });
  }
}
