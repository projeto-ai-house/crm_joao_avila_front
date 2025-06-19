<template>
  <div class="app-container">
    <div class="image-background">
      <img :src="videoSource" alt="Background" class="whiten-image" />
    </div>

    <div class="content-overlay">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import videoSource from "../assets/images/bg-login-image.avif";
</script>

<style scoped>
/* Contêiner principal da aplicação */
.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* Garante que nada saia dos limites da tela */
}

/* Contêiner que segura o elemento de imagem */
.image-background {
  position: fixed; /* Posição fixa em relação à janela de visualização */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Coloca a imagem atrás de todo o outro conteúdo */
  overflow: hidden;
}
/* O elemento de imagem em si */
.image-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.whiten-image {
  background-color: white !important;
  /* filter: opacity(0.6) ; */
  /* Sobreposição branca usando pseudo-elemento */
  position: relative;
}

.content-overlay {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* background-color: rgba(0, 0, 0, 0.4); */
}
</style>
