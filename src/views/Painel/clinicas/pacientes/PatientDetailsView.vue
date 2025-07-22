<template>
  <div class="flex justify-between items-center pl-1 py-4 bg-white">
    <div>
      <h2 class="font-semibold text-gray-500">Paciente</h2>
      <p class="text-sm text-gray-400"></p>
    </div>
    <div class="flex gap-2">
      <Button
        icon="pi pi-save"
        label="Salvar"
        severity="primary"
        size="small"
        @click="router.go(-1)"
      />
      <Button
        label="Voltar"
        severity="secondary"
        size="small"
        variant="text"
        class="ml-2"
        @click="router.go(-1)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "primevue";
import { useRouter } from "vue-router";

const router = useRouter();
</script>
