import type { AxiosResponse } from "axios";
import callApi from "../Api";

export class NotificationsServices {
  public static async getHistory(): Promise<AxiosResponse> {
    return await callApi("/notifications/history", "get");
  }
}
