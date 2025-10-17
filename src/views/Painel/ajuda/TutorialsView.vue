<template>
  <div class="tutorials-view w-full h-full overflow-auto p-4 md:p-6 bg-gray-50">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <PlayCircle class="w-8 h-8 text-primary-600" :stroke-width="2" />
        <h1 class="text-3xl font-bold text-gray-800">Tutoriais</h1>
      </div>
      <p class="text-gray-600 text-lg">
        Aprenda a usar todas as funcionalidades do Mednova
      </p>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-wrap gap-3">
      <Button
        v-for="category in categories"
        :key="category.value"
        :label="category.name"
        :severity="
          selectedCategory === category.value ? 'primary' : 'secondary'
        "
        :outlined="selectedCategory !== category.value"
        @click="selectedCategory = category.value"
        size="small"
        class="!rounded-full"
      />
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <Skeleton
        v-for="i in 6"
        :key="i"
        width="100%"
        height="320px"
        class="rounded-xl"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredTutorials.length === 0"
      class="flex flex-col items-center justify-center py-16"
    >
      <VideoOff class="w-16 h-16 text-gray-300 mb-4" />
      <p class="text-gray-500 text-lg">Nenhum tutorial encontrado</p>
    </div>

    <!-- Tutorials Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-down"
    >
      <div
        v-for="tutorial in filteredTutorials"
        :key="tutorial.id"
        class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-200"
        @click="openVideo(tutorial)"
      >
        <!-- Thumbnail -->
        <div
          class="relative overflow-hidden aspect-video bg-gradient-to-br from-primary-100 to-primary-50"
        >
          <!-- Image if thumbnail exists -->
          <img
            v-if="tutorial.thumbnail"
            :src="tutorial.thumbnail"
            :alt="tutorial.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            @error="handleImageError"
          />

          <!-- Fallback when no thumbnail -->
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
          >
            <i class="pi pi-video text-gray-400 text-8xl"></i>
          </div>

          <!-- Overlay hover effect -->
          <div
            v-if="tutorial.videoUrl"
            class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Play
              class="w-16 h-16 text-white drop-shadow-lg"
              :stroke-width="1.5"
            />
          </div>

          <!-- Text icon for text-only tutorials -->
          <div
            v-else-if="tutorial.textContent"
            class="absolute inset-0 bg-primary-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <BookOpen
              class="w-16 h-16 text-primary-600 drop-shadow-lg"
              :stroke-width="1.5"
            />
          </div>

          <!-- Duration Badge (only if duration exists) -->
          <div
            v-if="tutorial.duration"
            class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded"
          >
            {{ tutorial.duration }}
          </div>

          <!-- Content Type Badge -->
          <div class="absolute top-2 left-2">
            <span
              v-if="tutorial.videoUrl && tutorial.textContent"
              class="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
            >
              Vídeo + Texto
            </span>
            <span
              v-else-if="tutorial.videoUrl"
              class="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
            >
              Vídeo
            </span>
            <span
              v-else-if="tutorial.textContent"
              class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
            >
              Texto
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <!-- Category Badge -->
          <span
            class="inline-block text-xs font-semibold px-2 py-1 rounded-full mb-2"
            :class="getCategoryColor(tutorial.category)"
          >
            {{ tutorial.category }}
          </span>

          <!-- Title -->
          <h3
            class="font-semibold text-gray-800 mb-2 text-lg line-clamp-2 group-hover:text-primary-600 transition-colors"
          >
            {{ tutorial.title }}
          </h3>

          <!-- Description -->
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">
            {{ tutorial.description }}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in tutorial.tags.slice(0, 3)"
              :key="tag"
              class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Dialog -->
    <Dialog
      v-model:visible="videoDialogVisible"
      modal
      :header="selectedTutorial?.title"
      :style="{ width: '90vw', maxWidth: '1200px' }"
      :dismissableMask="true"
    >
      <!-- Video Section (only if videoUrl exists) -->
      <div
        v-if="selectedTutorial?.videoUrl"
        class="aspect-video w-full bg-black rounded-lg overflow-hidden mb-4"
      >
        <iframe
          :src="getEmbedUrl(selectedTutorial.videoUrl)"
          class="w-full h-full"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <div>
        <p class="text-gray-700 mb-3">{{ selectedTutorial?.description }}</p>

        <!-- Tutorial Text Content (Optional) -->
        <div
          v-if="selectedTutorial?.textContent"
          class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div class="flex items-center gap-2 mb-3">
            <FileText class="w-5 h-5 text-gray-600" :stroke-width="2" />
            <h3 class="font-semibold text-gray-800">Tutorial em Texto</h3>
          </div>
          <div
            class="tutorial-content text-gray-700"
            v-html="selectedTutorial.textContent"
          ></div>
        </div>

        <div class="flex flex-wrap gap-2 mt-4">
          <span
            v-for="tag in selectedTutorial?.tags"
            :key="tag"
            class="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import {
  BookOpen,
  FileText,
  Play,
  PlayCircle,
  VideoOff,
} from "lucide-vue-next";
import { Button, Dialog, Skeleton } from "primevue";
import { computed, onMounted, ref } from "vue";
import appConfig from "../../../../app-config.json";

