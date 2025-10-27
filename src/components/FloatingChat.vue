<template>
  <div v-if="userStore.user?.Role?.includes('CEO')">
    <!-- Chat Expandido -->
    <Transition name="chat-expand">
      <div
        v-if="isOpen"
        class="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col chat-container"
      >
        <!-- Header do Chat -->
        <div class="relative overflow-hidden chat-header">
          <div class="relative z-10 p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30"
              >
                <Sparkles :size="20" class="text-white" />
              </div>
              <div>
                <h3 class="font-semibold text-white">Secretária Interna</h3>
                <div class="flex items-center gap-1.5">
                  <div
                    :class="[
                      'w-2 h-2 rounded-full transition-colors duration-300',
                      connectionState === 'connected'
                        ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]'
                        : connectionState === 'connecting'
                        ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse'
                        : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]',
                    ]"
                  ></div>
                  <p class="text-xs text-blue-100">
                    {{
                      connectionState === "connected"
                        ? "Online"
                        : connectionState === "connecting"
                        ? "Conectando..."
                        : connectionState === "error"
                        ? "Erro na conexão"
                        : "Offline"
                    }}
                  </p>
                </div>
              </div>
            </div>
            <button
              @click="toggleChat"
              class="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors duration-300 cursor-pointer"
            >
              <X :size="20" class="text-white" />
            </button>
          </div>
        </div>

        <!-- Área de Mensagens -->
        <div
          ref="messagesContainer"
          class="flex-1 p-4 overflow-y-auto bg-gray-50"
        >
          <div class="flex flex-col gap-3">
            <!-- Mensagem de erro -->
            <div
              v-if="errorMessage"
              class="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700"
            >
              {{ errorMessage }}
            </div>

            <!-- Estado vazio -->
            <p
              v-if="messages.length === 0"
              class="text-center text-gray-400 text-sm mt-8"
            >
              Nenhuma mensagem ainda. <br />
              Inicie uma conversa!
            </p>

            <!-- Mensagens -->
            <div
              v-for="message in messages"
              :key="message.id"
              :class="[
                'flex',
                message.sender === 'user' ? 'justify-end' : 'justify-start',
              ]"
            >
              <div
                :class="[
                  'max-w-[75%] rounded-2xl shadow-sm overflow-hidden',
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200',
                ]"
              >
                <!-- Anexos de imagem -->
                <div
                  v-if="message.hasAttachments && message.attachments?.length"
                  class="p-3"
                >
                  <div
                    v-for="attachment in message.attachments"
                    :key="attachment.id"
                    class="mb-3 last:mb-0"
                  >
                    <!-- Imagem disponível -->
                    <div
                      v-if="
                        attachment.file_url &&
                        !attachment.file_url.startsWith('blob:')
                      "
                      class="rounded-lg overflow-hidden"
                    >
                      <AuthenticatedImage
                        :src="attachment.file_url"
                        :alt="attachment.file_name"
                        :preview="true"
                        img-class="max-w-full w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </div>

                    <!-- Placeholder de imagem sendo processada (blob URL) -->
                    <div
                      v-else
                      class="flex items-center gap-3 p-3 bg-gray-100 rounded-lg border border-gray-300"
                    >
                      <div
                        class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0"
                      >
                        <ImagePlus :size="20" class="text-blue-600" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-800 truncate">
                          {{ attachment.file_name }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ (attachment.file_size / 1024 / 1024).toFixed(2) }}
                          MB • Enviada com sucesso
                        </p>
                      </div>
                    </div>

                    <p
                      v-if="attachment.caption"
                      class="text-xs mt-2 opacity-80 italic"
                    >
                      {{ attachment.caption }}
                    </p>
                  </div>
                </div>

                <!-- Texto da mensagem -->
                <div
                  v-if="message.text && message.text !== '📷 Imagem'"
                  :class="[
                    'px-4',
                    message.hasAttachments ? 'pt-0 pb-2' : 'py-2',
                  ]"
                >
                  <p class="text-sm break-words whitespace-pre-wrap">
                    {{ message.text }}
                  </p>
                </div>

                <!-- Timestamp e status -->
                <div
                  :class="[
                    'flex items-center gap-1 px-4 pb-2 text-xs',
                    message.sender === 'user'
                      ? 'text-blue-100 justify-end'
                      : 'text-gray-400',
                    message.hasAttachments || message.text ? '' : 'pt-2',
                  ]"
                >
                  <span>{{
                    message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}</span>
                  <Loader2
                    v-if="message.status === 'sending'"
                    :size="12"
                    class="animate-spin"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensagens Rápidas (Carousel) -->
        <div
          v-if="quickMessages.length > 0"
          class="px-4 pb-3 bg-white border-b border-gray-200"
        >
          <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              v-for="quickMsg in quickMessages"
              :key="quickMsg.id"
              @click="sendQuickMessage(quickMsg.text)"
              :disabled="connectionState !== 'connected'"
              class="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed quick-message-btn"
              :class="getQuickMessageColor(quickMsg.color)"
            >
              <i :class="`pi ${quickMsg.icon} text-xs`"></i>
              <span class="whitespace-nowrap">{{ quickMsg.text }}</span>
            </button>
          </div>
        </div>

        <!-- Preview de Imagem Selecionada -->
        <div
          v-if="imagePreviewUrl"
          class="px-4 py-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200"
        >
          <div class="flex items-start gap-3">
            <!-- Preview da Imagem -->
            <div class="relative flex-shrink-0">
              <img
                :src="imagePreviewUrl"
                alt="Preview"
                class="max-h-40 max-w-[200px] rounded-xl border-2 border-gray-300 shadow-sm object-cover"
              />
              <button
                @click="cancelImageSelection"
                class="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all cursor-pointer"
                :disabled="isUploading"
              >
                <X :size="16" class="text-white" />
              </button>
              <!-- Indicador de progresso -->
              <div
                v-if="isUploading"
                class="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200 rounded-b-xl overflow-hidden"
              >
                <div
                  class="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                  :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>
            </div>

            <!-- Informações do Arquivo -->
            <div class="flex-1 min-w-0 pt-1">
              <p class="text-sm font-medium text-gray-800 truncate mb-1">
                {{ selectedImage?.name }}
              </p>
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                >
                  <ImagePlus :size="12" />
                  {{ (selectedImage!.size / 1024 / 1024).toFixed(2) }} MB
                </span>
                <span
                  v-if="isUploading"
                  class="text-xs text-gray-500 font-medium"
                >
                  {{ uploadProgress }}%
                </span>
              </div>
              <p
                v-if="isUploading"
                class="text-xs text-gray-400 mt-1 flex items-center gap-1"
              >
                <Loader2 :size="10" class="animate-spin" />
                Enviando imagem...
              </p>
            </div>
          </div>
        </div>

        <!-- Input de Mensagem -->
        <div class="p-4 bg-white border-t border-gray-200">
          <!-- Input file oculto -->
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp"
            class="hidden"
            @change="handleFileSelect"
          />

          <div class="flex gap-2">
            <!-- Botão de anexar imagem -->
            <button
              @click="openFileSelector"
              :disabled="
                connectionState !== 'connected' ||
                isUploading ||
                !!selectedImage
              "
              class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ImagePlus :size="18" class="text-gray-600" />
            </button>

            <input
              v-model="messageInput"
              type="text"
              :placeholder="
                selectedImage
                  ? 'Adicione uma legenda (opcional)...'
                  : 'Digite sua mensagem...'
              "
              class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :disabled="connectionState !== 'connected' || isUploading"
              @keypress="handleKeyPress"
            />
            <button
              @click="selectedImage ? sendImageMessage() : sendMessage()"
              :disabled="
                (selectedImage
                  ? isUploading
                  : !messageInput.trim() || connectionState !== 'connected') ||
                isUploading
              "
              class="w-10 h-10 rounded-full send-button flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader2
                v-if="isUploading"
                :size="18"
                class="text-white animate-spin"
              />
              <Send v-else :size="18" class="text-white" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Botão Flutuante -->
    <Transition name="button-fade" mode="out-in">
      <button
        v-if="!isOpen"
        @click="toggleChat"
        class="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer floating-button"
      >
        <Sparkles :size="24" class="text-white relative z-10" />
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ImagePlus, Loader2, Send, Sparkles, X } from "lucide-vue-next";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import appConfig from "../../app-config.json";
import { ImageUploadService } from "../services/websocket/ImageUploadService";
import { WebSocketService } from "../services/websocket/WebSocketService";
import type {
  ChatMessage,
  ConnectionState,
} from "../services/websocket/WebSocketTypes";
import { useUserStore } from "../stores/user";
import AuthenticatedImage from "./AuthenticatedImage.vue";

