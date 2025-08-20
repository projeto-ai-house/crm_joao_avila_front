<template>
  <div class="fc-wrapper">
    <div class="fc-toolbar">
      <div class="fc-left">
        <Button icon="pi pi-angle-left" @click="prev" size="small" />
        <DatePicker
          :key="selectedView"
          v-model="selectedDate"
          size="small"
          :view="datePickerViewOptionsLiterals[selectedView]"
          @value-change="fetchAppointments"
        />
        <Button icon="pi pi-angle-right" @click="next" size="small" />
      </div>

      <div class="fc-center">
        <Select
          :options="viewOptions"
          v-model="selectedView"
          optionLabel="label"
          optionValue="value"
          size="small"
        />s
      </div>
    </div>

    <FullCalendar :options="calendarOptions" ref="calendarRef" />
  </div>
</template>

<script setup lang="ts">
import ptBr from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/vue3";
import { Button } from "primevue";
import Select from "primevue/select";
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { PermissionsUtils } from "../utils/PermissionsUtils";
// PrimeVue components (project already uses PrimeVue elsewhere)
import type { CalendarOptions } from "@fullcalendar/core/index.js";
import dayjs from "dayjs";
import { DatePicker } from "primevue";
import { AppointmentsServices } from "../services/appointments/AppointmentsServices";
import { UserLinksServices } from "../services/user/UserLinksServices";
import { UsersServices } from "../services/user/UsersServices";

const userStore = useUserStore();
const router = useRouter();
const permissionsUserPage = ref(
  PermissionsUtils.checkMethodPemission(router.currentRoute.value.fullPath)
);
const calendarRef = ref<any>(null);

const viewOptions = [
  { label: "Dia", value: "timeGridDay" },
  { label: "Semana", value: "timeGridWeek" },
  { label: "Mês", value: "dayGridMonth" },
];
const datePickerViewOptionsLiterals: Record<string, string> = {
  timeGridDay: "date",
  timeGridWeek: "date",
  dayGridMonth: "month",
};

const selectedView = ref<string>("timeGridWeek");
const selectedDate = ref<Date | null>(new Date());
const listMedicos = ref<any[]>([]);
const globalLoading = ref<boolean>(false);
const events = ref<any[]>([]);
const filters = reactive({
  medicoId: null,
  status: null,
});

const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: selectedView.value,
  locale: ptBr,
  firstDay: 0, // Monday
  allDaySlot: false, // hide the all-day row/slot
  buttonText: {
    today: "Hoje",
    month: "Mês",
    week: "Semana",
    day: "Dia",
    list: "Lista",
  },
  dayHeaderFormat: {
    weekday: "short",
    day: "2-digit",
    omitCommas: true,
    formatMatcher: "basic",
  },
  views: {
    dayGridMonth: {
      dayHeaderFormat: { weekday: "short" },
    },
    timeGridWeek: {
      dayHeaderFormat: {
        weekday: "short",
        day: "2-digit",
        omitCommas: true,
        formatMatcher: "basic",
      },
    },
  },
  eventTimeFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
  headerToolbar: false,
  editable: true,
  selectable: true,
  navLinks: true,
  height: "auto",
  events: events.value,
  //   events: [
  //     {
  //       id: "1",
  //       title: "Consulta — Paciente A",
  //       start: new Date().toISOString().slice(0, 10),
  //     },
  //     {
  //       id: "2",
  //       title: "Consulta — Paciente B",
  //       start: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  //     },
  //   ],
  dateClick: (info: any) => {
    /* placeholder: abrir modal de criação de agendamento */
  },
  eventClick: (info: any) => {
    /* placeholder: abrir detalhes do agendamento */
  },
});

function prev() {
  const api = calendarRef.value?.getApi();
  api?.prev();
  selectedDate.value = api?.getDate();
  fetchAppointments();
}
function next() {
  const api = calendarRef.value?.getApi();
  api?.next();
  selectedDate.value = api?.getDate();
  fetchAppointments();
}
function changeView(viewName: string) {
  const api = calendarRef.value?.getApi();
  api?.changeView(viewName);
  selectedDate.value = api?.getDate();
  fetchAppointments();
}

