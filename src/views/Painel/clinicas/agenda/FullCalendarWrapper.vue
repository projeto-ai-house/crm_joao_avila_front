<template>
  <div class="fc-wrapper">
    <div class="fc-toolbar">
      <div class="fc-left">
        <Button icon="pi pi-angle-left" @click="prev" size="small" />
        <DatePicker
          :key="selectedView"
          v-model="selectedDate"
          size="small"
          class="w-2/5"
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
        />
        <Button
          label="Novo Agendamento"
          icon="pi pi-plus"
          severity="success"
          size="small"
          @click="createNew"
        />
        <Button
          type="button"
          icon="pi pi-filter"
          variant=""
          severity="secondary"
          v-tooltip.top="'Filtrar'"
          @click="togglePopover"
        />
      </div>
    </div>

    <FullCalendar
      :options="calendarOptions"
      ref="calendarRef"
      style=""
      class="[&>*]:[&>*]:[&>*]:overflow-hidden [&>*]:[&>*]:[&>*]:rounded-xl [&>*]:[&>*]:[&>*]:[&>tbody]:[&>*]:[&>*]:rounded-b-xl"
    />
    <!-- Drawer para edição/visualização do agendamento -->
    <AgendaDrawerComponent
      :drawerState="drawerState"
      :inEdition="inEdition"
      @update:drawerState="drawerState = $event"
      @saveAgendamento="fetchAppointments"
    />

    <Popover ref="popoverRef">
      <div class="flex flex-col gap-4 w-[25rem] p-4">
        <div class="w-full font-semibold text-sm text-gray-500 pb-2">
          Filtros de Agendamento
        </div>
        <div class="col-span-12 flex flex-col gap-2">
          <div class="flex flex-col">
            <label for="status" class="text-sm font-medium"> Status </label>
            <Select
              name="status"
              :options="[
                { value: 'ATIVO', label: 'Ativo' },
                { value: 'CANCELADO', label: 'Cancelado' },
                { value: 'CONFIRMADO', label: 'Confirmado' },
              ]"
              optionValue="value"
              optionLabel="label"
              fluid
              size="small"
              v-model="filters.status"
            />
          </div>
          <div class="flex flex-col">
            <label for="MedicoID" class="text-sm font-medium"> Médico </label>
            <Select
              name="MedicoID"
              :options="Array.isArray(listMedicos) ? listMedicos : []"
              optionValue="ID"
              optionLabel="Nome"
              fluid
              size="small"
              v-model="filters.medicoId"
            />
          </div>
        </div>
        <div class="col-span-12 flex justify-end gap-2">
          <Button
            label="Limpar"
            severity="secondary"
            size="small"
            class="ml-2"
            variant="text"
            @click="
              () => {
                popoverRef.hide();
                filters.status = null;
                filters.medicoId = null;
                selectedDate = new Date();
                fetchAppointments();
              }
            "
          />
          <Button
            label="Filtrar"
            icon="pi pi-check"
            severity="primary"
            size="small"
            @click="
              () => {
                popoverRef.hide();
                fetchAppointments();
              }
            "
          />
        </div>
      </div>
    </Popover>
  </div>
  <div class="flex items-center gap-x-4 py-4 px-2 flex-wrap">
    <cite class="flex items-center gap-1">
      <span class="!w-7 !h-3 !bg-[#308533] rounded-full"></span>
      Confirmado
    </cite>
    <cite class="flex items-center gap-1">
      <span class="!w-7 !h-3 !bg-[#b25900] rounded-full"></span>
      Ativo
    </cite>
    <cite class="flex items-center gap-1">
      <span class="!w-7 !h-3 !bg-[#f59e0b] rounded-full"></span>
      Pendente
    </cite>
    <cite class="flex items-center gap-1">
      <span class="!w-7 !h-3 !bg-[#dc2626] rounded-full"></span>
      Cancelado
    </cite>
  </div>
</template>

