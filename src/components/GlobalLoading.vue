<template>
  <transition name="fade">
    <div
      v-if="internalValue"
      class="fixed inset-0 z-[1200] flex items-center justify-center bg-transparent bg-opacity-60 backdrop-blur-sm"
      style="pointer-events: all"
    >
      <div class="flex flex-col items-center">
        <i
          class="pi pi-spin pi-spinner text-blue-500 mb-4"
          style="font-size: 2.4rem"
        ></i>
        <span class="text-blue-500 text-lg font-semibold">Carregando...</span>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{ modelValue: boolean }>();

const internalValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      // Se está mudando para true, mostra imediatamente
      internalValue.value = true;
    } else {
      // Se está mudando para false, adiciona um atraso de 300ms
      setTimeout(() => {
        internalValue.value = false;
      }, 300);
    }
  }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
