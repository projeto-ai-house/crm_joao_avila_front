<template>
  <div class="p-2">
    <!-- Top -->
    <div class="flex items-center justify-between mb-4 flex-wrap gap-4">
      <div>
        <h2 class="font-semibold text-gray-500">Dashboard da Administração</h2>
        <p class="text-sm text-gray-400">
          Visão geral das atividades recentes e status do sistema.
        </p>
      </div>
      <div class="flex items-center gap-4">
        <div class="sm:text-right">
          <div class="text-xs text-gray-400">Crescimento clínicas</div>
          <div class="font-bold text-lg text-green-600">
            {{
              dashboardData?.crescimento_clinicas_percent?.toFixed(2)
                ? dashboardData?.crescimento_clinicas_percent?.toFixed(2) + "%"
                : "-"
            }}
          </div>
        </div>
      </div>
    </div>

    <!-- Resumo rápido -->
    <div class="grid grid-cols-12 gap-4 mb-4">
      <!-- Card compacto: Clínicas -->
      <div class="col-span-12 sm:col-span-4">
        <CardComponent title="Clínicas" :loading="Loading" :icon="TrendingUp">
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <div class="text-xs text-gray-400">Total de clínicas</div>
              <div class="text-xl font-bold text-gray-800">
                {{
                  dashboardData?.estatisticas_do_sistema
                    ?.total_clinicas_system ?? "-"
                }}
              </div>
              <div class="mt-1">
                <span
                  class="inline-flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded"
                >
                  <i class="pi pi-arrow-up mr-1" style="font-size: 0.75rem"></i>
                  {{
                    Math.round(
                      dashboardData?.crescimento_clinicas_percent ?? 0
                    )
                  }}%
                </span>
                <span class="ml-2 text-xs text-gray-400"> crescimento </span>
              </div>
            </div>
          </div>
        </CardComponent>
      </div>

      <!-- Card compacto: Pacientes -->
      <div class="col-span-12 sm:col-span-4">
        <CardComponent title="Pacientes" :loading="Loading" :icon="Users">
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <div class="text-xs text-gray-400">Total de pacientes</div>
              <div class="text-xl font-bold text-gray-800">
                {{
                  dashboardData?.estatisticas_do_sistema
                    ?.total_pacientes_system ?? "-"
                }}
              </div>
              <div class="mt-1">
                <span
                  class="inline-flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded"
                >
                  <i class="pi pi-arrow-up mr-1" style="font-size: 0.75rem"></i>
                  {{
                    Math.round(
                      dashboardData?.estatisticas_do_sistema
                        ?.crescimento_pacientes_system_percent ?? 0
                    )
                  }}%
                </span>
                <span class="ml-2 text-xs text-gray-400"> crescimento </span>
              </div>
            </div>
          </div>
        </CardComponent>
      </div>

      <!-- Card compacto: Agendamentos -->
      <div class="col-span-12 sm:col-span-4">
        <CardComponent title="Agendamentos" :loading="Loading" :icon="Calendar">
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <div class="text-xs text-gray-400">Total de agendamentos</div>
              <div class="text-xl font-bold text-gray-800">
                {{
                  dashboardData?.estatisticas_do_sistema
                    ?.total_agendamentos_system ?? "-"
                }}
              </div>
              <div class="mt-1">
                <span
                  class="inline-flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded"
                >
                  <i class="pi pi-arrow-up mr-1" style="font-size: 0.75rem"></i>
                  {{
                    Math.round(
                      dashboardData?.estatisticas_do_sistema
                        ?.crescimento_agendamentos_system_percent ?? 0
                    )
                  }}%
                </span>
                <span class="ml-2 text-xs text-gray-400">crescimento</span>
              </div>
            </div>
          </div>
        </CardComponent>
      </div>
    </div>

    <!-- Panel -->
    <div class="w-full h-full grid grid-cols-12 gap-4">
      <div
        class="col-span-3"
        v-if="
          (staticFilters.scheduleChart === 'day'
            ? dashboardData?.dayAI?.agendamentos?.agendamentos_por_ia
            : dashboardData?.monthAI?.agendamentos?.agendamentos_por_ia) > 0
        "
      >
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
              Agendamentos gerados pela assistente (IA)
            </cite>
          </div>
        </CardComponent>
      </div>

      <!-- Tempo Economizado (exibir apenas se houver dados reais) -->
      <!-- <div
        class="col-span-3"
        v-if="
          (staticFilters.scheduleChart === 'day'
            ? dashboardData?.dayAI?.resposta?.total_mensagens
            : dashboardData?.monthAI?.resposta?.total_mensagens) > 0
        "
      >
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
            <cite class="text-sm text-gray-400"
              >Estimativa de horas economizadas pela IA</cite
            >
          </div>
        </CardComponent>
      </div> -->

      <!-- GRAFICO Pacientes Hoje -->
      <div class="col-span-12 sm:col-span-3">
        <CardComponent
          :loading="Loading"
          :title="`Pacientes por Clínica`"
          :icon="Users"
        >
          <div class="flex flex-col justify-center items-center gap-4 p-4 pt-8">
            <!-- <div class="w-full h-48 relative overflow-hidden"> -->
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
              class="max-h-full max-w-full h-fit"
              :options="{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }"
            />
            <!-- </div> -->
          </div>
        </CardComponent>
      </div>

      <!-- Grafico Agendamentos por Clinica -->
      <div class="col-span-12 sm:col-span-9">
        <CardComponent
          :loading="Loading"
          title="Agendamentos por Clínica"
          :icon="TrendingUp"
        >
          <div class="w-full h-full pt-4">
            <Chart
              type="bar"
              :data="barChartData"
              :options="barChartOptions"
              class="w-full h-full"
            />
          </div>
        </CardComponent>
      </div>

      <!-- Horarios Hoje -->
      <!-- Indicadores agregados (abaixo dos gráficos) -->
      <div class="col-span-12">
        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-6 sm:col-span-3">
            <CardComponent :loading="Loading" title="" :icon="ClipboardPlus">
              <div class="text-xs text-gray-400">Clínicas com agendamentos</div>
              <div class="text-2xl font-bold text-gray-800">
                {{ clinicsWithAppointments }}
                <span class="text-sm text-gray-500 font-normal">
                  de {{ clinicStats.length }}
                </span>
              </div>
            </CardComponent>
          </div>
          <div class="col-span-6 sm:col-span-3">
            <CardComponent :loading="Loading" title="" :icon="Users">
              <div class="text-xs text-gray-400">Total de pacientes (soma)</div>
              <div class="text-2xl font-bold text-gray-800">
                {{ formatNumber(totalPacientesAll) }}
              </div>
            </CardComponent>
          </div>
          <div class="col-span-6 sm:col-span-3">
            <CardComponent :loading="Loading" title="" :icon="Tally5">
              <div class="text-xs text-gray-400">
                Total de agendamentos (soma)
              </div>
              <div class="text-2xl font-bold text-gray-800">
                {{ formatNumber(totalAgendamentosAll) }}
              </div>
            </CardComponent>
          </div>
          <div class="col-span-6 sm:col-span-3">
            <CardComponent
              :loading="Loading"
              title=""
              :icon="ChartNoAxesCombined"
            >
              <div class="text-xs text-gray-400">
                Crescimento médio agendamentos
              </div>
              <div class="text-2xl font-bold text-gray-800">
                {{ Math.round(avgCrescimentoAgendamentos) }}%
              </div>
            </CardComponent>
          </div>
        </div>
      </div>

      <!-- Tabela local de clínicas (colunas numéricas) -->
      <div class="col-span-12">
        <CardComponent
          :loading="Loading"
          title="Clínicas - Detalhes numéricos"
          :icon="Logs"
        >
          <div class="rounded-lg overflow-hidden">
            <DataTable :value="pagedClinics" size="small" class="text-sm">
              <!-- <Column header="ID" style="width: 220px">
                <template #body="slotProps">
                  <div class="truncate-cell" :title="slotProps.data.id">
                    {{ slotProps.data.id }}
                  </div>
                </template>
              </Column> -->
              <Column header="Nome">
                <template #body="slotProps">
                  <div class="truncate-cell" :title="slotProps.data.nome">
                    {{ slotProps.data.nome }}
                  </div>
                </template>
              </Column>
              <Column header="Pacientes">
                <template #body="slotProps">{{
                  formatNumber(slotProps.data.total_pacientes || 0)
                }}</template>
              </Column>
              <Column header="Agendamentos">
                <template #body="slotProps">{{
                  formatNumber(slotProps.data.total_agendamentos || 0)
                }}</template>
              </Column>
              <Column header="Cres. Pacientes (%)">
                <template #body="slotProps">
                  <span
                    :class="
                      (slotProps.data.crescimento_pacientes_percent ?? 0) > 0
                        ? 'text-green-600 font-semibold'
                        : (slotProps.data.crescimento_pacientes_percent ?? 0) <
                          0
                        ? 'text-red-600 font-semibold'
                        : 'text-gray-400'
                    "
                  >
                    {{
                      Math.round(
                        slotProps.data.crescimento_pacientes_percent || 0
                      )
                    }}%
                  </span>
                </template>
              </Column>
              <Column header="Cres. Agendamentos (%)">
                <template #body="slotProps">
                  <span
                    :class="
                      (slotProps.data.crescimento_agendamentos_percent ?? 0) > 0
                        ? 'text-green-600 font-semibold'
                        : (slotProps.data.crescimento_agendamentos_percent ??
                            0) < 0
                        ? 'text-red-600 font-semibold'
                        : 'text-gray-400'
                    "
                  >
                    {{
                      Math.round(
                        slotProps.data.crescimento_agendamentos_percent || 0
                      )
                    }}%
                  </span>
                </template>
              </Column>
            </DataTable>
            <div class="p-2 bg-white">
              <Paginator
                :rows="clinicRows"
                :totalRecords="clinicStats.length"
                :first="clinicFirst"
                @page="onClinicPage"
              />
            </div>
          </div>
        </CardComponent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Bot,
  Calendar,
  ChartNoAxesCombined,
  ClipboardPlus,
  Logs,
  Tally5,
  TrendingUp,
  Users,
} from "lucide-vue-next";
import { Column, DataTable, Paginator } from "primevue";
import Chart from "primevue/chart";
import { computed, nextTick, onMounted, ref } from "vue";
import CardComponent from "../../../components/Card/CardComponent.vue";
import { DashboardServices } from "../../../services/dashboard/DashboardServices";
import { useUserStore } from "../../../stores/user";

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
const barChartData = ref<any>({
  labels: [],
  datasets: [],
});

