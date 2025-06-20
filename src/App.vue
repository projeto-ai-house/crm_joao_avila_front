<script setup lang="ts">
import "./style.css";
import Toast from "primevue/toast";
import GlobalLoading from "@/components/GlobalLoading.vue";
import { provide, ref } from "vue";

const globalLoading = ref(false);
provide("globalLoading", globalLoading);
</script>

<template>
  <Toast position="top-center" />
  <GlobalLoading :model-value="globalLoading" />
  <router-view />
</template>
