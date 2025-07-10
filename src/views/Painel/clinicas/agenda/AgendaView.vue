<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex justify-between items-center mb-4">
      <div>
        <Button
          label="Novo Agendamento"
          icon="pi pi-plus"
          class="h-[40px]"
          type="button"
          severity="success"
          :disabled="!permissionsUserPage.criar"
          @click="
            inEdition = null;
            drawerState = true;
          "
        />
      </div>
      <!-- Controles de visualização -->
      <div class="flex items-center gap-2">
        <Button
          type="button"
          icon="pi pi-filter"
          variant=""
          severity="secondary"
          v-tooltip.top="'Filtrar'"
          @click="togglePopover"
        />

        <div class="relative">
          <button
            @click="toggleNavigator"
            class="navigator-button cursor-pointer px-3 py-2 h-[40px] bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            📅 {{ formatDisplayDate(calendarConfig.startDate) }}
          </button>

          <div
            v-if="showNavigator"
            class="navigator-dropdown absolute top-full left-0 mt-1 z-50 bg-white shadow-lg border rounded-lg"
          >
            <DayPilotNavigator
              id="nav-compact"
              :config="navigatorCompactConfig"
              ref="navigatorCompact"
              class="border-0"
            />
          </div>
        </div>
        <Select
          id="view-selector"
          v-model="selectedView"
          :options="viewOptions"
          optionLabel="label"
          optionValue="value"
          @change="onViewChange"
          placeholder="Selecione a visualização"
          class="w-48"
        />
      </div>
    </div>

    <!-- Calendário principal -->
    <div class="flex-1 w-full">
      <DayPilotCalendar ref="calendar" :config="calendarConfig" />
    </div>

    <!-- Drawer Component -->
    <AgendaDrawerComponent
      :drawerState="drawerState"
      :inEdition="inEdition"
      @update:drawerState="drawerState = $event"
      @saveAgendamento="fetchAppointments"
    />
  </div>

  <Popover ref="popoverRef">
    <div class="flex flex-col gap-4 w-[25rem]">
      <div class="w-full font-semibold text-sm text-gray-500 pb-2">
        Filtros de Agendamento
      </div>
      <div class="col-span-12 flex flex-col gap-2">
        <div class="flex flex-col">
          <label for="MedicoID" class="text-sm font-medium"> Status </label>
          <Select
            name="MedicoID"
            :options="[
              { ID: 'ATIVO', Nome: 'Ativo' },
              { ID: 'CANCELADO', Nome: 'Cancelado' },
              { ID: 'CONFIRMADO', Nome: 'Confirmado' },
            ]"
            optionValue="ID"
            optionLabel="Nome"
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
            popoverRef.hide();
            filters.status = null;
            filters.medicoId = null;
            selectedView = 'Week';
            calendarConfig.startDate = DayPilot.Date.today();
            fetchAppointments();
          "
        />
        <Button
          label="Filtrar"
          icon="pi pi-check"
          severity="primary"
          size="small"
          @click="
            popoverRef.hide();
            fetchAppointments();
          "
        />
      </div>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onUnmounted } from "vue";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-vue";
import Select from "primevue/select";
import { useConfirm } from "primevue/useconfirm";
import { AppointmentsServices } from "../../../../services/appointments/AppointmentsServices";
import {
  Button,
  FloatLabel,
  InputGroup,
  InputGroupAddon,
  InputText,
  Message,
  Popover,
} from "primevue";
import AgendaDrawerComponent from "./AgendaDrawerComponent.vue";
import { PermissionsUtils } from "../../../../utils/PermissionsUtils";
import { useRouter } from "vue-router";
import { useUserStore } from "../../../../stores/user";
import { UsersServices } from "../../../../services/user/UsersServices";
import { UserLinksServices } from "../../../../services/user/UserLinksServices";
import { DateUtils } from "../../../../utils/DateUtils";

const router = useRouter();
const permissionsUserPage = ref(
  PermissionsUtils.checkMethodPemission(router.currentRoute.value.fullPath)
);
const calendar = ref<DayPilotCalendar | null>(null);
const confirm = useConfirm();
const globalLoading = ref(false);
const drawerState = ref(false);
const inEdition = ref(null);
const showNavigator = ref(false);
const popoverRef = ref();
const userStore = useUserStore();
const listMedicos = ref([]);
const filters = reactive({
  status: null,
  medicoId: null,
});