const calculateDateRange = () => {
  const currentDate = new Date(selectedDate.value || new Date());

  if (selectedView.value === "timeGridWeek") {
    const firstDay = dayjs(currentDate).startOf("week"); // Segunda-feira
    const lastDay = dayjs(currentDate).endOf("week"); // Domingo

    return {
      dataInicio: firstDay.format("YYYY-MM-DD") + "T00:00:00Z",
      dataFim: lastDay.format("YYYY-MM-DD") + "T23:59:59Z",
    };
  }

  if (selectedView.value === "dayGridMonth") {
    const firstDay = dayjs(currentDate).startOf("month");
    const lastDay = dayjs(currentDate).endOf("month");
    console.log(firstDay, lastDay);

    return {
      dataInicio: firstDay.format("YYYY-MM-DD") + "T00:00:00Z",
      dataFim: lastDay.format("YYYY-MM-DD") + "T23:59:59Z",
    };
  }

  return { dataInicio: currentDate, dataFim: currentDate };
};

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
            listMedicos.value = users
              .filter((user: any) => user.Role?.nome === "MEDICO")
              .map((user: any) => ({
                ID: user.ID,
                Nome: user.NomeCompleto,
              }));
          } else {
            listMedicos.value = [];
          }
        } catch (error) {
          console.error("Erro ao buscar usuários:", error);
          listMedicos.value = [];
        }
        break;

      case "MEDICO":
        listMedicos.value = [
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
            listMedicos.value = vinculos
              .map((vinculo: any) => vinculo.Medico)
              .map((medico: any) => ({
                ID: medico.ID,
                Nome: medico.NomeCompleto,
              }));
          } else {
            listMedicos.value = [];
          }
        } catch (error) {
          console.error("Erro ao buscar vínculos:", error);
          listMedicos.value = [];
        }
        break;

      default:
        listMedicos.value = [];
    }

    // console.log("Lista de médicos carregada:", listMedicos.value);
  } catch (error) {
    console.error("Erro ao carregar médicos:", error);
    listMedicos.value = [];
  }
}

async function fetchAppointments() {
  try {
    globalLoading.value = true;
    const { dataInicio, dataFim }: any = calculateDateRange();

    const data: any = {
      page: 1,
      dataInicio,
      dataFim,
    };
    if (filters.status) {
      data.status = filters.status;
    }
    if (filters.medicoId) {
      data.medicoId = filters.medicoId;
    }
    const response = await AppointmentsServices.getAppointments(data);

    if (response.data?.data?.agendamentos) {
      console.log("Raw appointments response:", response);
      const raw = response.data.data.agendamentos;

      events.value = raw.map((appointment: any, idx: number) => {
        // Normalize id (API may return ID or id) and ensure uniqueness fallback
        const rawId =
          appointment.ID ?? appointment.id ?? appointment.Id ?? null;
        const id = rawId ? String(rawId) : `evt_${Date.now()}_${idx}`;

        // Normalize start/end to ISO strings so FullCalendar renders them reliably
        const start = appointment.data_hora
          ? dayjs(appointment.data_hora).toISOString()
          : null;

        // Prefer duracao_sec if provided, otherwise default to 30 minutes
        const durationMinutes =
          (appointment.duracao_sec ? appointment.duracao_sec / 60 : null) || 30;
        const end = start
          ? dayjs(start).add(durationMinutes, "minute").toISOString()
          : null;

        return {
          id,
          title:
            appointment.nome_cliente ||
            appointment.titulo ||
            "Paciente Desconhecido",
          start,
          end,
          allDay: false,
        };
      });

      console.table(events.value);

      // Filtrar eventos inválidos (sem start) e logar para depuração
      const invalidEvents = events.value.filter((e: any) => !e.start);
      if (invalidEvents.length > 0) {
        console.warn(
          `Eventos sem start encontrados: ${invalidEvents.length}`,
          invalidEvents
        );
      }

      const validEvents = events.value.filter((e: any) => !!e.start);

      // Atualiza as opções do calendário para forçar re-render
      // Substituir o objeto evita problemas de reatividade em propriedades aninhadas
      calendarOptions.value = {
        ...calendarOptions.value,
        events: [...events.value],
      };

      // Se a API do FullCalendar estiver disponível, atualiza via API também
      const api = calendarRef.value?.getApi?.();
      if (api) {
        try {
          api.removeAllEvents();
          // addEventSource aceita um array de eventos diretamente
          api.addEventSource(validEvents);

          // Logar o estado da API após adicionar para ver quantos eventos foram registrados
          try {
            const current = api.getEvents();
            console.log(
              `FullCalendar API agora tem ${current.length} eventos.`,
              current.map((ev: any) => ev.id)
            );
          } catch (innerErr) {
            console.warn(
              "Não foi possível ler eventos via api.getEvents():",
              innerErr
            );
          }
        } catch (e) {
          console.error(
            "Erro ao atualizar eventos via API do FullCalendar:",
            e
          );
        }
      }
    }
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
  } finally {
    globalLoading.value = false;
  }
}

onMounted(async () => {
  await fetchMedicos();
  await fetchAppointments();
});

watch(selectedView, (v) => {
  changeView(v);
});

watch(selectedDate, (d) => {
  if (!d) return;

  const api = calendarRef.value?.getApi();
  api?.gotoDate(d);
});
</script>

<style scoped>
.fc-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.fc-left,
.fc-center {
  display: flex;
  gap: 8px;
  align-items: center;
}
.p-dropdown,
.p-calendar {
  min-width: 160px;
}
</style>
