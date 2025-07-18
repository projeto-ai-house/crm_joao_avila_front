import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar bibliotecas grandes em chunks separados
          primevue: ["primevue"],
          lucide: ["lucide-vue-next"],
          pinia: ["pinia"],
          "vue-router": ["vue-router"],
          axios: ["axios"],
        },
      },
    },
    // Aumentar o limite para evitar warnings sobre chunks grandes
    chunkSizeWarningLimit: 1000,
  },
});
