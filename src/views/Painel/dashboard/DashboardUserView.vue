<template>
  <div class="p-2">
    <!-- Top -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="font-semibold text-gray-500">
          Dashboard
          {{ viewMode === "CLINIC" ? "da Clínica" : "da Administração" }}
        </h2>
        <p class="text-sm text-gray-400">
          Visão geral das atividades recentes e status do sistema.
        </p>
      </div>
      <div class="flex flex-col justify-end items-end text-gray-400">
        <!-- <span class="font-semibold text-gray-800">{{ dateAndHour[1] }}</span> -->
        <!-- <span class="font-normal text-sm">{{ dateAndHour[0] }}</span> -->
        <ButtonGroup class="h-6 self-end">
          <Button
            size="small"
            label="Dia"
            :variant="
              staticFilters.scheduleChart === 'day' ? 'filled' : 'outlined'
            "
            @click="changeChartView('day')"
          />
          <Button
            size="small"
            label="Mês"
            :variant="
              staticFilters.scheduleChart === 'month' ? 'filled' : 'outlined'
            "
            @click="changeChartView('month')"
          />
        </ButtonGroup>
      </div>
    </div>

    <!-- Panel -->
    <div class="w-full h-full grid grid-cols-12 gap-4">
      <!-- Taxa de Agendamento -->
      <!-- <div class="col-span-12 sm:col-span-3">
        <CardComponent
          :loading="Loading"
          title="Taxa de Agendamento"
          :icon="TrendingUp"
        >
          <div class="flex flex-col justify-center items-start gap-2 h-full">
            <span class="font-bold text-2xl text-blue-700"> 78% </span>
            <ProgressBar
              class="w-full !h-2"
              :value="78"
              color="#2563EB"
              :show-value="false"
            />
            <cite class="text-sm text-gray-400"> Todos os leads </cite>
          </div>
        </CardComponent>
      </div> -->

      <!-- Agendamentos por IA -->
      <div class="col-span-12 row-span-1 sm:col-span-3">
        <CardComponent
          :loading="Loading"
          title="Agendamentos por IA"
          :icon="Bot"
        >
          <div class="flex flex-col justify-center items-start gap-2 h-full">
            <span class="font-bold text-2xl text-blue-700">
              {{
                staticFilters.scheduleChart === "day"
                  ? dashboardData?.dayAI?.agendamentos?.agendamentos_por_ia
                  : dashboardData?.monthAI?.agendamentos?.agendamentos_por_ia
              }}
            </span>
            <cite class="text-sm text-gray-400">
              Agendamentos automatizados
            </cite>
          </div>
        </CardComponent>
      </div>

      <!-- Tempo Economizado -->
      <div class="col-span-12 row-span-1 sm:col-span-3">
        <CardComponent
          :loading="Loading"
          title="Tempo Economizado"
          :icon="Clock"
        >
          <div class="flex flex-col justify-center items-start gap-2 h-full">
            <span class="font-bold text-2xl text-blue-700">
              {{
                staticFilters.scheduleChart === "day"
                  ? calculateTime(
                      dashboardData?.dayAI?.resposta?.tempo_medio_resposta_s,
                      dashboardData?.dayAI?.resposta?.total_mensagens
                    )
                  : calculateTime(
                      dashboardData?.monthAI?.resposta?.tempo_medio_resposta_s,
                      dashboardData?.monthAI?.resposta?.total_mensagens
                    )
              }}
            </span>
            <cite class="text-sm text-gray-400"> Todos os leads </cite>
          </div>
        </CardComponent>
      </div>

      <!-- GRAFICO Pacientes Hoje -->
      <div class="col-span-12 row-span-1 sm:col-span-3">
        <CardComponent
          :loading="Loading"
          :title="`Pacientes ${
            staticFilters.scheduleChart === 'day' ? 'Hoje' : 'Este Mês'
          }`"
          :icon="Users"
        >
          <div class="flex flex-col justify-center items-center gap-4">
            <div class="w-full h-48 relative overflow-hidden">
              <p
                v-if="
                  !pieChartData ||
                  !pieChartData.labels ||
                  pieChartData.labels.length === 0
                "
                class="text-center text-gray-400 mt-16"
              >
                Sem dados para exibir
              </p>
              <Chart
                v-else
                type="doughnut"
                :data="pieChartData"
                class="w-full h-full"
                :options="{
                  responsive: true,
                  maintainAspectRatio: false,
                  aspectRatio: 1,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        padding: 8,
                        font: {
                          size: 11,
                        },
                      },
                    },
                  },
                  layout: {
                    padding: 8,
                  },
                }"
              />
            </div>
          </div>
        </CardComponent>
      </div>

      <!-- Lista de Espera -->
      <div class="col-span-12 row-span-2 sm:col-span-3">
        <CardComponent
          :loading="Loading"
          title="Lista de Espera"
          :icon="Clock"
          h="100%"
        >
          <div
            class="flex flex-col justify-start items-start gap-2 h-full overflow-auto max-h-[40vw] w-full"
          >
            <WaitListWrapper :minified="true" />
          </div>
        </CardComponent>
      </div>

      <!-- Horarios Hoje -->
      <div class="col-span-12 sm:col-span-9">
        <CardComponent
          :loading="Loading"
          title="Horarios Hoje"
          :icon="Calendar"
        >
          <div
            class="flex flex-col justify-start items-start gap-2 h-full max-h-[40vw] overflow-y-auto py-2 pr-2"
          >
            <div
              v-for="hour in hours"
              :key="hour"
              class="flex justify-between items-center border border-gray-200 rounded-lg w-full"
            >
              <div class="px-4 py-2 flex justify-between items-center w-full">
                <!-- Esquerda -->
                <div class="flex justify-start items-center gap-6">
                  <span class="text-md text-gray-700 font-semibold">{{
                    hour
                  }}</span>
                  <div class="flex justify-between items-center gap-2">
                    <i
                      class="pi pi-user w-4 h-4 text-green-500"
                      v-if="getAppointmentDetail(hour)?.nome_paciente"
                    ></i>
                    <i class="pi pi-clock w-4 h-4 text-gray-400" v-else></i>
                    <span
                      class="text-sm"
                      :class="{
                        'font-semibold text-gray-700':
                          !!getAppointmentDetail(hour)?.nome_paciente,
                        'font-normal text-gray-400':
                          !getAppointmentDetail(hour)?.nome_paciente,
                      }"
                    >
                      {{
                        getAppointmentDetail(hour)?.nome_paciente ||
                        "Disponível"
                      }}
                    </span>
                  </div>
                </div>

                <!-- Direita -->
                <div
                  v-if="getAppointmentDetail(hour)?.nome_paciente"
                  :class="`bg-[#4CAF50] text-xs font-medium px-2 py-1 text-white rounded-sm`"
                >
                  Ocupadoo
                </div>
                <div
                  v-else
                  class="bg-gray-100 text-xs px-2 py-1 rounded-md font-medium"
                >
                  Livre
                </div>
              </div>
            </div>
          </div>
        </CardComponent>
      </div>

      <!-- Aniversariantes -->
      <div class="col-span-12">
        <CardComponent
          :loading="Loading"
          title="Aniversariantes"
          :icon="Calendar"
        >
          <div
            class="flex flex-col justify-center items-start gap-2 h-full mt-2"
          >
            <div
              v-if="
                !dashboardData?.birthdays?.aniversariantes_do_dia ||
                dashboardData?.birthdays?.aniversariantes_do_dia?.length < 1
              "
              class="text-gray-400"
            >
              Nenhum aniversariante hoje.
            </div>
            <div
              v-else
              class="grid grid-cols-1 sm:grid-cols-3 w-full gap-2 max-h-[20vw] overflow-y-auto"
            >
              <div
                v-for="(aniversariante, index) in dashboardData?.birthdays
                  ?.aniversariantes_do_dia"
                :key="index"
                class="w-full border border-gray-200 py-4 col-span-1 rounded-lg px-4 mb-2 flex justify-between items-center"
              >
                <div class="flex justify-start items-center">
                  <span
                    class="mr-2 rounded-full overflow-hidden bg-gradient-to-tl from-blue-700 to-blue-400 text-white w-8 h-8 flex justify-center items-center"
                    v-tooltip="aniversariante.tipo"
                  >
                    <i
                      :class="
                        aniversariante.tipo === 'Usuário'
                          ? 'pi pi-user'
                          : 'pi pi-briefcase'
                      "
                      style="stroke-width: 2.4px"
                    ></i>
                  </span>
                  <div>
                    <p class="font-semibold text-gray-700">
                      {{ aniversariante.nome_completo }}
                    </p>
                    <cite class="text-sm text-gray-400">
                      {{ dayjs().diff(aniversariante.data_nascimento, "year") }}
                      anos
                    </cite>
                  </div>
                </div>
                <i class="pi pi-gift text-blue-700 mr-4"></i>
              </div>
            </div>
          </div>
        </CardComponent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { Bot, Calendar, Clock, Users } from "lucide-vue-next";
import { Button, ButtonGroup } from "primevue";
import Chart from "primevue/chart";
import { nextTick, onMounted, ref } from "vue";
import CardComponent from "../../../components/Card/CardComponent.vue";
import { DashboardServices } from "../../../services/dashboard/DashboardServices";
import { useUserStore } from "../../../stores/user";
import WaitListWrapper from "../clinicas/agenda/WaitList.Wrapper.vue";

const userStore = useUserStore();
const viewMode = ref<"ADM" | "CLINIC">("CLINIC");
const dateAndHour = ref<string[]>([]);
const dateFilter = ref<Date | null>(new Date());
const Loading = ref(false);
const dashboardData = ref<any>(null);
const staticFilters = ref<any>({
  scheduleChart: "day",
});
const pieChartData = ref<any>({
  labels: [],
  datasets: [],
});
const hours = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

function changeChartView(view: "day" | "month") {
  staticFilters.value.scheduleChart = view;
  // rebuild chart based on loaded dashboardData
  updatePieChart();
}

interface appointmentDetail {
  horario_inicio: string;
  horario_fim: string;
  status: string;
  nome_medico: string;
  nome_paciente: string;
}
function getAppointmentDetail(hour: string): appointmentDetail | undefined {
  return dashboardData.value?.daySchedulesList?.find(
    (item: any) => item.horario_inicio.split("T")[1].slice(0, 5) === hour
  );
}

function calculateTime(aiMidTime = 0, messagesCount = 0) {
  const humanMidTime = 30000;
  if (aiMidTime === 0 || messagesCount === 0) return "0h";
  const totalAI = (aiMidTime / 1000) * messagesCount;
  const totalHuman = (humanMidTime / 1000) * messagesCount;
  console.log(Math.round(totalAI - totalHuman));
  const diff = Math.round(totalAI - totalHuman) * -1;

  return `${diff / 60}h`;
}

function extractStatusCounts(obj: any) {
  // Try several common keys to be resilient to API shape
  return (
    obj?.status_counts || obj?.statusCounts || obj?.status_count || obj || {}
  );
}

function updatePieChart() {
  const mode = staticFilters.value.scheduleChart;
  if (!dashboardData.value) {
    pieChartData.value = { labels: [], datasets: [] };
    return;
  }

  const source =
    mode === "day"
      ? dashboardData.value.daySchedule
      : dashboardData.value.monthSchedule;
  const counts = extractStatusCounts(source);

  //   if (!counts || Object.keys(counts).length === 0) {
  //     pieChartData.value = { labels: [], datasets: [] };
  //     return;
  //   }

  const labels = Object.keys(counts);
  const data = Object.values(counts).map((v: any) => Number(v) || 0);

  const backgroundColor = labels.map((l: any) => statusColor(l));

  pieChartData.value = {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
      },
    ],
  };
}

