<template>
  <div class="app-container">
    <div class="video-background">
      <video :src="videoSource" autoplay loop muted playsinline></video>
    </div>

    <div class="content-overlay">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import videoSource from "../assets/videos/bg-login-video.mp4";
</script>

<style scoped>
/* Contêiner principal da aplicação */
.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* Garante que nada saia dos limites da tela */
}

/* Contêiner que segura o elemento de vídeo */
.video-background {
  position: fixed; /* Posição fixa em relação à janela de visualização */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Coloca o vídeo atrás de todo o outro conteúdo */
  overflow: hidden;
}

/* O elemento de vídeo em si */
.video-background video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.content-overlay {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  /* background-color: rgba(0, 0, 0, 0.4); */
}
</style>