interface Tutorial {
  id: number;
  title: string;
  description: string;
  duration?: string; // Optional
  category: string;
  videoUrl?: string; // Optional
  thumbnail?: string; // Optional
  tags: string[];
  textContent?: string; // Optional
}

interface Category {
  name: string;
  value: string;
}

const tutorials = ref<Tutorial[]>([]);
const categories = ref<Category[]>([]);
const selectedCategory = ref<string>("all");
const loading = ref(true);
const videoDialogVisible = ref(false);
const selectedTutorial = ref<Tutorial | null>(null);

const filteredTutorials = computed(() => {
  if (selectedCategory.value === "all") {
    return tutorials.value;
  }
  return tutorials.value.filter(
    (tutorial) => tutorial.category === selectedCategory.value
  );
});

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Iniciante: "bg-green-100 text-green-700",
    Intermediário: "bg-blue-100 text-blue-700",
    Avançado: "bg-purple-100 text-purple-700",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
}

function getEmbedUrl(url: string): string {
  if (!url) return "";

  // Extract video ID from various YouTube URL formats
  let videoId = "";

  if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1].split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  }

  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

function openVideo(tutorial: Tutorial) {
  selectedTutorial.value = tutorial;
  videoDialogVisible.value = true;
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  // Hide broken image and let the fallback div show instead
  target.style.display = "none";
}

onMounted(() => {
  // Simulate loading for better UX
  setTimeout(() => {
    tutorials.value = appConfig.tutorials as Tutorial[];
    categories.value = appConfig.categories as Category[];
    loading.value = false;
  }, 500);
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Estilos para o conteúdo HTML do tutorial */
.tutorial-content {
  line-height: 1.6;
}

.tutorial-content :deep(h1),
.tutorial-content :deep(h2),
.tutorial-content :deep(h3),
.tutorial-content :deep(h4),
.tutorial-content :deep(h5),
.tutorial-content :deep(h6) {
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.tutorial-content :deep(h4) {
  font-size: 1.125rem;
  margin-top: 1.5rem;
}

.tutorial-content :deep(p) {
  margin-bottom: 0.75rem;
}

.tutorial-content :deep(ul),
.tutorial-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.tutorial-content :deep(ul) {
  list-style-type: disc;
}

.tutorial-content :deep(ol) {
  list-style-type: decimal;
}

.tutorial-content :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.tutorial-content :deep(strong) {
  font-weight: 600;
  color: #111827;
}

.tutorial-content :deep(em) {
  font-style: italic;
}

.tutorial-content :deep(a) {
  color: #6366f1;
  text-decoration: underline;
}

.tutorial-content :deep(a:hover) {
  color: #4f46e5;
}

.tutorial-content :deep(code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875em;
}

.tutorial-content :deep(pre) {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.tutorial-content :deep(blockquote) {
  border-left: 4px solid #6366f1;
  padding-left: 1rem;
  margin-left: 0;
  margin-bottom: 1rem;
  color: #4b5563;
  font-style: italic;
}
</style>
