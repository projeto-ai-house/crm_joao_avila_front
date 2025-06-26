<script setup lang="ts">
import "./style.css";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import GlobalLoading from "@/components/GlobalLoading.vue";
import { onBeforeMount, provide, ref } from "vue";
import { AuthenticationUtils } from "./utils/AuthenticationUtils";
import { useRouter } from "vue-router";
import { useUserStore } from "./stores/user";
import { Authentication } from "./services/auth/Authentication";
import { useToast } from "primevue";

const globalLoading = ref(false);
provide("globalLoading", globalLoading);
const router = useRouter();
const userStore = useUserStore();
const toast = useToast();

// onBeforeMount(async () => {
//   globalLoading.value = true;

//   const isAuthenticated = new AuthenticationUtils().isAuthenticated();
//   if (!isAuthenticated) {
//     globalLoading.value = false;
//     toast.add({
//       severity: "info",
//       summary: "Você não está logado!",
//       detail: "Faça login para continuar.",
//       life: 3000,
//     });
//     router.push({ name: "Login" });
//     return;
//   }

//   if (!userStore.user?.ID) {
//     const recover = await Authentication.recoverUserData();
//     if (!!recover.error) {
//       // new AuthenticationUtils().removeToken();
//       console.log("Error recovering user data:", recover);
//       new AuthenticationUtils().removeToken();
//       globalLoading.value = false;
//       toast.add({
//         severity: "info",
//         summary: "Você não está logado!",
//         detail: "Faça login para continuar.",
//         life: 3000,
//       });
//       router.push({ name: "Login" });
//       return;
//     } else {
//       await userStore.login(recover);
//       // console.log("User Data:", recover);
//       console.log("Rota atual:", router.currentRoute.value.name);
      
//       toast.add({
//         severity: "contrast",
//         summary: "Bem-vindo de volta!",
//         detail: `Olá, ${recover?.Nome}!`,
//         life: 3000,
//       });
//       globalLoading.value = false;
//       // router.push({ name: "Dashboard" });
//     }
//   }
// });
</script>

<template>
  <Toast position="top-center" />
  <ConfirmDialog />
  <GlobalLoading :model-value="globalLoading" />
  <router-view />
</template>