interface QuickMessage {
  id: number;
  text: string;
  icon: string;
  color: string;
}

const userStore = useUserStore();
const isOpen = ref(false);
const messages = ref<ChatMessage[]>([]);
const messageInput = ref("");
const messagesContainer = ref<HTMLElement | null>(null);
const connectionState = ref<ConnectionState>("disconnected");
const errorMessage = ref<string | null>(null);
const quickMessages = ref<QuickMessage[]>([]);

// Upload de imagens
const fileInput = ref<HTMLInputElement | null>(null);
const selectedImage = ref<File | null>(null);
const imagePreviewUrl = ref<string | null>(null);
const uploadProgress = ref<number>(0);
const isUploading = ref(false);

let wsService: WebSocketService | null = null;
let imageUploadService: ImageUploadService | null = null;

// Carregar mensagens rápidas do config
onMounted(() => {
  quickMessages.value = (appConfig.chat?.quickMessages || []) as QuickMessage[];
});

// Função para obter cor da mensagem rápida
function getQuickMessageColor(color: string): string {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100",
    red: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
    green:
      "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100",
    purple:
      "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100",
    orange:
      "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100",
  };
  return (
    colorMap[color] ||
    "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
  );
}

// Enviar mensagem rápida
function sendQuickMessage(text: string) {
  messageInput.value = text;
}

