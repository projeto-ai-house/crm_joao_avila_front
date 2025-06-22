<template>
  <!-- <ImageComponent> -->
  <div
    class="grid grid-cols-12 grid-rows-12 w-screen h-screen !bg-gradient-to-br !from-gray-50 !to-gray-100"
  >
    <div
      class="col-span-12 lg:col-span-3 xl:col-span-2 row-span-12 h-full hidden lg:block p-4 pr-0"
    >
      <SideMenuLayout />
    </div>
    <div
      class="col-span-12 lg:col-span-9 xl:col-span-10 row-span-12 h-full md:p-4"
    >
      <div
        class="flex flex-col h-full backdrop-blur-xl border border-white/10 md:rounded-2xl shadow-xl overflow-hidden bg-white"
      >
        <HeaderLayout />
        <div class="flex-1 p-4 w-full overflow-y-auto">
          <Transition name="fade" mode="out-in">
            <router-view />
          </Transition>
        </div>
        <!-- <footer class="p-4 text-center font-primary">Rodapé do Painel</footer> -->
      </div>
    </div>
  </div>
  <!-- </ImageComponent> -->
</template>

<script lang="ts" setup>
// @ts-ignore
import HeaderLayout from "@/layouts/HeaderLayout.vue";
import SideMenuLayout from "@/layouts/SideMenuLayout.vue";
</script>

<style scoped>
/* Classes de transição */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(24px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