const viewOptions = [
  { label: "Dia", value: "Day" },
  { label: "Semana", value: "Week" },
];

const selectedView = ref("Week");

const formatDisplayDate = (date: any) => {
  if (!date) return "";

  const dpDate = new DayPilot.Date(date);

  if (selectedView.value === "Day") {
    return dpDate.toString("dd/MM/yyyy");
  } else {
    // Para semana, mostrar range
    const startOfWeek = dpDate.firstDayOfWeek();
    const endOfWeek = startOfWeek.addDays(6);
    return `${startOfWeek.toString("dd/MM")} - ${endOfWeek.toString(
      "dd/MM/yyyy"
    )}`;
  }
};

const togglePopover = (event) => {
  popoverRef.value.toggle(event);
};

const onViewChange = () => {
  calendarConfig.viewType = selectedView.value;

  if (selectedView.value === "Day") {
    calendarConfig.cellWidth = 924; // 840 + 10% = 924
    calendarConfig.cellHeight = 33; // 30 + 10% = 33
    navigatorCompactConfig.selectMode = "Day";
  } else if (selectedView.value === "Week") {
    calendarConfig.cellWidth = 132; // 120 + 10% = 132
    calendarConfig.cellHeight = 33; // 30 + 10% = 33
    navigatorCompactConfig.selectMode = "Week";
  }
  syncNavigatorWithCalendar();
};

const syncNavigatorWithCalendar = () => {
  navigatorCompactConfig.startDate = calendarConfig.startDate;
  navigatorCompactConfig.selectionDay = calendarConfig.startDate;
};

const toggleNavigator = () => {
  if (!showNavigator.value) {
    syncNavigatorWithCalendar();
  }
  showNavigator.value = !showNavigator.value;
};

const events = ref([]);

const handleDeleteAppointment = async (eventId: string) => {
  try {
    globalLoading.value = true;
    const response = await AppointmentsServices.deleteAppointment({
      id: eventId,
    });
    if (response.status === 200) {
      const index = events.value.findIndex(
        (e) => String(e.id) === String(eventId)
      );
      if (index > -1) {
        events.value.splice(index, 1);
        calendarConfig.events = [...events.value];

        if (calendar.value) {
          calendar.value.control.events.list = [...events.value];
          calendar.value.control.update();
        }
      } else {
        console.error("Event not found in local list");
      }
    } else {
      console.error(
        "Failed to delete event from API, status:",
        response.status
      );
    }
  } catch (error) {
    console.error("Error deleting appointment:", error);
  } finally {
    globalLoading.value = false;
  }
};

