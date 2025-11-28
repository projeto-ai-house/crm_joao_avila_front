<template>
  <div
    :class="[
      'waitlist-wrapper',
      props.minified ? 'p-0' : 'p-4',
      { minified: props.minified },
    ]"
  >
    <!-- Popup menu for status actions -->
    <Menu ref="statusMenu" :model="statusMenuItems" popup appendTo="body" />

    <div class="flex items-center justify-between mb-3" v-if="!props.minified">
      <h3 class="text-lg font-semibold">Lista de Espera (Resumo)</h3>
      <Button
        label="Atualizar"
        icon="pi pi-refresh"
        size="small"
        :loading="loading"
        @click="fetchAppointments"
      />
    </div>

    <!-- <div v-if="loading" class="flex justify-center py-6">
      <ProgressSpinner />
    </div> -->

    <div :class="props.minified ? 'w-full h-full' : ''">
      <div v-if="appointments.length < 1" class="text-sm text-gray-500">
        Nenhum agendamento encontrado.
      </div>

      <DataTable
        :value="appointments"
        class="bg-white rounded-lg"
        responsiveLayout="stack"
        size="small"
        :showHeaders="!props.minified"
        v-else
      >
        <Column
          header="Horário"
          style="width: 120px; text-align: left"
          :class="{ '!w-min': props.minified }"
        >
          <template #body="{ data }">
            <div
              v-if="props.minified"
              class="text-sm text-gray-700"
              style="
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ data.timeFormatted }}
            </div>
            <div v-else class="flex flex-col items-start">
              <div class="text-sm text-gray-700">{{ data.timeFormatted }}</div>
              <div class="text-xs text-gray-500">
                {{ dateLabel(data.startIso) }}
              </div>
            </div>
          </template>
        </Column>

        <Column
          header="Status"
          style="text-align: left; width: 9rem"
          :class="{ '!w-min': props.minified }"
        >
          <template #body="{ data }">
            <Tag
              v-if="!props.minified"
              class="w-full h-7 cursor-pointer"
              :value="data.status || 'PENDENTE'"
              :severity="statusSeverity(data.status)"
              @click="onStatusTagClick($event, data)"
            />
            <Tag
              v-else
              class="w-fit h-7 cursor-pointer"
              :icon="statusIcon(data.status)"
              :severity="statusSeverity(data.status)"
              v-tooltip.top="data.status"
              @click="onStatusTagClick($event, data)"
            />
          </template>
        </Column>

        <Column header="Paciente">
          <template #body="{ data }">
            <div
              v-if="props.minified"
              class="flex items-center gap-2"
              style="
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              <span
                class="text-sm font-semibold"
                style="min-width: 0; overflow: hidden; text-overflow: ellipsis"
                >{{ data.patientName }}</span
              >
            </div>
            <div v-else class="flex items-center gap-3">
              <div>
                <div class="text-sm font-semibold">{{ data.patientName }}</div>
                <div class="text-xs text-gray-500">
                  {{ data.telefone || "" }}
                </div>
              </div>
            </div>
          </template>
        </Column>

        <Column
          header="Médico"
          :style="props.minified ? 'max-width: 200px;' : ''"
        >
          <template #body="{ data }">
            <div
              class="text-sm text-gray-600"
              :style="
                props.minified
                  ? 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'
                  : ''
              "
            >
              {{
                doctors.find((doc) => doc.ID === data.medico_id)?.Nome || "-"
              }}
            </div>
          </template>
        </Column>

        <Column header="Convênio" v-if="!props.minified">
          <template #body="{ data }">
            <div class="text-sm text-gray-600">
              {{ data.convenio || "-" }}
            </div>
          </template>
        </Column>

        <!-- <Column header="Ações" style="width: 90px; text-align: center">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Button
                icon="pi pi-eye"
                class="p-button-sm p-button-outlined"
                v-tooltip.top="'Ver'"
              />
              <Button
                icon="pi pi-phone"
                class="p-button-sm"
                severity="info"
                v-if="data.telefone"
              />
            </div>
          </template>
        </Column> -->
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Menu from "primevue/menu";
import type { MenuItem } from "primevue/menuitem";
import Tag from "primevue/tag";
import { onBeforeUnmount, onMounted, onUnmounted, ref } from "vue";
import { AppointmentsServices } from "../../../../services/appointments/AppointmentsServices";
import { UserLinksServices } from "../../../../services/user/UserLinksServices";
import { UsersServices } from "../../../../services/user/UsersServices";
import { useUserStore } from "../../../../stores/user";
import { DateUtils } from "../../../../utils/DateUtils";