// Configurar WebSocket
const setupWebSocket = () => {
  const userData = userStore.getData();
  if (!userData?.ID || !userData?.Clinica?.[0]?.ID) {
    console.error("Dados do usuário incompletos");
    return;
  }

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:1000";
  const token =
    localStorage.getItem(import.meta.env.VITE_TOKEN_KEY || "token") || "";

  wsService = new WebSocketService({
    baseUrl,
    clinicaId: userData.Clinica[0].ID,
    userId: userData.ID,
    token,
  });

  // Instanciar serviço de upload de imagens
  imageUploadService = new ImageUploadService(baseUrl, token);

  // Callbacks
  wsService.onStateChange((state) => {
    connectionState.value = state;
    // console.log("Estado da conexão:", state);
  });

  wsService.onMessage((message) => {
    messages.value.push(message);
    scrollToBottom();
  });

  wsService.onError((error) => {
    errorMessage.value = error;
    setTimeout(() => {
      errorMessage.value = null;
    }, 5000);
  });

  // Conectar
  wsService.connect();
};

// Toggle chat
const toggleChat = () => {
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    // Conectar ao WebSocket quando abrir
    if (!wsService) {
      setupWebSocket();
    } else if (wsService.getState() === "disconnected") {
      wsService.connect();
    }
    nextTick(() => scrollToBottom());
  }
};

// Enviar mensagem
const sendMessage = () => {
  const text = messageInput.value.trim();
  if (!text || !wsService) return;

  // Adicionar mensagem do usuário à lista
  const userMessage: ChatMessage = {
    id: `user-${Date.now()}`,
    text,
    sender: "user",
    timestamp: new Date(),
    status: "sending",
  };

  messages.value.push(userMessage);
  messageInput.value = "";
  scrollToBottom();

  // Enviar via WebSocket
  const sent = wsService.sendMessage(text);

  if (sent) {
    userMessage.status = "sent";
  } else {
    userMessage.status = "error";
  }
};

// Scroll automático
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Handle Enter key
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

// Funções de gerenciamento de imagens
const openFileSelector = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // Validar tipo
  if (!imageUploadService?.validateImageType(file)) {
    errorMessage.value =
      "Tipo de arquivo não suportado. Use: JPG, PNG, GIF, WEBP ou BMP";
    setTimeout(() => {
      errorMessage.value = null;
    }, 5000);
    return;
  }

  // Validar tamanho (10MB)
  if (!imageUploadService?.validateImageSize(file, 10)) {
    errorMessage.value = "Arquivo muito grande. Tamanho máximo: 10MB";
    setTimeout(() => {
      errorMessage.value = null;
    }, 5000);
    return;
  }

  // Armazenar imagem e criar preview
  selectedImage.value = file;
  if (imageUploadService) {
    imagePreviewUrl.value = imageUploadService.createPreviewUrl(file);
  }
};

