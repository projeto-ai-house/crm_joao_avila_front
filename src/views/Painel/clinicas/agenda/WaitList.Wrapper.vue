<template>
  <div class="waitlist-wrapper p-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-semibold">Lista de Espera (Resumo)</h3>
      <Button
        label="Atualizar"
        icon="pi pi-refresh"
        size="small"
        @click="fetchAppointments"
      />
    </div>

    <div v-if="loading" class="flex justify-center py-6">
      <ProgressSpinner />
    </div>

    <div v-else>
      <div v-if="appointments.length === 0" class="text-sm text-gray-500">
        Nenhum agendamento encontrado para o período.
      </div>

      <DataTable
        :value="appointments"
        class="bg-white rounded-lg"
        responsiveLayout="scroll"
        size="small"
      >
        <Column header="Horário" style="width: 100px; text-align: center">
          <template #body="{ data }">
            <div class="flex flex-col items-start">
              <div class="text-sm text-gray-700">{{ data.timeFormatted }}</div>
              <div class="text-xs text-gray-500">
                {{
                  data.startIso
                    ? dayjs(data.startIso).isSame(dayjs(), "day")
                      ? "Hoje"
                      : dayjs(data.startIso).format("DD/MM/YYYY")
                    : "-"
                }}
              </div>
            </div>
          </template>
        </Column>

        <Column header="Status" style="width: 9rem; text-align: left">
          <template #body="{ data }">
            <Tag
              class="w-full h-7"
              :value="data.status || 'PENDENTE'"
              :severity="statusSeverity(data.status)"
            />
          </template>
        </Column>

        <Column header="Paciente">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div>
                <div class="text-sm font-semibold">{{ data.patientName }}</div>
                <div class="text-xs text-gray-500">
                  {{ data.telefone || "" }}
                </div>
              </div>
            </div>
          </template>
        </Column>

        <Column header="Médico">
          <template #body="{ data }">
            <div class="text-sm text-gray-600">
              {{
                doctors.find((doc) => doc.ID === data.medico_id)?.Nome || "-"
              }}
            </div>
          </template>
        </Column>

        <Column header="Convênio">
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
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import ProgressSpinner from "primevue/progressspinner";
import Tag from "primevue/tag";
import { onMounted, ref } from "vue";
import { AppointmentsServices } from "../../../../services/appointments/AppointmentsServices";
import { UserLinksServices } from "../../../../services/user/UserLinksServices";
import { UsersServices } from "../../../../services/user/UsersServices";
import { useUserStore } from "../../../../stores/user";
import { DateUtils } from "../../../../utils/DateUtils";

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

const appointments = ref<AppointmentItem[]>([]);
const doctors = ref<any[]>([]);
const loading = ref(false);
const userStore = useUserStore();

function statusSeverity(status: string | null) {
  if (!status) return "warning";
  const s = String(status).toUpperCase();
  switch (s) {
    case "CONFIRMADO":
      return "success";
    case "CANCELADO":
      return "danger";
    case "CONCLUIDO":
      return "info";
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

const calculateTodayRange = () => {
  const now = new Date();
  const start = dayjs(now).startOf("day").format("YYYY-MM-DD") + "T00:00:00Z";
  const end = dayjs(now).endOf("day").format("YYYY-MM-DD") + "T23:59:59Z";
  return { dataInicio: start, dataFim: end };
};

async function fetchAppointments() {
  loading.value = true;
  try {
    const { dataInicio, dataFim } = calculateTodayRange();
    const payload: any = {
      page: 1,
      dataInicio,
      dataFim: dayjs(dataFim).add(7, "day").format("YYYY-MM-DD") + "T00:00:00Z",
    };
    const resp = await AppointmentsServices.getAppointments(payload);
    const raw = resp?.data?.data?.agendamentos || [];
    // filtrar os que ja passaram em relaçao a hora atual e ordenar pela hora
    const now = dayjs(new Date());
    const filtered = raw
      .filter((a: any) => {
        const start = a.data_hora ? dayjs(a.data_hora) : null;
        return start && dayjs(start).isAfter(now);
      })
      .sort((a: any, b: any) => {
        const startA = a.data_hora ? dayjs(a.data_hora) : null;
        const startB = b.data_hora ? dayjs(b.data_hora) : null;
        return startA && startB ? dayjs(startA).diff(dayjs(startB)) : 0;
      });

    appointments.value = filtered.map((a: any, idx: number) => {
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
    });
  } catch (err) {
    console.error("Erro ao carregar lista de espera:", err);
    appointments.value = [];
  } finally {
    loading.value = false;
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
});
</script>

<style scoped>
.waitlist-wrapper {
  min-width: 320px;
}
</style>
