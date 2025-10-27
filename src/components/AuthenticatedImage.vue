<template>
  <div v-if="loading" class="w-full h-32 bg-gray-200 animate-pulse rounded-lg"></div>
  <div
    v-else-if="error"
    class="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-center"
  >
    <p class="text-sm text-red-600">Erro ao carregar imagem</p>
  </div>
  <Image
    v-else-if="preview"
    :src="blobUrl"
    :alt="alt"
    :class="imgClass"
    :preview="true"
    @click="handleClick"
  />
  <img
    v-else
    :src="blobUrl"
    :alt="alt"
    :class="imgClass"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import axios from "axios";
import Image from "primevue/image";
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    imgClass?: string;
    preview?: boolean;
  }>(),
  {
    preview: false,
  }
);

const emit = defineEmits<{
  (e: "click"): void;
}>();

const blobUrl = ref<string>("");
const loading = ref(true);
const error = ref(false);

const handleClick = () => {
  emit("click");
};

const loadImage = async () => {
  if (!props.src) {
    error.value = true;
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = false;

    // Buscar o token
    const token =
      localStorage.getItem(import.meta.env.VITE_TOKEN_KEY || "token") || "";

    // Fazer requisição com autenticação
    const response = await axios.get(props.src, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    // Criar blob URL
    const blob = response.data;
    blobUrl.value = URL.createObjectURL(blob);
    loading.value = false;
  } catch (err) {
    console.error("Erro ao carregar imagem:", err);
    error.value = true;
    loading.value = false;
  }
};

onMounted(() => {
  loadImage();
});

onBeforeUnmount(() => {
  // Limpar blob URL
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value);
  }
});
</script>
