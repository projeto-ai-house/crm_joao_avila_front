<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent bg-opacity-60 backdrop-blur-sm"
      style="pointer-events: all"
    >
      <div class="flex flex-col items-center">
        <!-- <svg
          class="animate-spin h-12 w-12 text-blue-500 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg> -->
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
defineProps<{ modelValue: boolean }>();
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
