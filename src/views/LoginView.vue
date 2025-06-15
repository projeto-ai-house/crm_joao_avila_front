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
            <transition :name="transitionName" mode="out-in">
              <div v-if="inLogin" key="login" class="form-login w-full">
                <LoginFormComponent @click:recovery="showRecovery" />
              </div>
              <div v-else key="recovery" class="form-recovey w-full">
                <RecoveryFormComponentCopy @click:login="showLogin" />
              </div>
            </transition>
          </div>
        </template>
      </Card>
    </div>
  </VideoComponent>
</template>

<script lang="ts" setup>
import VideoComponent from "@/components/VideoComponent.vue";
import Card from "primevue/card";
import LoginFormComponent from "../components/LoginForm/LoginFormComponent.vue";
import { ref } from "vue";
import RecoveryFormComponentCopy from "../components/LoginForm/RecoveryFormComponent copy.vue";
import { LoaderPinwheel } from "lucide-vue-next";

const inLogin = ref(true);
const transitionName = ref("slide-left");

function showRecovery() {
  transitionName.value = "slide-left";
  inLogin.value = false;
}

function showLogin() {
  transitionName.value = "slide-right";
  inLogin.value = true;
}
</script>

<style scoped>
@media screen and (min-width: 640px) {
  .form-slider-container {
    min-height: 280px !important;
  }
}
.form-slider-container {
  position: relative;
  min-height: 300px;
}

/* Slide para a esquerda (login -> recovery) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Slide para a direita (recovery -> login) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}
.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