function statusColor(status: any) {
  const s = String(status || "")
    .toUpperCase()
    .trim();
  switch (s) {
    case "CONFIRMADO":
      return "#4caf50";
    case "ATIVO":
      return "#ff9800";
    case "CANCELADO":
      return "#f44336";
    case "CONCLUIDO":
      return "#2196f3";
    case "OCUPADO":
      return "#4CAF50";
    default:
      return "#9CA3AF"; // fallback gray
  }
}

async function fetchData() {
  try {
    Loading.value = true;
    const [
      daySchedule,
      monthSchedule,
      dayAI,
      monthAI,
      birthdays,
      daySchedulesList,
    ] = await Promise.all([
      DashboardServices.getDaySchedule(),
      DashboardServices.getMonthSchedule(),
      DashboardServices.getDayAI(),
      DashboardServices.getMonthAI(),
      DashboardServices.getBirthdays(),
      DashboardServices.getDaySchedulesList({
        data: dayjs(dateFilter.value)?.format("YYYY-MM-DD") || "",
      }),
    ]);

    dashboardData.value = {
      daySchedule: daySchedule?.data?.data,
      monthSchedule: monthSchedule?.data?.data,
      dayAI: dayAI?.data?.data,
      monthAI: monthAI?.data?.data,
      birthdays: birthdays?.data?.data,
      daySchedulesList: daySchedulesList?.data?.data,
    };
    // build initial chart data
    updatePieChart();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Handle error as needed
  } finally {
    await nextTick();
    Loading.value = false;
  }
}

onMounted(() => {
  dateAndHour.value = [
    new Date().toLocaleDateString("pt-BR", { dateStyle: "short" }),
    new Date().toLocaleTimeString("pt-BR", { timeStyle: "short" }),
  ];
  const userRole = userStore.getData().Role;
  if (userRole === "ADM") {
    viewMode.value = "ADM";
    return;
  }

  viewMode.value = "CLINIC";
  fetchData();
});
</script>