<script setup lang="ts">
import ptBr from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/vue3";
import { Button, Popover } from "primevue";
import Select from "primevue/select";
import { inject, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../../../stores/user";
import { PermissionsUtils } from "../../../../utils/PermissionsUtils";
// PrimeVue components (project already uses PrimeVue elsewhere)
import type { CalendarOptions } from "@fullcalendar/core/index.js";
import dayjs from "dayjs";
import { DatePicker } from "primevue";
import type { Ref } from "vue";
import { AppointmentsServices } from "../../../../services/appointments/AppointmentsServices";
import { UserLinksServices } from "../../../../services/user/UserLinksServices";
import { UsersServices } from "../../../../services/user/UsersServices";
import { DateUtils } from "../../../../utils/DateUtils";
import AgendaDrawerComponent from "../../../../views/Painel/clinicas/agenda/AgendaDrawerComponent.vue";

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

const selectedView = ref<string>("timeGridDay");
const selectedDate = ref<Date | null>(new Date());
const listMedicos = ref<any[]>([]);
const globalLoading = inject<Ref<boolean>>("globalLoading");
const events = ref<any[]>([]);
const drawerState = ref(false);
const inEdition = ref<any | null>(null);
const popoverRef = ref<any>(null);
const filters = reactive({
  medicoId: null,
  status: null,
});

const togglePopover = (event: any) => {
  popoverRef.value?.toggle(event);
};

function createNew() {
  inEdition.value = null;
  drawerState.value = true;
}

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
    weekday: "long",
    day: "2-digit",
    omitCommas: true,
    formatMatcher: "basic",
  },
  views: {
    dayGridMonth: {
      dayHeaderFormat: { weekday: "long" },
    },
    timeGridWeek: {
      dayHeaderFormat: {
        weekday: "long",
        day: "2-digit",
        omitCommas: true,
        formatMatcher: "best fit",
      },
      // limitar visualização de horas na week view
      slotMinTime: "06:00:00",
      slotMaxTime: "19:00:00",
      slotDuration: "00:30:00",
      slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
    },
    // adição para day view
    timeGridDay: {
      slotMinTime: "06:00:00",
      slotMaxTime: "19:00:00",
      slotDuration: "00:30:00",
      slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
    },
  },
  // aplica também globalmente caso a view não esteja no override
  slotMinTime: "06:00:00",
  slotMaxTime: "19:00:00",
  slotDuration: "00:30:00",
  slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
  scrollTime: "06:00:00",
  nowIndicator: true,
  eventTimeFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
  // custom render to add a check when event.extendedProps.status === 'ATIVO'
  eventContent: (arg: any) => {
    const status = arg.event.extendedProps?.status;
    const showCheck = String(status || "").toUpperCase() === "CONFIRMADO";
    const title = arg.event.title || "";
    const timeText = arg.timeText || "";
    const wrapper = document.createElement("div");
    wrapper.className = "fc-event-custom";

    const main = document.createElement("div");
    main.className = "fc-event-main";
    const titleEl = document.createElement("div");
    titleEl.className = "fc-event-title";
    titleEl.textContent = title;
    main.appendChild(titleEl);
    if (timeText) {
      const timeEl = document.createElement("div");
      timeEl.className = "fc-event-time";
      timeEl.textContent = timeText;
      main.appendChild(timeEl);
    }

    wrapper.appendChild(main);
    if (showCheck) {
      const check = document.createElement("span");
      check.className = "fc-event-check";
      check.innerHTML =
        '<i class="pi pi-check" style="font-size: 0.8rem; !important; "></i>';
      wrapper.appendChild(check);
    }

    return { domNodes: [wrapper] };
  },
  headerToolbar: false,
  editable: true,
  selectable: true,
  navLinks: true,
  height: "auto",
  events: events.value,
  aspectRatio: 1.2,
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
  eventDidMount: (info) => {
    const status = info.event.extendedProps.status;

    switch (status) {
      case "CONFIRMADO":
        info.el.style.backgroundColor = "#4caf5033";
        info.el.style.borderColor = "#29722b";
        info.el.style.color = "#29722b";
        break;
      case "ATIVO":
        info.el.style.backgroundColor = "#dbeafe";
        info.el.style.borderColor = "#1d4ed8";
        info.el.style.color = "#1d4ed8";
        break;
      case "CANCELADO":
        info.el.style.backgroundColor = "#f4433633";
        info.el.style.borderColor = "#990f0f";
        info.el.style.color = "#990f0f";
        break;
      case "CONCLUIDO":
        info.el.style.backgroundColor = "#2196f333";
        info.el.style.borderColor = "#185996";
        info.el.style.color = "#185996";
        break;
    }
    const titleEl = info.el.querySelector(".fc-event-title") as HTMLElement;
    const timeEl = info.el.querySelector(".fc-event-time") as HTMLElement;
    const checkEl = info.el.querySelector(".fc-event-check") as HTMLElement;
    if (titleEl) {
      titleEl.style.color = info.el.style.color;
      titleEl.style.paddingLeft = "0.3rem";
    }
    if (timeEl) {
      timeEl.style.color = info.el.style.color;
      timeEl.style.paddingLeft = "0.3rem";
    }
    if (checkEl) {
      checkEl.style.color = info.el.style.color;
      checkEl.style.paddingRight = "0.3rem";
      checkEl.style.paddingTop = "0.2rem";
    }
  },
  dateClick: (info: any) => {
    /* placeholder: abrir modal de criação de agendamento */
  },
  eventClick: (info: any) => {
    // Ao clicar em um evento, abrir o drawer e passar os dados do evento
    try {
      const ev = info.event;

      const full = ev.extendedProps?.fullData || null;

      if (full) {
        // Use o objeto completo vindo da API (mapeado em extendedProps.fullData)
        // Garantir nomes esperados pelo drawer (não mutar o original)
        inEdition.value = { ...full };
        // Normalize data_hora se existir (converter UTC do backend para ISO local)
        if (inEdition.value.data_hora) {
          try {
            inEdition.value.data_hora = DateUtils.convertUTCToLocalTime(
              inEdition.value.data_hora
            );
          } catch (err) {
            console.warn("Não foi possível normalizar data_hora:", err);
          }
        }
      } else {
        // Derivar um objeto compatível a partir dos campos disponíveis no evento
        inEdition.value = {
          id: ev.id,
          titulo: ev.title || "",
          nome_cliente: ev.title || "",
          data_hora: ev.start
            ? DateUtils.convertUTCToLocalTime(ev.start.toISOString())
            : null,
          data_nascimento: ev.extendedProps?.data_nascimento || null,
          telefone_contato: ev.extendedProps?.telefone_contato || null,
          convenio: ev.extendedProps?.convenio || null,
          medico_id:
            ev.extendedProps?.medico_id || ev.extendedProps?.MedicoID || null,
          status: ev.extendedProps?.status || null,
        };
      }

      drawerState.value = true;
    } catch (e) {
      console.error("Erro ao processar clique no evento:", e);
    }
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
  console.log(selectedView.value, currentDate);

  if (selectedView.value === "timeGridDay") {
    return {
      dataInicio:
        dayjs(currentDate).startOf("day").format("YYYY-MM-DD") + "T00:00:00Z",
      dataFim:
        dayjs(currentDate).endOf("day").format("YYYY-MM-DD") + "T23:59:59Z",
    };
  }

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
          ? DateUtils.convertUTCToLocalTime(appointment.data_hora)
          : null;

        // Prefer duracao_sec if provided, otherwise default to 30 minutes
        const durationMinutes =
          (appointment.duracao_sec ? appointment.duracao_sec / 60 : null) || 30;
        const end = start
          ? dayjs(start).add(durationMinutes, "minute").toISOString()
          : null;

        const colors = {
          border: {
            ATIVO: "#28a745",
            CANCELADO: "#dc3545",
            CONFIRMADO: "#007bff",
          },
          background: {
            ATIVO: "#d4edda",
            CANCELADO: "#f8d7da",
            CONFIRMADO: "#cce5ff",
          },
          text: {
            ATIVO: "#155724",
            CANCELADO: "#721c24",
            CONFIRMADO: "#004085",
          },
        };

        return {
          id,
          title:
            appointment.nome_cliente ||
            appointment.titulo ||
            "Paciente Desconhecido",
          start,
          end,
          allDay: false,
          extendedProps: {
            status: appointment.status ?? appointment.Status ?? null,
            // keep the original appointment payload so drawers can consume full data
            fullData: appointment,
          },
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

/* Aumenta células no mês */
::v-deep(.fc .fc-daygrid-day-frame) {
  min-height: 100px !important;
}

/* Aumenta slots na semana/dia */
::v-deep(.fc .fc-timegrid-slot) {
  height: 50px !important;
}

/* Custom event content added by eventContent */
::v-deep(.fc .fc-event-custom) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
}
::v-deep(.fc .fc-event-custom .fc-event-main) {
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
}
::v-deep(.fc .fc-event-custom .fc-event-title) {
  font-weight: 600;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
::v-deep(.fc .fc-event-check) {
  margin-left: 8px;
  font-weight: 700;
  align-self: flex-start;
  position: absolute;
  right: 4px;
  top: 0;
}
::v-deep(.fc .fc-daygrid-day.fc-day-today) {
  background-color: #f8fcff !important; /* azul claro */
}

::v-deep(.fc .fc-timegrid-col.fc-day-today) {
  background-color: #f8fcff !important;
}
</style>