const cancelImageSelection = () => {
  if (imagePreviewUrl.value && imageUploadService) {
    imageUploadService.revokePreviewUrl(imagePreviewUrl.value);
  }
  selectedImage.value = null;
  imagePreviewUrl.value = null;
  uploadProgress.value = 0;

  // Limpar input
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const sendImageMessage = async () => {
  if (!selectedImage.value || !imageUploadService || !wsService) return;

  const userData = userStore.getData();
  if (!userData?.ID || !userData?.Clinica?.[0]?.ID) {
    errorMessage.value = "Dados do usuário incompletos";
    return;
  }

  const connectionId = wsService.getConnectionId();
  if (!connectionId) {
    errorMessage.value = "Conexão não estabelecida";
    return;
  }

  // Salvar referências antes de limpar
  const imageName = selectedImage.value.name;
  const imageType = selectedImage.value.type;
  const imageSize = selectedImage.value.size;
  const caption = messageInput.value;
  const localPreviewUrl = imagePreviewUrl.value;

  isUploading.value = true;
  uploadProgress.value = 0;

  // Adicionar mensagem local de "enviando" - SEM imagem ainda (só placeholder)
  const userMessage: ChatMessage = {
    id: `user-${Date.now()}`,
    text: caption || `📷 ${imageName}`,
    sender: "user",
    timestamp: new Date(),
    status: "sending",
    hasAttachments: false, // Não mostrar anexo ainda
  };

  messages.value.push(userMessage);
  scrollToBottom();

  try {
    // Upload da imagem
    const response = await imageUploadService.uploadImage(
      {
        image: selectedImage.value,
        connectionId: connectionId,
        clinicaId: userData.Clinica[0].ID,
        caption: caption,
      },
      (progress) => {
        uploadProgress.value = progress;
      }
    );

    // Atualizar mensagem para mostrar que foi enviada
    userMessage.status = "sent";
    userMessage.text = caption
      ? `${caption} 📎`
      : `📷 ${imageName} (enviada com sucesso)`;

    // Limpar campos APÓS o upload bem-sucedido
    messageInput.value = "";

    // Limpar preview de forma mais segura
    if (localPreviewUrl && imageUploadService) {
      imageUploadService.revokePreviewUrl(localPreviewUrl);
    }

    selectedImage.value = null;
    imagePreviewUrl.value = null;
    uploadProgress.value = 0;

    // Limpar input file
    if (fileInput.value) {
      fileInput.value.value = "";
    }

    scrollToBottom();
  } catch (error: any) {
    console.error("❌ Erro ao enviar imagem:", error);
    errorMessage.value = error.message || "Erro ao enviar imagem";

    // Atualizar mensagem com erro
    userMessage.status = "error";
    userMessage.text = `❌ Erro ao enviar: ${imageName}`;

    setTimeout(() => {
      errorMessage.value = null;
    }, 5000);
  } finally {
    isUploading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  // Não conectar automaticamente - só quando abrir o chat
});

onBeforeUnmount(() => {
  if (wsService) {
    wsService.disconnect();
  }

  // Limpar preview de imagem se existir
  if (imagePreviewUrl.value && imageUploadService) {
    imageUploadService.revokePreviewUrl(imagePreviewUrl.value);
  }
});
</script>

<style scoped>
/* Header do Chat */
.chat-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
}

/* Botão de Enviar */
.send-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
}

.send-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

/* Sombra e estilo do botão flutuante */
.floating-button {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
}

.floating-button:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.4),
    0 10px 20px rgba(59, 130, 246, 0.3);
}

.floating-button:active {
  transform: scale(1.05) translateY(0);
}

/* Transição do Chat */
.chat-expand-enter-active {
  animation: chatSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-expand-leave-active {
  animation: chatSlideOut 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes chatSlideIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes chatSlideOut {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.92) translateY(20px);
  }
}

/* Transição do Botão - Usando animation ao invés de transition */
.button-fade-enter-active {
  animation: buttonFadeIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
}

.button-fade-leave-active {
  animation: buttonFadeOut 0.2s cubic-bezier(0.4, 0, 1, 1) both;
}

@keyframes buttonFadeIn {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  60% {
    transform: scale(1.1) rotate(20deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes buttonFadeOut {
  0% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.3) rotate(180deg);
  }
}

/* Scroll suave */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}

/* Scroll horizontal para mensagens rápidas */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}

/* Botões de mensagem rápida */
.quick-message-btn {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.quick-message-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quick-message-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}

/* Animação de pulso suave para o ícone */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Responsividade: em telas pequenas, o chat aberto fica em tela cheia */
.chat-container {
  width: 420px;
  height: calc(100vh - 100px);
}

@media (max-width: 640px) {
  .chat-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0 !important;
    z-index: 60;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Ajustes visuais: header e input ocupando espaço apropriado */
  .chat-container .chat-header {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
</style>
