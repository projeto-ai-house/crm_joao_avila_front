<script setup lang="ts">
import { SearchX } from "lucide-vue-next";
</script>

<template>
  <div
    class="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-lg"
  >
    <div
      class="bg-white/80 rounded-3xl shadow-2xl px-10 py-12 flex flex-col items-center max-w-md w-full border border-blue-100"
    >
      <SearchX class="w-16 h-16 text-blue-500 mb-4" />
      <h1 class="text-5xl font-extrabold text-blue-700 mb-3">404</h1>
      <h2 class="text-2xl font-semibold text-gray-800 mb-2">
        Página Não Encontrada
      </h2>
      <p class="text-gray-600 mb-6">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <router-link
        
        to="/painel"
        class="inline-block px-6 py-2 rounded-full bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition-colors"
      >
        Voltar para a página inicial
      </router-link>
    </div>
  </div>
</template>