const calendarConfig = reactive({
  viewType: selectedView.value,
  startDate: DayPilot.Date.today(),
  timeRangeSelectedHandling: "Disabled", // Desabilita a seleção de intervalo de tempo
  height: 200,
  cellHeight: 33, // 30 + 10% = 33
  hourWidth: 55, // 50 + 10% = 55
  cellWidth: 132, // 120 + 10% = 132
  dayBeginsHour: 8, // Define o horário de início exibido no calendário
  dayEndsHour: 17, // Define o horário de fim exibido no calendário
  businessBeginsHour: 8, // Define o início do horário comercial (para styling)
  businessEndsHour: 17, // Define o fim do horário comercial (para styling)
  showNonBusiness: false, // Oculta horários não comerciais (opcional)
  locale: "pt-br", // Define o idioma e formatação para português brasileiro
  headerDateFormat: "dd/MM/yyyy", // Formato brasileiro para o header das colunas
  timeHeaders: [{ groupBy: "Hour" }, { groupBy: "Cell", format: "mm" }],
  eventBorderRadius: "8px",
  eventCorners: "Round",
  eventHoverColor: "#cccccc",
  eventDeleteHandling: "Disabled",
  eventMoveHandling: "Disabled",
  eventResizeHandling: "Disabled",
  eventClickHandling: "Enabled",
  eventSelectHandling: "Update",
  onEventClick: async (args: any) => {
    console.log("Event clicked:", args.e.data?.fullData);
    inEdition.value = args.e.data?.fullData || null;
    drawerState.value = true;
  },
  onEventSelected: (args: any) => {
    console.log("Event selected:", args.e.id());
  },
  onBeforeEventRender: (args: any) => {
    args.data.areas = [
      {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        style: "border-radius: 8px; overflow: hidden;",
      },
      {
        onClick: async (args: any) => {
          if (args.originalEvent) {
            args.originalEvent.preventDefault();
            args.originalEvent.stopPropagation();
            args.originalEvent.stopImmediatePropagation();
          }

          // console.log("Delete button clicked:", args.source);
          const eventText = args.source.data.text;
          const eventId = args.source.data.id;

          // Usa o PrimeVue confirm
          confirm.require({
            message: `Tem certeza que deseja excluir o evento "${eventText}"?`,
            header: "Confirmar Exclusão",
            icon: "pi pi-exclamation-triangle",
            acceptClass: "p-button-danger",
            rejectProps: {
              label: "Cancelar",
              severity: "secondary",
              outlined: true,
            },
            acceptProps: {
              label: "Excluir",
              severity: "success",
            },
            accept: () => {
              console.log("Confirmed deletion for event ID:", eventId);
              handleDeleteAppointment(eventId);
            },
            reject: () => {
              console.log("Deletion cancelled");
            },
          });
        },
        width: 16,
        height: 16,
        top: 2,
        right: 2,
        visibility: "Hover",
        cssClass: "delete-button",
        html: "✕",
        style:
          "background: rgba(0, 0, 0, 0.7); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 10px; cursor: pointer; line-height: 1; backdrop-filter: blur(4px); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); z-index: 1000; position: relative;",
      },
    ];
  },
  onTimeRangeSelected: (args: any) => {
    console.log("Time range selected:", args);
    const newEvent = {
      id: Date.now(),
      text: "Novo Agendamento",
      start: args.start,
      end: args.end,
      backColor: "#93c47d",
      borderColor: "darker",
      borderRadius: "8px",
    };

    events.value.push(newEvent);
    calendarConfig.events = [...events.value];
  },
  events: events.value,
});

const navigatorCompactConfig = reactive({
  showMonths: 1,
  skipMonths: 1,
  selectMode: selectedView.value === "Week" ? "Week" : "Day",
  startDate: DayPilot.Date.today(),
  selectionDay: DayPilot.Date.today(),
  onTimeRangeSelected: (args: any) => {
    if (selectedView.value === "Week") {
      calendarConfig.startDate = args.start;
      navigatorCompactConfig.startDate = args.start;
      navigatorCompactConfig.selectionDay = args.start;
    } else {
      calendarConfig.startDate = args.day;
      navigatorCompactConfig.startDate = args.day;
      navigatorCompactConfig.selectionDay = args.day;
    }
    showNavigator.value = false; // Fechar o dropdown
    fetchAppointments();
  },
});

const convertAppointmentsToEvents = (agendamentos: any[]) => {
  return agendamentos.map((agendamento) => {
    // const localDate = DateUtils.convertUTCToLocalTime(agendamento.data_hora);
    const startDate = new DayPilot.Date(agendamento.data_hora);

    const durationHours = 0.5;
    const endDate = startDate.addHours(durationHours).addSeconds(1);

    let backColor = "#93c47d";
    if (agendamento.status === "ATIVO") {
      backColor = "#76a5af";
    } else if (agendamento.status === "CANCELADO") {
      backColor = "#e74c3c";
    } else if (agendamento.status === "CONCLUIDO") {
      backColor = "#2ecc71";
    }

    return {
      id: String(agendamento.id),
      text: `${agendamento.titulo} - ${agendamento.nome_cliente}`,
      start: startDate,
      end: endDate,
      backColor: backColor,
      borderColor: "darker",
      borderRadius: "8px",
      cssClass: `event-${agendamento.status.toLowerCase()}`,
      html: `
        <div class="event-content" data-status="${
          agendamento.status
        }" style="color: white !important; border-radius: 8px !important; height: 100%; width: 100%; overflow: hidden;">
          <div class="event-title" style="color: white !important; font-weight: bold; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
            agendamento.medico?.nome_completo || "Médico não informado"
          }</div>
          <div class="event-client" style="color: white !important; font-size: 10px; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
            agendamento.nome_cliente
          }</div>
          <div class="event-doctor" style="color: white !important; font-size: 9px; opacity: 0.8; font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
            agendamento.titulo
          }</div>
        </div>
      `,
      medico: agendamento.medico?.nome_completo || "Médico não informado",
      telefone: agendamento.telefone_contato,
      convenio: agendamento.convenio,
      status: agendamento.status,
      fullData: { ...agendamento },
    };
  });
};

