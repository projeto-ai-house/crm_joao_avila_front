<template>
  <div class="grid grid-cols-12 grid-rows-12 w-screen h-screen">
    <div
      class="col-span-12 lg:col-span-3 xl:col-span-2 row-span-12 bg-gray-200 h-full hidden xl:block"
    ></div>
    <div
      class="col-span-12 lg:col-span-9 xl:col-span-10 row-span-12 bg-gray-100 h-full"
    >
      <div class="flex flex-col h-full">
        <HeaderComponent />
        <div class="flex-1 overflow-y-auto p-4">
          <router-view />
        </div>
        <footer class="bg-gray-300 p-4 text-center font-primary">
          Rodapé do Painel
        </footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import HeaderComponent from "@/components/HeaderComponent.vue";
</script>