dayjs.extend(isSameOrAfter);

type AppointmentItem = {
  id: string;
  patientName: string;
  initials: string;
  timeFormatted: string;
  startIso: string | null;
  telefone?: string | null;
  convenio?: string | null;
  medico?: string | null;
  status?: string | null;
};

const props = defineProps<{
  minified?: boolean;
}>();

const appointments = ref<AppointmentItem[]>([]);
const doctors = ref<any[]>([]);
const loading = ref(false);
const userStore = useUserStore();
const interval = ref<number | null>(null);

// Status dropdown menu
const statusMenu = ref();
const selectedRow = ref<AppointmentItem | null>(null);
const statusMenuItems = ref<MenuItem[]>([
  {
    label: "Ativo",
    icon: "pi pi-clock",
    command: () => {
      updateStatus("ATIVO");
    },
  },
  {
    label: "Confirmado",
    icon: "pi pi-check",
    command: () => {
      updateStatus("CONFIRMADO");
    },
  },
  {
    label: "Cancelado",
    icon: "pi pi-times",
    command: () => {
      updateStatus("CANCELADO");
    },
  },
  {
    label: "Concluído",
    icon: "pi pi-check-circle",
    command: () => {
      updateStatus("CONCLUIDO");
    },
  },
]);

function onStatusTagClick(event: MouseEvent, row: AppointmentItem) {
  selectedRow.value = row;
  statusMenu.value?.toggle(event);
}

function statusIcon(status: string | null) {
  if (!status) return "Clock";
  const s = String(status).toUpperCase();
  switch (s) {
    case "CONFIRMADO":
      return "pi pi-check";
    case "CANCELADO":
      return "pi pi-x";
    case "CONCLUIDO":
      return "pi pi-check-circle";
    case "ATIVO":
      return "pi pi-clock";
    default:
      return "pi pi-clock";
  }
}

function statusSeverity(status: string | null) {
  if (!status) return "warning";
  const s = String(status).toUpperCase();
  switch (s) {
    case "CONFIRMADO":
      return "warn";
    case "CANCELADO":
      return "danger";
    case "CONCLUIDO":
      return "success";
    case "ATIVO":
      return "warning";
    default:
      return "warning";
  }
}

function initialsFromName(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function dateLabel(startIso: string | null) {
  if (!startIso) return "-";
  return dayjs(startIso).isSame(dayjs(), "day")
    ? "Hoje"
    : dayjs(startIso).format("DD/MM/YYYY");
}

const calculateTodayRange = () => {
  const now = new Date();
  const start = dayjs(now).startOf("day").format("YYYY-MM-DD") + "T00:00:00Z";
  const end = dayjs(now).endOf("day").format("YYYY-MM-DD") + "T23:59:59Z";
  return { dataInicio: start, dataFim: end };
};

async function updateStatus(newStatus: string) {
  if (!selectedRow.value) return;
  const appointmentId = selectedRow.value.id;
  try {
    const payload = {
      id: appointmentId,
      status: newStatus,
    };
    const response = await AppointmentsServices.updateAppointment(
      payload,
      true
    );
    if (response.status === 200) {
      // Atualizar a lista de agendamentos após a alteração
      await fetchAppointments();
    } else {
      console.error("Erro ao atualizar status do agendamento:", response);
    }
  } catch (error) {
    console.error("Erro ao atualizar status do agendamento:", error);
  } finally {
    selectedRow.value = null;
  }
}

async function fetchAppointments() {
  loading.value = true;
  try {
    const { dataInicio, dataFim } = calculateTodayRange();
    const payload: any = {
      page: 1,
      dataInicio,
      // dataFim: dayjs(dataFim).add(7, "day").format("YYYY-MM-DD") + "T00:00:00Z",
      dataFim,
    };
    const resp = await AppointmentsServices.getAppointments(payload);
    const raw = resp?.data?.data?.agendamentos || [];
    // filtrar os que ja passaram em relaçao a hora atual e ordenar pela hora
    const now = new Date(Date.now());
    // console.log("Now ORIGINAL: ", now.toISOString());

    // const filtered = raw

    appointments.value = raw
      .map((a: any, idx: number) => {
        const rawId = a.ID ?? a.id ?? a.Id ?? `evt_${Date.now()}_${idx}`;
        const start = a.data_hora
          ? DateUtils.convertUTCToLocalTime(a.data_hora)
          : null;
        const timeFormatted = start ? dayjs(start).format("HH:mm") : "-";
        const patientName =
          a.nome_cliente ||
          a.titulo ||
          a.NomePaciente ||
          a.Nome ||
          a.nome ||
          "Paciente Desconhecido";

        return {
          id: String(rawId),
          patientName,
          initials: initialsFromName(patientName),
          timeFormatted,
          startIso: start,
          telefone: a.telefone_contato || null,
          convenio: a.convenio || null,
          medico_id: a.medico_id || null,
          status: a.status || null,
        } as AppointmentItem;
      })
      .filter((a: any) => {
        const start = a.startIso ? dayjs(a.startIso) : null;

        return dayjs(start).isSameOrAfter(now);
      })
      .sort((a: any, b: any) => {
        const startA = a.startIso ? dayjs(a.startIso) : null;
        const startB = b.startIso ? dayjs(b.startIso) : null;
        return startA && startB ? dayjs(startA).diff(dayjs(startB)) : 0;
      });
  } catch (err) {
    console.error("Erro ao carregar lista de espera:", err);
    appointments.value = [];
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 600);
  }
}

