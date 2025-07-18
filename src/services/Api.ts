declare module "axios" {
  export interface AxiosRequestConfig {
    ignoreNotification?: boolean;
  }
}

import axios from "axios";
import { NotificationService } from "../utils/NotificationUtils";
// Cria a instância do Axios com configurações padrão
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://sua-api.com", // use .env ou um fallback
  timeout: 10000, // tempo máximo de espera (10 segundos)
  headers: {
    "Content-Type": "application/json",
  },
});

// Exemplo de interceptor de requisição
api.interceptors.request.use(
  (config) => {
    // Se você tiver token salvo, pode injetar aqui
    const AUTH_TOKEN = import.meta.env.VITE_TOKEN_KEY || "token";
    const token = localStorage.getItem(AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Exemplo de interceptor de resposta
api.interceptors.response.use(
  (response) => {
    if (!response.config.ignoreNotification) {
      NotificationService.tell(
        response.status,
        undefined,
        response.data?.message
      );
    }
    return response;
  },
  (error) => {
    const config = error.config || {};
    if (!config.ignoreNotification) {
      if (error.response) {
        NotificationService.tell(
          error.response.status,
          undefined,
          error.response.data?.message
        );
      } else {
        NotificationService.tell(
          0,
          "Erro de rede",
          "Sem resposta do servidor."
        );
      }
    }
    return Promise.reject(error);
  }
);

export function callApi(
  endpoint: string,
  method: "get" | "post" | "put" | "delete",
  params?: any,
  data?: any,
  responseType: "json" | "blob" | "text" = "json",
  ignoreNotification: boolean = false
) {
  // Verifica se o data é FormData
  const isFormData = data instanceof FormData;

  // Define o Content-Type de acordo com o tipo de dado
  const headers = {
    "Content-Type": isFormData ? "multipart/form-data" : "application/json",
  };
  // Adicione outras verificações de tipo de dados, se necessário

  // console.log("callApi", method, url, params, data);
  return api({
    url: endpoint, // URL da API
    method, // Método HTTP (por exemplo, 'get', 'post', 'delete')
    params, // Parâmetros a serem enviados na URL (pode ser nulo se não houver parâmetros)
    data: data, // Dados a serem enviados no corpo da solicitação (apenas para POST)
    headers: headers,
    responseType: responseType || "json", // aqui permite receber Blob como resposta
    ignoreNotification: ignoreNotification, // para ignorar notificações
  });
}

export default callApi;
