// stores/sseStore.ts
import { EventSourcePolyfill } from "event-source-polyfill";
import { defineStore } from "pinia";

interface SSEState {
  messages: string[];
  connected: boolean;
}

export const useSSEStore = defineStore("sse", {
  state: (): SSEState => ({
    messages: [],
    connected: false,
  }),

  actions: {
    connectSSE(token: string) {
      // console.log("🔗 Conectando ao SSE com token:", token);

      if (this.connected) return;

      const url = import.meta.env.VITE_API_PUSH_URL + "/sse/notifications";

      const eventSource = new EventSourcePolyfill(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        heartbeatTimeout: 120000,
      });

      eventSource.onopen = () => {
        this.connected = true;
        // console.log("✅ Conexão SSE aberta");
      };

      eventSource.onmessage = (event) => {
        // console.log("📩 Mensagem recebida:", event.data);
        this.messages.push(event.data);
      };

      eventSource.onerror = (err) => {
        console.error("❌ Erro SSE:", err);
        this.connected = false;

        // Tentativa de reconexão automática
        setTimeout(() => {
          console.log("🔄 Tentando reconectar SSE...");
          this.connectSSE(token);
        }, 5000);
      };

      // Guardar instância para fechar depois
      (this as any)._eventSource = eventSource;
    },

    disconnectSSE() {
      const es: EventSourcePolyfill | undefined = (this as any)._eventSource;
      if (es) {
        es.close();
        this.connected = false;
        console.log("🔌 Conexão SSE fechada");
      }
    },
  },
});