async function fetchMedicos() {
  try {
    const currentUserRole = userStore.user?.Role;

    switch (currentUserRole) {
      case "CEO/DONO":
        try {
          const usersListResponse = await UsersServices.getUsers({
            page: 1,
            limit: 1000,
          });
          if (usersListResponse.status === 200) {
            const users = usersListResponse.data?.data?.Usuarios || [];
            doctors.value = users
              .filter((user: any) => user.Role?.nome === "MEDICO")
              .map((user: any) => ({
                ID: user.ID,
                Nome: user.NomeCompleto,
              }));
          } else {
            doctors.value = [];
          }
        } catch (error) {
          console.error("Erro ao buscar usuários:", error);
          doctors.value = [];
        }
        break;

      case "MEDICO":
        doctors.value = [
          {
            ID: userStore.user?.ID || "",
            Nome: userStore.user?.Nome || "Você",
          },
        ];
        break;

      case "SECRETARIA":
        try {
          const userLinksResponse = await UserLinksServices.getLinks();
          if (userLinksResponse.status === 200) {
            const vinculos = userLinksResponse.data?.data?.Vinculos || [];
            doctors.value = vinculos
              .map((vinculo: any) => vinculo.Medico)
              .map((medico: any) => ({
                ID: medico.ID,
                Nome: medico.NomeCompleto,
              }));
          } else {
            doctors.value = [];
          }
        } catch (error) {
          console.error("Erro ao buscar vínculos:", error);
          doctors.value = [];
        }
        break;

      default:
        doctors.value = [];
    }

    // console.log("Lista de médicos carregada:", doctors.value);
  } catch (error) {
    console.error("Erro ao carregar médicos:", error);
    doctors.value = [];
  }
}

onMounted(async () => {
  await fetchMedicos();
  await fetchAppointments();
  if (props.minified) {
    interval.value = setInterval(() => {
      if (!localStorage.getItem(import.meta.env.VITE_TOKEN_KEY)) {
        clearInterval(interval.value);
      } else {
        fetchAppointments();
      }
    }, 30000);
  }
});

onBeforeUnmount(() => {
  if (interval.value) {
    clearInterval(interval.value);
    interval.value = null;
  }
});

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
    interval.value = null;
  }
});
</script>

<style scoped>
.waitlist-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Minified mode: keep cells on one line and ellipsis overflow */
.waitlist-wrapper.minified :deep(.p-datatable .p-datatable-tbody > tr > td) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 6px;
  padding-bottom: 6px;
}

.waitlist-wrapper.minified :deep(.p-tag) {
  line-height: 1;
}

/* Enable horizontal scroll when needed */
.waitlist-wrapper.minified :deep(.p-datatable-wrapper) {
  overflow-x: auto !important;
}

/* Ensure table uses natural width */
.waitlist-wrapper.minified :deep(.p-datatable-table) {
  min-width: 100%;
  table-layout: auto;
}
</style>
