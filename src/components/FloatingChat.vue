<template>
  <div
    class="fixed bottom-6 right-6 z-50"
    v-if="userStore.user?.Role?.includes('CEO')"
  >
    <!-- Chat Expandido -->
    <Transition name="chat-expand">
      <div
        v-if="isOpen"
        class="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col chat-container"
        :style="{}"
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
                  'max-w-[75%] rounded-2xl px-4 py-2 shadow-sm',
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200',
                ]"
              >
                <p class="text-sm break-words whitespace-pre-wrap">
                  {{ message.text }}
                </p>
                <div
                  :class="[
                    'flex items-center gap-1 mt-1 text-xs',
                    message.sender === 'user'
                      ? 'text-blue-100 justify-end'
                      : 'text-gray-400',
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

        <!-- Input de Mensagem -->
        <div class="p-4 bg-white border-t border-gray-200">
          <div class="flex gap-2">
            <input
              v-model="messageInput"
              type="text"
              placeholder="Digite sua mensagem..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :disabled="connectionState !== 'connected'"
              @keypress="handleKeyPress"
            />
            <button
              @click="sendMessage"
              :disabled="
                !messageInput.trim() || connectionState !== 'connected'
              "
              class="w-10 h-10 rounded-full send-button flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send :size="18" class="text-white" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Botão Flutuante -->
    <Transition name="button-fade">
      <button
        v-if="!isOpen"
        @click="toggleChat"
        class="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer hover:-translate-y-1 floating-button"
      >
        <!-- Gradiente de fundo -->
        <div
          class="bg-gradient-to-tr from-blue-500 via-purple-400 to-pink-500 absolute top-0 left-0 w-full h-full z-0 group-hover:scale-110 transition-transform duration-300"
        ></div>
        <!-- Ícone -->
        <Sparkles
          :size="24"
          style="stroke-width: 2.6px"
          class="text-white z-10 animate-pulse"
        />
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { Loader2, Send, Sparkles, X } from "lucide-vue-next";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { WebSocketService } from "../services/websocket/WebSocketService";
import type {
  ChatMessage,
  ConnectionState,
} from "../services/websocket/WebSocketTypes";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const isOpen = ref(false);
const messages = ref<ChatMessage[]>([]);
const messageInput = ref("");
const messagesContainer = ref<HTMLElement | null>(null);
const connectionState = ref<ConnectionState>("disconnected");
const errorMessage = ref<string | null>(null);

let wsService: WebSocketService | null = null;

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

  // Callbacks
  wsService.onStateChange((state) => {
    connectionState.value = state;
    console.log("Estado da conexão:", state);
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

// Lifecycle
onMounted(() => {
  // Não conectar automaticamente - só quando abrir o chat
});

onBeforeUnmount(() => {
  if (wsService) {
    wsService.disconnect();
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

/* Sombra do botão flutuante */
.floating-button {
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))
    drop-shadow(0 6px 6px rgba(0, 0, 0, 0.1));
}

.floating-button:hover {
  filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.2))
    drop-shadow(0 10px 10px rgba(0, 0, 0, 0.15));
}

/* Transição do Chat */
.chat-expand-enter-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.15s;
  transform-origin: bottom right;
}

.chat-expand-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom right;
}

.chat-expand-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(20px);
}

.chat-expand-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(20px);
}

/* Transição do Botão */
.button-fade-enter-active {
  transition: all 0.25s ease;
  transition-delay: 0.15s;
}

.button-fade-leave-active {
  transition: all 0.15s ease;
}

.button-fade-enter-from {
  opacity: 0;
  transform: scale(0.6) rotate(90deg);
}

.button-fade-leave-to {
  opacity: 0;
  transform: scale(0.6) rotate(-90deg);
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
