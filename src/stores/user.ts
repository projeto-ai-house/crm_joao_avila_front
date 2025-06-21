import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref<any>({});

  async function login(userData: any) {
    user.value = await userData;
  }

  async function logout() {
    user.value = {};
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
