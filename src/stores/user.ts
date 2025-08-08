import { defineStore } from "pinia";
import { ref } from "vue";
import { Authentication } from "../services/auth/Authentication";
import { AuthenticationUtils } from "../utils/AuthenticationUtils";
import { usePermissionsStore } from "./permissions";

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
    const permissionsStore = usePermissionsStore();

    user.value = await userData;

    // Configura as permissões do usuário após o login
    if (user.value?.Permissoes) {
      console.log("user.value.Permissoes", user.value.Permissoes);
      await permissionsStore.setPermissions(user.value.Permissoes);
    }
  }

  async function logout() {
    const permissionsStore = usePermissionsStore();

    user.value = null;

    // Limpa as permissões ao fazer logout
    await permissionsStore.setPermissions([]);
  }

  function getData() {
    return user.value;
  }
  async function initUser() {
    const permissionsStore = usePermissionsStore();

    try {
      if (!user.value?.ID) {
        const recover = await Authentication.recoverUserData();
        if (!!recover.error) {
          console.log("Error recovering user data:", recover);
          new AuthenticationUtils().removeToken();
          return;
        } else {
          user.value = recover;

          // Configura as permissões do usuário após recuperar os dados
          if (user.value?.Permissoes) {
            await permissionsStore.setPermissions(user.value.Permissoes);
          }
        }
      } else {
        // Se o usuário já existe, certifica-se de que as permissões estão configuradas
        if (user.value?.Permissoes) {
          await permissionsStore.setPermissions(user.value.Permissoes);
        }
      }
    } catch (error) {
      console.error("Error initializing user:", error);
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
