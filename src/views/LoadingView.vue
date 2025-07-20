<template>
  <VideoComponent>
    <header class="text-center mb-4 text-black max-w-2xl !font-secondary">
      <img
        src="@/assets/images/logo.png"
        alt="Mednova Logo"
        class="w-20 md:w-24 h-20 md:h-24 mb-1 mx-auto drop-shadow-2xl drop-shadow-gray-800/20"
      />
      <h1 class="text-2xl md:text-4xl font-normal mb-2">Mednova</h1>
      <p class="text-md px-4 md:text-xl">
        Automação Inteligente para Clínicas Modernas
      </p>
      <!-- <LoaderPinwheel class="animate-spin text-gray-600" /> -->
    </header>
    <div class="max-w-xl p-4">
      <Card
        class="overflow-hidden !shadow-xl !backdrop-blur-xl !bg-white/0 !bg-gradient-to-b !from-white/20 !to-white/80 border border-white/10 !rounded-2xl !px-1 !py-2 md:!px-2 md:!py-4 w-screen max-w-[94vw] sm:max-w-full"
      >
        <template #content>
          <div class="form-slider-container !font-secondary">
            <i
              class="pi pi-spin pi-spinner text-gray-600"
              style="font-size: 2rem"
            ></i>
          </div>
        </template>
      </Card>
    </div>
  </VideoComponent>
</template>

<script lang="ts" setup>
import VideoComponent from "@/components/VideoComponent.vue";
import Card from "primevue/card";
</script>
<style scoped></style>
