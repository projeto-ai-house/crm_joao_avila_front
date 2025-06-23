import { defineStore } from "pinia";
import { ref } from "vue";
import { Authentication } from "../services/auth/Authentication";
import { AuthenticationUtils } from "../utils/AuthenticationUtils";

export interface UserType {
  ID: string;
  Email: string;
  Nome: string;
  Token: string;
  Permissoes: string[];
  Cpf: string;
  DataNascimento: string;
  Convenio: string;
  DataCriacao: string;
  Role: string;
  Clinica: any[];
}

export const useUserStore = defineStore("user", () => {
  const user = ref<UserType | null>(null);

  async function login(userData: UserType) {
    user.value = await userData;
  }

  async function logout() {
    user.value = null;
  }

  function getData() {
    return user.value;
  }

  async function initUser() {
    if (!user.value?.ID) {
      const recover = await Authentication.recoverUserData();
      if (!!recover.error) {
        // console.log("Error recovering user data:", recover);
        new AuthenticationUtils().removeToken();
        return;
      } else {
        user.value = recover;
      }
    }
  }

  return {
    user,
    login,
    logout,
    getData,
    initUser,
  };
});