const barChartOptions = ref<any>({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: { color: "#6b7280" },
    },
    y: {
      beginAtZero: true,
      ticks: { color: "#6b7280" },
    },
  },
  plugins: {
    legend: { display: false },
  },
});

const clinicRows = ref(10);
const clinicFirst = ref(0);
const clinicPage = ref(1);

function onClinicPage(event: any) {
  clinicFirst.value = event.first;
  clinicPage.value = event.page + 1;
}

function formatNumber(v: number) {
  return new Intl.NumberFormat("pt-BR").format(v ?? 0);
}

const clinicStats = computed(
  () => dashboardData.value?.estatisticas_por_clinica || []
);

const totalPacientesAll = computed(() =>
  clinicStats.value.reduce(
    (s: number, c: any) => s + (c.total_pacientes || 0),
    0
  )
);
const totalAgendamentosAll = computed(() =>
  clinicStats.value.reduce(
    (s: number, c: any) => s + (c.total_agendamentos || 0),
    0
  )
);
const avgCrescimentoPacientes = computed(() => {
  if (!clinicStats.value.length) return 0;
  return (
    clinicStats.value.reduce(
      (s: number, c: any) => s + (c.crescimento_pacientes_percent || 0),
      0
    ) / clinicStats.value.length
  );
});
const avgCrescimentoAgendamentos = computed(() => {
  if (!clinicStats.value.length) return 0;
  return (
    clinicStats.value.reduce(
      (s: number, c: any) => s + (c.crescimento_agendamentos_percent || 0),
      0
    ) / clinicStats.value.length
  );
});

