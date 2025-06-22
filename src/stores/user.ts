import { defineStore } from "pinia";
import { ref } from "vue";

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

  return {
    user,
    login,
    logout,
    getData,
  };
});
