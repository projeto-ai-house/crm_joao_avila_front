<script setup lang="ts">
import GlobalLoading from "@/components/GlobalLoading.vue";
import { useToast } from "primevue";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";
import { provide, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "./stores/user";
import "./style.css";

const globalLoading = ref(false);
provide("globalLoading", globalLoading);
const router = useRouter();
const userStore = useUserStore();
const toast = useToast();
</script>

<template>
  <Toast position="top-center" />
  <ConfirmDialog />
  <GlobalLoading :model-value="globalLoading" />
  <router-view />
</template>