const clinicsWithAppointments = computed(
  () =>
    clinicStats.value.filter((c: any) => (c.total_agendamentos || 0) > 0).length
);

const pagedClinics = computed(() => {
  const start = clinicFirst.value || 0;
  const end = start + (clinicRows.value || 6);
  return clinicStats.value.slice(start, end);
});

function calculateTime(aiMidTime = 0, messagesCount = 0) {
  const humanMidTime = 30000;
  if (aiMidTime === 0 || messagesCount === 0) return "0h";
  const totalAI = (aiMidTime / 1000) * messagesCount;
  const totalHuman = (humanMidTime / 1000) * messagesCount;
  // console.log(Math.round(totalAI - totalHuman));
  const diff = Math.round(totalAI - totalHuman) * -1;

  return `${diff / 60}h`;
}

async function fetchData() {
  try {
    Loading.value = true;
    const response = await DashboardServices.getAdminDashboard();
    // console.log(response.data);

    dashboardData.value = response.data?.data;

    // console.log(dashboardData.value);
    // build charts
    updateCharts();
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
  fetchData();
});

function updateCharts() {
  const stats = dashboardData.value;
  if (!stats) return;

  // Pie chart: agendamentos por clínica (top 6)
  const labels = (stats.estatisticas_por_clinica || []).map(
    (c: any) => c.nome || "—"
  );
  const values = (stats.estatisticas_por_clinica || []).map(
    (c: any) => c.total_pacientes || 0
  );

  // limit labels to top 8 by value
  const pairs = labels.map((l: string, i: number) => ({
    label: l,
    value: values[i],
  }));
  pairs.sort((a: any, b: any) => b.value - a.value);
  const top = pairs.slice(0, 8);

  pieChartData.value = {
    labels: top.map((p: any) => p.label),
    datasets: [
      {
        data: top.map((p: any) => p.value),
        backgroundColor: [
          "#3B82F6",
          "#06B6D4",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#F472B6",
          "#A3E635",
        ],
        hoverOffset: 6,
      },
    ],
  };

  // Bar chart: agendamentos por clinica (all, but capped label length)
  barChartData.value = {
    labels: (stats.estatisticas_por_clinica || []).map((c: any) =>
      (c.nome || "—").slice(0, 18)
    ),
    datasets: [
      {
        label: "Agendamentos",
        data: (stats.estatisticas_por_clinica || []).map(
          (c: any) => c.total_agendamentos || 0
        ),
        backgroundColor: "#3B82F6",
      },
    ],
  };
}
</script>
