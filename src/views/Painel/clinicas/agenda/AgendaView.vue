<template>
  <div class="h-full w-full flex flex-col">
    <div class="mb-4 flex justify-end">
      <div class="flex items-center gap-2">
        <label for="view-selector" class="text-sm font-medium text-gray-700">
          Visualização:
        </label>
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

    <div class="flex gap-2 flex-row h-full w-full flex-1">
      <div class="flex-shrink-0">
        <DayPilotNavigator
          id="nav"
          :config="navigatorConfig"
          ref="navigator"
          class=""
        />
      </div>
      <div class="agenda-view ">
        <DayPilotCalendar ref="calendar" :config="calendarConfig" class="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-vue";
import Select from "primevue/select";
import { useConfirm } from "primevue/useconfirm";
import { AppointmentsServices } from "../../../../services/appointments/AppointmentsServices";

const calendar = ref<DayPilotCalendar | null>(null);
const confirm = useConfirm();
const globalLoading = ref(false);

const viewOptions = [
  { label: "Dia", value: "Day" },
  { label: "Semana", value: "Week" },
];

const selectedView = ref("Week");

const onViewChange = () => {
  calendarConfig.viewType = selectedView.value;

  if (selectedView.value === "Day") {
    calendarConfig.cellWidth = 924; // 840 + 10% = 924
    calendarConfig.cellHeight = 33; // 30 + 10% = 33
    navigatorConfig.selectMode = "Day";
  } else if (selectedView.value === "Week") {
    calendarConfig.cellWidth = 132; // 120 + 10% = 132
    calendarConfig.cellHeight = 33; // 30 + 10% = 33
    navigatorConfig.selectMode = "Week";
  }

  fetchAppointments();
};

const events = ref([]);

// Função para lidar com a exclusão de agendamentos
const handleDeleteAppointment = async (eventId: string) => {
  try {
    globalLoading.value = true;

    // Chama a API para excluir o agendamento
    const response = await AppointmentsServices.deleteAppointment({ id: eventId });

    if (response.status === 200) {
      // Remove do array de eventos local apenas se a API retornou sucesso
      const index = events.value.findIndex(
        (e) => String(e.id) === String(eventId)
      );
      if (index > -1) {
        events.value.splice(index, 1);
        calendarConfig.events = [...events.value];

        // Força atualização do calendário
        if (calendar.value) {
          calendar.value.control.events.list = [...events.value];
          calendar.value.control.update();
        }
        console.log("Event deleted successfully from API and local list");
      } else {
        console.error("Event not found in local list");
      }
    } else {
      console.error("Failed to delete event from API, status:", response.status);
    }
  } catch (error) {
    console.error("Error deleting appointment:", error);
    // Aqui você pode adicionar uma notificação de erro para o usuário
  } finally {
    globalLoading.value = false;
  }
};

const calendarConfig = reactive({
  viewType: selectedView.value,
  startDate: DayPilot.Date.today(),
  timeRangeSelectedHandling: "Enabled",
  height: 200,
  cellHeight: 33, // 30 + 10% = 33
  hourWidth: 55, // 50 + 10% = 55
  cellWidth: 132, // 120 + 10% = 132
  businessBeginsHour: 7,
  businessEndsHour: 19,
  showNonBusiness: true,
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
    console.log("Event clicked:", args.e);
    // Aqui você pode adicionar lógica para abrir um modal de edição do evento
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
          console.log("Delete button clicked:", args.source);

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
          "background: rgba(0, 0, 0, 0.7); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 10px; cursor: pointer; line-height: 1; backdrop-filter: blur(4px); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);",
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

const navigatorConfig = reactive({
  showMonths: 3,
  skipMonths: 3,
  selectMode: selectedView.value === "Week" ? "Week" : "Day",
  startDate: DayPilot.Date.today(),
  selectionDay: DayPilot.Date.today(),
  onTimeRangeSelected: (args: any) => {
    if (selectedView.value === "Week") {
      // Para seleção de semana, args.start já é o primeiro dia da semana
      calendarConfig.startDate = args.start;
    } else {
      // Para seleção de dia
      calendarConfig.startDate = args.day;
    }
    fetchAppointments();
  },
});

const convertAppointmentsToEvents = (agendamentos: any[]) => {
  return agendamentos.map((agendamento) => {
    const startDate = new DayPilot.Date(agendamento.data_hora);

    // Duração padrão de 30 minutos (0.5 horas)
    const durationHours = 0.5;
    const endDate = startDate.addHours(durationHours);

    let backColor = "#93c47d";
    if (agendamento.status === "ATIVO") {
      backColor = "#76a5af";
    } else if (agendamento.status === "CANCELADO") {
      backColor = "#e74c3c";
    } else if (agendamento.status === "CONCLUIDO") {
      backColor = "#2ecc71";
    }

    return {
      id: String(agendamento.id), // Garante que o ID seja string
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
            agendamento.titulo
          }</div>
          <div class="event-client" style="color: white !important; font-size: 10px; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
            agendamento.nome_cliente
          }</div>
          <div class="event-doctor" style="color: white !important; font-size: 9px; opacity: 0.8; font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
            agendamento.medico?.nome_completo || "Médico não informado"
          }</div>
        </div>
      `,
      medico: agendamento.medico?.nome_completo || "Médico não informado",
      telefone: agendamento.telefone_contato,
      convenio: agendamento.convenio,
      status: agendamento.status,
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

async function fetchAppointments() {
  try {
    globalLoading.value = true;
    const { dataInicio, dataFim }: any = calculateDateRange();

    const response = await AppointmentsServices.getAppointments({
      page: 1,
      dataInicio,
      dataFim,
    });

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
  await fetchAppointments();
});
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
</style>
