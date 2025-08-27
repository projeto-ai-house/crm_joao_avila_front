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
        <span class="font-semibold text-gray-800">{{ dateAndHour[1] }}</span>
        <span class="font-normal text-sm">{{ dateAndHour[0] }}</span>
      </div>
    </div>

    <!-- Panel -->
    <div class="w-full h-full grid grid-cols-12 gap-4">
      <div class="col-span-3">
        <CardComponent title="Taxa de Agendamento" :icon="TrendingUp">
          <div></div>
        </CardComponent>
      </div>
      <div class="col-span-3">
        <CardComponent title="Agendamentos por IA" :icon="Bot">
          <div></div>
        </CardComponent>
      </div>
      <div class="col-span-3">
        <CardComponent title="Tempo Economizado" :icon="Clock">
          <div></div>
        </CardComponent>
      </div>
      <div class="col-span-3">
        <CardComponent title="Pacientes Hoje" :icon="Users">
          <div class="flex flex-col justify-center items-center gap-4">
            <ButtonGroup class="h-6 self-end">
              <Button
                size="small"
                label="Dia"
                :variant="
                  staticFilters.scheduleChart === 'day' ? 'filled' : 'outlined'
                "
                @click="staticFilters.scheduleChart = 'day'"
              />
              <Button
                size="small"
                label="Mês"
                :variant="
                  staticFilters.scheduleChart === 'month'
                    ? 'filled'
                    : 'outlined'
                "
                @click="staticFilters.scheduleChart = 'month'"
              />
            </ButtonGroup>
            <Chart
              type="doughnut"
              :data="
                staticFilters.scheduleChart === 'day'
                  ? dashboardData?.daySchedule
                  : dashboardData?.monthSchedule
              "
              class="w-full md:w-[30rem]"
            />
          </div>
        </CardComponent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { Bot, Clock, TrendingUp, Users } from "lucide-vue-next";
import { Button, ButtonGroup } from "primevue";
import { onMounted, ref } from "vue";
import CardComponent from "../../../components/Card/CardComponent.vue";
import { DashboardServices } from "../../../services/dashboard/DashboardServices";
import { useUserStore } from "../../../stores/user";

const userStore = useUserStore();
const viewMode = ref<"ADM" | "CLINIC">("CLINIC");
const dateAndHour = ref<string[]>([]);
const dateFilter = ref<Date | null>(new Date());
const dashboardData = ref<any>(null);
const staticFilters = ref<any>({
  scheduleChart: "day",
});

async function fetchData() {
  try {
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
      dayAI: dayAI?.data,
      monthAI: monthAI?.data,
      birthdays: birthdays?.data,
      daySchedulesList: daySchedulesList?.data,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Handle error as needed
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
