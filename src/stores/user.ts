import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref<any>({});

  function login(userData: any) {
    user.value = userData;
  }

  function logout() {
    user.value = {};
  }

  return {
    user,
    login,
    logout,
  };
});
