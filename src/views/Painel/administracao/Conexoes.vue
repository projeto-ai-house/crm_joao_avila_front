<template>
  <div class="p-6 mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
          >
            <Activity :size="24" class="text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800">
              Monitoramento de Conexões
            </h1>
            <p class="text-sm text-gray-500">
              Visualize conexões ativas por clínica e histórico de mensagens
            </p>
          </div>
        </div>

        <Button
          icon="pi pi-refresh"
          label="Atualizar"
          severity="secondary"
          outlined
          size="small"
          @click="loadClinics"
          :loading="loadingClinics"
        />
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex items-center gap-6 text-sm">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
          <span class="text-gray-600">
            Clínicas Online: <strong>{{ clinicsStats.online }}</strong>
          </span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-gray-400"></div>
          <span class="text-gray-600">
            Clínicas Offline: <strong>{{ clinicsStats.offline }}</strong>
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-gray-600">
            Total de Conexões: <strong>{{ totalConnections }}</strong>
          </span>
        </div>
      </div>
    </div>

    <!-- Layout: Clínicas + Conexões + Mensagens -->
    <div class="grid grid-cols-12 gap-4">
      <!-- Lista de Clínicas -->
      <div class="col-span-12 lg:col-span-3">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <h2
              class="text-lg font-semibold text-gray-800 flex items-center gap-2"
            >
              <Building :size="20" class="text-blue-500" />
              Clínicas ({{ clinics.length }})
            </h2>
          </div>

          <div class="overflow-y-auto" style="max-height: calc(100vh - 380px)">
            <!-- Loading -->
            <div
              v-if="loadingClinics"
              class="flex items-center justify-center py-12"
            >
              <Loader2 class="w-8 h-8 animate-spin text-blue-500" />
            </div>

            <!-- Empty State -->
            <div
              v-else-if="clinics.length === 0"
              class="flex flex-col items-center justify-center py-12 px-4"
            >
              <div
                class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"
              >
                <Building :size="32" class="text-gray-400" />
              </div>
              <p class="text-gray-500 text-sm text-center">
                Nenhuma clínica encontrada
              </p>
            </div>

            <!-- Lista de Clínicas -->
            <div v-else class="divide-y divide-gray-100">
              <div
                v-for="clinic in clinics"
                :key="clinic.ID"
                @click="selectClinic(clinic)"
                :class="[
                  'p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50',
                  selectedClinic?.ID === clinic.ID
                    ? 'bg-blue-50 border-l-4 border-l-blue-500'
                    : 'border-l-4 border-l-transparent',
                ]"
              >
                <div class="flex items-start gap-3">
                  <div
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                      clinic.hasActiveConnections
                        ? 'bg-green-100'
                        : 'bg-gray-100',
                    ]"
                  >
                    <Building
                      :size="20"
                      :class="
                        clinic.hasActiveConnections
                          ? 'text-green-600'
                          : 'text-gray-600'
                      "
                    />
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <p class="text-sm font-semibold text-gray-800 truncate">
                        {{ clinic.NomeClinica }}
                      </p>
                      <div
                        :class="[
                          'w-2 h-2 rounded-full flex-shrink-0',
                          clinic.hasActiveConnections
                            ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)] animate-pulse'
                            : 'bg-gray-400',
                        ]"
                      ></div>
                    </div>
                    <p class="text-xs text-gray-500">
                      {{
                        clinic.hasActiveConnections
                          ? `${clinic.activeConnectionsCount} conexão(ões) ativa(s)`
                          : "Nenhuma conexão ativa"
                      }}
                    </p>
                  </div>

                  <ChevronRight
                    :size="16"
                    class="text-gray-400 flex-shrink-0 mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Conexões da Clínica -->
      <div class="col-span-12 lg:col-span-4">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <div v-if="selectedClinic">
              <h2
                class="text-lg font-semibold text-gray-800 flex items-center gap-2"
              >
                <Users :size="20" class="text-blue-500" />
                Conexões ({{ connections.length }})
              </h2>
              <p class="text-xs text-gray-500 mt-1">
                {{ selectedClinic.NomeClinica }}
              </p>
            </div>
            <div v-else>
              <h2
                class="text-lg font-semibold text-gray-800 flex items-center gap-2"
              >
                <Users :size="20" class="text-gray-400" />
                Conexões
              </h2>
              <p class="text-xs text-gray-500 mt-1">Selecione uma clínica</p>
            </div>
          </div>

          <div class="overflow-y-auto" style="max-height: calc(100vh - 380px)">
            <!-- Loading -->
            <div
              v-if="loadingConnections"
              class="flex items-center justify-center py-12"
            >
              <Loader2 class="w-8 h-8 animate-spin text-blue-500" />
            </div>

            <!-- Empty State - Nenhuma clínica selecionada -->
            <div
              v-else-if="!selectedClinic"
              class="flex flex-col items-center justify-center py-12 px-4"
            >
              <div
                class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"
              >
                <Users :size="32" class="text-gray-400" />
              </div>
              <p class="text-gray-500 text-sm text-center">
                Selecione uma clínica à esquerda<br />
                para visualizar as conexões
              </p>
            </div>

            <!-- Empty State - Nenhuma conexão -->
            <div
              v-else-if="connections.length === 0"
              class="flex flex-col items-center justify-center py-12 px-4"
            >
              <div
                class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"
              >
                <Activity :size="32" class="text-gray-400" />
              </div>
              <p class="text-gray-500 text-sm text-center">
                Nenhuma conexão encontrada<br />
                nesta clínica
              </p>
            </div>

            <!-- Lista de Conexões -->
            <div v-else class="divide-y divide-gray-100">
              <div
                v-for="connection in connections"
                :key="connection.id"
                @click="selectConnection(connection)"
                :class="[
                  'p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50',
                  selectedConnection?.id === connection.id
                    ? 'bg-blue-50 border-l-4 border-l-blue-500'
                    : 'border-l-4 border-l-transparent',
                ]"
              >
                <div class="flex items-start gap-3">
                  <div
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                      connection.status === 'connected'
                        ? 'bg-green-100'
                        : 'bg-gray-100',
                    ]"
                  >
                    <User
                      :size="20"
                      :class="
                        connection.status === 'connected'
                          ? 'text-green-600'
                          : 'text-gray-600'
                      "
                    />
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <p class="text-sm font-semibold text-gray-800 truncate">
                        {{ connection.user_name || "Usuário" }}
                      </p>
                      <div
                        :class="[
                          'w-2 h-2 rounded-full flex-shrink-0',
                          connection.status === 'connected'
                            ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)] animate-pulse'
                            : 'bg-gray-400',
                        ]"
                      ></div>
                    </div>
                    <p class="text-xs text-gray-500 truncate mb-1">
                      {{ connection.user_email || "Email não disponível" }}
                    </p>
                    <div class="flex items-center gap-2 text-xs text-gray-400">
                      <Clock :size="12" />
                      <span>{{ formatDate(connection.connected_at) }}</span>
                    </div>
                    <div
                      v-if="
                        connection.status === 'disconnected' &&
                        connection.disconnected_at
                      "
                      class="flex items-center gap-2 text-xs text-red-500 mt-1"
                    >
                      <span
                        >Desconectado:
                        {{ formatDate(connection.disconnected_at) }}</span
                      >
                    </div>
                  </div>

                  <ChevronRight
                    :size="16"
                    class="text-gray-400 flex-shrink-0 mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Histórico de Mensagens -->
      <div class="col-span-12 lg:col-span-5">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <div
              v-if="selectedConnection"
              class="flex items-center justify-between"
            >
              <div>
                <h2
                  class="text-lg font-semibold text-gray-800 flex items-center gap-2"
                >
                  <MessageSquare :size="20" class="text-blue-500" />
                  Histórico de Mensagens
                </h2>
                <p class="text-xs text-gray-500 mt-1">
                  Connection ID: {{ selectedConnection.connection_id }}
                </p>
              </div>
              <Button
                icon="pi pi-refresh"
                severity="secondary"
                text
                rounded
                size="small"
                @click="loadMessages"
                :loading="loadingMessages"
              />
            </div>
            <div v-else>
              <h2
                class="text-lg font-semibold text-gray-800 flex items-center gap-2"
              >
                <MessageSquare :size="20" class="text-gray-400" />
                Histórico de Mensagens
              </h2>
              <p class="text-xs text-gray-500 mt-1">
                Selecione uma conexão para ver o histórico
              </p>
            </div>
          </div>

          <div
            class="overflow-y-auto p-4"
            style="max-height: calc(100vh - 380px)"
          >
            <!-- Loading -->
            <div
              v-if="loadingMessages"
              class="flex items-center justify-center py-12"
            >
              <Loader2 class="w-8 h-8 animate-spin text-blue-500" />
            </div>

            <!-- Empty State - Nenhuma conexão selecionada -->
            <div
              v-else-if="!selectedConnection"
              class="flex flex-col items-center justify-center py-12 px-4"
            >
              <div
                class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"
              >
                <MessageSquare :size="32" class="text-gray-400" />
              </div>
              <p class="text-gray-500 text-sm text-center">
                Selecione uma conexão à esquerda<br />
                para visualizar o histórico de mensagens
              </p>
            </div>

            <!-- Empty State - Nenhuma mensagem -->
            <div
              v-else-if="messages.length === 0"
              class="flex flex-col items-center justify-center py-12 px-4"
            >
              <div
                class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"
              >
                <MessageSquare :size="32" class="text-gray-400" />
              </div>
              <p class="text-gray-500 text-sm text-center">
                Nenhuma mensagem encontrada<br />
                nesta conexão
              </p>
            </div>

            <!-- Lista de Mensagens -->
            <div v-else class="flex flex-col gap-3">
              <div
                v-for="message in messages"
                :key="message.id"
                :class="[
                  'flex',
                  message.direction === 'incoming'
                    ? 'justify-end'
                    : 'justify-start',
                ]"
              >
                <div
                  :class="[
                    'max-w-[75%] rounded-2xl shadow-sm overflow-hidden',
                    message.direction === 'incoming'
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200',
                  ]"
                >
                  <!-- Anexos de imagem -->
                  <div
                    v-if="message.has_attachments && message.attachments?.length"
                    class="p-3"
                  >
                    <div
                      v-for="attachment in message.attachments"
                      :key="attachment.id"
                      class="mb-3 last:mb-0"
                    >
                      <!-- Placeholder de imagem -->
                      <div
                        class="flex items-center gap-3 p-3 bg-gray-100 rounded-lg border border-gray-300"
                      >
                        <div
                          class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-800 truncate">
                            {{ attachment.file_name }}
                          </p>
                          <p class="text-xs text-gray-500">
                            {{ (attachment.file_size / 1024 / 1024).toFixed(2) }} MB
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

                  <!-- Conteúdo da mensagem -->
                  <div
                    v-if="message.message"
                    :class="[
                      'flex items-start gap-2 px-4',
                      message.has_attachments ? 'pt-0 pb-3' : 'py-3',
                    ]"
                  >
                    <div
                      :class="[
                        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                        message.direction === 'incoming'
                          ? 'bg-blue-400'
                          : 'bg-gray-100',
                      ]"
                    >
                      <component
                        :is="message.direction === 'incoming' ? User : Bot"
                        :size="14"
                        :class="
                          message.direction === 'incoming'
                            ? 'text-white'
                            : 'text-gray-600'
                        "
                      />
                    </div>
                    <p class="text-sm break-words whitespace-pre-wrap flex-1">
                      {{ message.message }}
                    </p>
                  </div>

                  <!-- Timestamp -->
                  <div
                    :class="[
                      'flex items-center gap-1 px-4 pb-3 text-xs',
                      message.direction === 'incoming'
                        ? 'text-blue-100 justify-end'
                        : 'text-gray-400',
                      message.has_attachments || message.message ? '' : 'pt-3',
                    ]"
                  >
                    <Clock :size="12" />
                    <span>{{ formatDate(message.created_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthenticatedImage from "@/components/AuthenticatedImage.vue";
import {
  Activity,
  Bot,
  Building,
  ChevronRight,
  Clock,
  Loader2,
  MessageSquare,
  User,
  Users,
} from "lucide-vue-next";
import { useToast } from "primevue";
import Button from "primevue/button";
import { computed, onMounted, ref } from "vue";
import { ClinicsServices } from "../../../services/clinics/ClinicsServices";
import {
  MonitoringService,
  type IAgentMessage,
  type IWebSocketConnection,
} from "../../../services/websocket/MonitoringService";

const toast = useToast();

const loadingClinics = ref(false);
const loadingConnections = ref(false);
const loadingMessages = ref(false);
const clinics = ref<any[]>([]);
const connections = ref<IWebSocketConnection[]>([]);
const messages = ref<IAgentMessage[]>([]);
const selectedClinic = ref<any | null>(null);
const selectedConnection = ref<IWebSocketConnection | null>(null);

const clinicsStats = computed(() => {
  const online = clinics.value.filter((c) => c.hasActiveConnections).length;
  const offline = clinics.value.filter((c) => !c.hasActiveConnections).length;
  return {
    online,
    offline,
    total: clinics.value.length,
  };
});

const totalConnections = computed(() => {
  return clinics.value.reduce(
    (total, clinic) => total + (clinic.activeConnectionsCount || 0),
    0
  );
});

async function loadClinics() {
  try {
    loadingClinics.value = true;
    const response = await ClinicsServices.getClinics({ page: 1 });

    if (response.status === 200) {
      const data = response.data?.data;
      const clinicsList = Array.isArray(data) ? data : data?.Clinicas || [];

      // Para cada clínica, buscar as conexões para verificar o status
      clinics.value = await Promise.all(
        clinicsList.map(async (clinic: any) => {
          try {
            const connectionsResponse = await MonitoringService.listConnections(
              clinic.ID,
              "connected"
            );
            const connectionsData = connectionsResponse.data?.data;
            const activeConnections = Array.isArray(connectionsData)
              ? connectionsData
              : connectionsData?.connections || [];

            return {
              ...clinic,
              hasActiveConnections: activeConnections.length > 0,
              activeConnectionsCount: activeConnections.length,
            };
          } catch (error) {
            console.error(
              `Erro ao carregar conexões da clínica ${clinic.NomeClinica}:`,
              error
            );
            return {
              ...clinic,
              hasActiveConnections: false,
              activeConnectionsCount: 0,
            };
          }
        })
      );
    } else {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível carregar as clínicas.",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Erro ao carregar clínicas:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível carregar as clínicas.",
      life: 3000,
    });
  } finally {
    loadingClinics.value = false;
  }
}

async function loadConnections(clinicaId: string) {
  try {
    loadingConnections.value = true;
    const response = await MonitoringService.listConnections(clinicaId, "all");

    if (response.status === 200) {
      const data = response.data?.data;
      const connectionsList = Array.isArray(data) ? data : data?.connections || [];

      // Ordenar conexões: mais recentes primeiro (por connected_at)
      connections.value = connectionsList.sort((a, b) => {
        const dateA = new Date(a.connected_at).getTime();
        const dateB = new Date(b.connected_at).getTime();
        return dateB - dateA; // Ordem decrescente (mais novo primeiro)
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível carregar as conexões.",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Erro ao carregar conexões:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível carregar as conexões.",
      life: 3000,
    });
  } finally {
    loadingConnections.value = false;
  }
}

async function loadMessages() {
  if (!selectedConnection.value) return;

  try {
    loadingMessages.value = true;
    const response = await MonitoringService.getMessages(
      selectedConnection.value.connection_id
    );

    if (response.status === 200) {
      const data = response.data?.data;
      messages.value = Array.isArray(data) ? data : data?.messages || [];
    } else {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível carregar as mensagens.",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Erro ao carregar mensagens:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível carregar as mensagens.",
      life: 3000,
    });
  } finally {
    loadingMessages.value = false;
  }
}

function selectClinic(clinic: any) {
  selectedClinic.value = clinic;
  selectedConnection.value = null;
  messages.value = [];
  loadConnections(clinic.ID);
}

function selectConnection(connection: IWebSocketConnection) {
  selectedConnection.value = connection;
  loadMessages();
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(() => {
  loadClinics();
});
</script>

<style scoped>
/* Animações e transições suaves */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Scroll personalizado */
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
</style>
