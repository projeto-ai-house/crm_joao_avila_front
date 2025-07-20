<template>
  <div class="w-full h-full flex items-center justify-center">
    <header
      class="text-center mb-4 text-black max-w-2xl !font-secondary flex flex-col items-center justify-center"
    >
      <img
        src="@/assets/images/logo.png"
        alt="Mednova Logo"
        class="w-20 md:w-24 h-20 md:h-24 mb-1 mx-auto drop-shadow-2xl drop-shadow-gray-800/20"
      />
      <h1 class="text-2xl md:text-4xl font-normal mb-2">Mednova</h1>
      <p class="text-md px-4 md:text-xl">Configurações do Usuário</p>
      <!-- <LoaderPinwheel class="animate-spin text-gray-600" /> -->
    </header>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "primevue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();

onMounted(() => {
  const state = router.options.history?.state;
  const inRecovery = state?.inRecovery
    ? JSON.parse(state?.inRecovery as string)
    : false;
  if (inRecovery) {
    toast.add({
      severity: "warn",
      summary: "Você recuperou seu acesso!",
      detail: "Altere sua senha já!",
      life: 8000,
    });
  }
});
</script>