const calculateDateRange = () => {
  const currentDate = new DayPilot.Date(calendarConfig.startDate);
  let dataInicio: string;
  let dataFim: string;

  if (selectedView.value === "Day") {
    dataInicio = currentDate.toString("yyyy-MM-dd") + "T00:00:00Z";
    dataFim = currentDate.toString("yyyy-MM-dd") + "T23:59:59Z";
  } else if (selectedView.value === "Week") {
    const startOfWeek = currentDate.firstDayOfWeek();
    const endOfWeek = startOfWeek.addDays(6);

    dataInicio = startOfWeek.toString("yyyy-MM-dd") + "T00:00:00Z";
    dataFim = endOfWeek.toString("yyyy-MM-dd") + "T23:59:59Z";
  } else {
    const startOfWeek = currentDate.firstDayOfWeek();
    const endOfWeek = startOfWeek.addDays(6);

    dataInicio = startOfWeek.toString("yyyy-MM-dd") + "T00:00:00Z";
    dataFim = endOfWeek.toString("yyyy-MM-dd") + "T23:59:59Z";
  }

  return { dataInicio, dataFim };
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
      const convertedEvents = convertAppointmentsToEvents(
        response.data?.data.agendamentos
      );

      events.value = convertedEvents;

      calendarConfig.events = [...events.value];
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

  // Sincronizar o navigator com a data inicial do calendário
  syncNavigatorWithCalendar();

  // Adicionar evento de clique para fechar o dropdown do navigator
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Função para fechar o dropdown quando clicar fora
const handleClickOutside = (event: Event) => {
  const target = event.target as Element;
  const dropdown = document.querySelector(".navigator-dropdown");
  const button = document.querySelector(".navigator-button");

  if (
    dropdown &&
    button &&
    !dropdown.contains(target) &&
    !button.contains(target)
  ) {
    showNavigator.value = false;
  }
};
</script>

<style>
.daypilot_calendar_event {
  border-radius: 8px !important;
  border: 2px solid transparent !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  font-weight: 500 !important;
  padding: 4px 8px !important;
  transition: all 0.2s ease !important;
  color: white !important;
}

.daypilot_calendar_event:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.daypilot_calendar_event .daypilot_calendar_event_inner {
  color: white !important;
  border-radius: 6px !important;
}

.event-ativo,
.daypilot_calendar_event[data-status="ATIVO"] {
  background: linear-gradient(135deg, #76a5af 0%, #5a8a96 100%) !important;
  color: white !important;
}

.event-cancelado,
.daypilot_calendar_event[data-status="CANCELADO"] {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
  color: white !important;
  opacity: 0.8 !important;
}

.event-concluido,
.event-confirmado,
.daypilot_calendar_event[data-status="CONCLUIDO"],
.daypilot_calendar_event[data-status="CONFIRMADO"] {
  background: linear-gradient(135deg, #5be494c2 0%, #4ace53 100%) !important;
  color: white !important;
}

.daypilot_calendar_event_inner {
  font-size: 12px !important;
  line-height: 1.3 !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  color: white !important;
  border-radius: 6px !important;
}

.daypilot_calendar_event_selected {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
}

.daypilot_calendar_event[style*="height: 20px"] {
  font-size: 10px !important;
  padding: 2px 4px !important;
}

.daypilot_calendar_main {
  border-radius: 8px !important;
  overflow: hidden !important;
}

.daypilot_calendar_header_col {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
  border-bottom: 2px solid #cbd5e1 !important;
  font-weight: 600 !important;
  color: #374151 !important;
}

.daypilot_calendar_rowheader {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%) !important;
  border-right: 1px solid #cbd5e1 !important;
  color: #64748b !important;
  font-weight: 500 !important;
}

.event-content {
  padding: 2px 4px !important;
  height: 90% !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  border-radius: 6px !important;
  color: white !important;
  overflow: hidden !important;
}

.event-title {
  font-weight: bold !important;
  font-size: 1rem !important;
  line-height: 1 !important;
  margin-bottom: 1px !important;
  color: white !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.event-client {
  font-size: 0.9rem !important;
  opacity: 0.9 !important;
  line-height: 1.1 !important;
  margin-bottom: 1px !important;
  color: white !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.event-doctor {
  font-size: 0.8rem !important;
  opacity: 0.8 !important;
  line-height: 1.1 !important;
  font-style: italic !important;
  color: white !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.event-cancelado {
  opacity: 0.7 !important;
}

@keyframes eventPulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

.event-ativo .event-content {
  animation: eventPulse 2s infinite !important;
}

/* Estilos globais adicionais para garantir que funcionem */
div[class*="daypilot_calendar_event"] {
  border-radius: 8px !important;
  color: white !important;
  overflow: hidden !important;
}

div[class*="daypilot_calendar_event"] div {
  color: white !important;
}

div[class*="daypilot_calendar_event"] * {
  color: white !important;
}

/* Força border radius em todos os elementos do evento */
.daypilot_calendar_event,
.daypilot_calendar_event_inner,
.daypilot_calendar_event_main,
.daypilot_calendar_event_bar,
.daypilot_calendar_event_bar_inner {
  border-radius: 8px !important;
  overflow: hidden !important;
}

/* Seletores específicos para elementos DayPilot */
div[id*="daypilot_calendar_event"] {
  border-radius: 8px !important;
  overflow: hidden !important;
}

div[id*="daypilot_calendar_event"] > div {
  border-radius: 8px !important;
  overflow: hidden !important;
}

/* Força a aplicação dos estilos por status */
.daypilot_calendar_event.event-ativo {
  background: linear-gradient(135deg, #76a5af 0%, #5a8a96 100%) !important;
  border-radius: 8px !important;
}

.daypilot_calendar_event.event-cancelado {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
  border-radius: 8px !important;
}

.daypilot_calendar_event.event-concluido,
.daypilot_calendar_event.event-confirmado {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%) !important;
  border-radius: 8px !important;
}

.calendar_default_main {
  border-radius: 8px !important;
  overflow: hidden !important;
}
.navigator_default_main {
  border-radius: 8px !important;
  overflow: hidden !important;
}

/* Estilos para indicar status dos agendamentos usando calendar_default_event_bar_inner */
.calendar_default_event_bar_inner {
  border-radius: 8px !important;
  overflow: hidden !important;
}

/* Status ATIVO - Azul */
.event-ativo .calendar_default_event_bar_inner {
  background: linear-gradient(135deg, #76a5af 0%, #5a8a96 100%) !important;
}

/* Status CANCELADO - Vermelho */
.event-cancelado .calendar_default_event_bar_inner {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
  opacity: 0.8 !important;
}

/* Status CONCLUIDO/CONFIRMADO - Verde */
.event-concluido .calendar_default_event_bar_inner,
.event-confirmado .calendar_default_event_bar_inner {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%) !important;
}

/* Estilos para o botão de delete customizado */
.delete-button {
  background: transparent !important;
  color: white !important;
  border-radius: 50% !important;
  font-weight: 900 !important;
  font-size: 10px !important;
  cursor: pointer !important;
  box-shadow: 0 !important;
  transition: all 0.2s ease !important;
  backdrop-filter: blur(4px) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
  border: none !important;
  position: absolute !important;
  padding: 2px !important;
  z-index: 1000 !important;
  pointer-events: auto !important;
}

.delete-button:hover {
  background: rgba(220, 53, 69, 0.9) !important;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4) !important;
  backdrop-filter: blur(8px) !important;
}

.delete-button:active {
  transform: scale(0.95) !important;
  transition: all 0.1s ease !important;
}

/* Estilos para o Navigator compacto */
.navigator-dropdown {
  max-width: 300px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.navigator-dropdown .navigator_default_main {
  border: none !important;
  border-radius: 8px !important;
  overflow: hidden !important;
}

/* Botão do navigator compacto */
.navigator-button {
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;
}

.navigator-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.navigator-button:active {
  transform: translateY(0);
}

/* Responsividade */
@media (max-width: 768px) {
  .navigator-dropdown {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
  }

  .navigator-button {
    min-width: auto;
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>
