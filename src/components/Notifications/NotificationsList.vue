<template>
  <div class="card flex justify-center">
    <div class="relative">
      <Button
        v-tooltip.bottom="'Notificações'"
        icon="pi pi-bell"
        variant="text"
        rounded
        @click="toggle"
        :severity="hasNotifications ? 'primary' : 'secondary'"
        aria-label="Abrir notificações"
      />

      <transition name="badge">
        <span
          v-if="hasNotifications"
          class="absolute -top-1 -right-1 z-50 bg-blue-400 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-black"
          aria-hidden="true"
        >
          !
        </span>
      </transition>
    </div>

    <Popover ref="popoverComponent" class="max-w-[96vw]">
      <div class="w-[26rem] bg-white">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h2 class="text-md font-semibold text-gray-800">Notificações</h2>
            <p class="text-xs text-gray-500">Últimas atualizações</p>
          </div>
          <button
            class="text-xs text-primary-600 hover:underline ml-2 cursor-pointer"
            @click="markAllRead"
            title="Marcar todas como lidas"
          >
            Marcar todas
          </button>
        </div>

        <div
          v-if="notifications.length === 0"
          class="text-sm text-gray-500 py-6 text-center"
        >
          Nenhuma notificação.
        </div>

        <div v-else class="max-h-64 overflow-y-auto">
          <ul class="divide-y divide-gray-100">
            <li
              v-for="(notification, index) in notifications"
              :key="index"
              class="py-3 px-2 hover:bg-gray-50 cursor-pointer"
              @click="openNotification(index)"
              role="button"
              :aria-label="`Notificação ${index + 1}: ${notification.evento}`"
            >
              <div class="flex items-start gap-3">
                <span
                  :class="[
                    'w-3 h-3 mt-1 rounded-full shrink-0',
                    levelColor(notification.nivel),
                  ]"
                  aria-hidden="true"
                ></span>
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <div class="flex flex-col">
                      <span class="text-sm font-medium text-gray-800">{{
                        notification.evento
                      }}</span>
                      <span
                        class="text-xs text-gray-500 truncate max-w-[18rem]"
                        >{{ notification.object.mensagem }}</span
                      >
                    </div>
                    <div class="text-xs text-gray-400 ml-2">
                      {{ formatDate(notification.dataHora) }}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div
          class="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center"
        >
          <div class="text-xs text-gray-500">{{ notificationsCountText }}</div>
          <!-- <div class="flex items-center gap-2">
            <Button
              label="Ver todas"
              class="p-button-text p-button-sm"
              @click="viewAll"
            />
          </div> -->
        </div>
      </div>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { Button, Popover } from "primevue";
import { SSE, type SSEvent } from "sse.js";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { AuthenticationUtils } from "../../utils/AuthenticationUtils";
import { DateUtils } from "../../utils/DateUtils";

export interface INotification {
  evento: string;
  object: {
    status: string;
    mensagem: string;
  };
  nivel: number;
  origem: string;
  dataHora: string;
}

const popoverComponent = ref();
const toggle = (event) => {
  hasNotifications.value = false;
  popoverComponent.value.toggle(event);
};

const userStore = useUserStore();
const notifications = ref<INotification[]>([]);
const newNotification = ref("");
const hasNotifications = ref(false);

const notificationsCountText = computed(() => {
  const n = notifications.value.length;
  if (n === 0) return "Sem notificações";
  if (n === 1) return "1 notificação";
  return `${n} notificações`;
});

function levelColor(nivel: number) {
  // 1 = baixo, 2 = médio, 3 = alto (ajuste conforme necessidade)
  switch (nivel) {
    case 1:
      return "bg-green-400";
    case 2:
      return "bg-amber-400";
    case 3:
      return "bg-purple-400";
    default:
      return "bg-gray-400";
  }
}

function formatDate(dateString: string) {
  try {
    return (
      DateUtils.separateDateAndTime(new Date(dateString))[0] +
      " " +
      DateUtils.separateDateAndTime(new Date(dateString))[1]
    );
  } catch (e) {
    return "";
  }
}

function openNotification(index: number) {
  // Placeholder: abrir a notificação (navegar / abrir modal). Por ora, marca como lida.
  markAsRead(index);
}

function markAsRead(index: number) {
  notifications.value.splice(index, 1);
}

function markAllRead() {
  notifications.value = [];
}

// function viewAll() {
//   // Placeholder para navegar até uma página de notificações, se existir.
//   // Ex.: router.push({ name: 'Notifications' })
//   popoverComponent.value.toggle();
// }

async function connectSSE() {
  const url = import.meta.env.VITE_API_PUSH_URL + "/sse/notifications";
  const token = new AuthenticationUtils().getToken();

  const source = new SSE(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream",
    },
  });

  source.addEventListener("message", (event: SSEvent) => {
    const notification = JSON.parse(event.data);

    switch (notification?.evento) {
      case "CONNECTION_SUCCESS":
        console.log("Conexão estabelecida.");
        break;
      default:
        notifications.value.push(notification);
        hasNotifications.value = true;
        break;
    }
  });
}

async function fetchNotifications() {
  try {
  } catch (error) {}
}

onMounted(() => {
  const notificationsHistory = userStore.getData()?.Notificacoes || [];
  notifications.value = notificationsHistory
    .map((n) => ({
      evento: n.tipo_notificacao,
      object: {
        status: "",
        mensagem: n.mensagem,
      },
      nivel: 3,
      origem: "",
      dataHora: n.created_at,
    }))
    .sort((a, b) =>
      new Date(a.dataHora).getTime() < new Date(b.dataHora).getTime() ? 1 : -1
    );
  connectSSE();
});

onBeforeUnmount(() => {
  //   if (eventSource) {
  //     eventSource.close();
  //   }
});
</script>

<style scoped>
/* badge in/out: scale + fade */
.badge-enter-active,
.badge-leave-active {
  transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 160ms linear;
}
.badge-enter-from,
.badge-leave-to {
  transform: scale(0.6);
  opacity: 0;
}
.badge-enter-to,
.badge-leave-from {
  transform: scale(1);
  opacity: 1;
}
</style>
