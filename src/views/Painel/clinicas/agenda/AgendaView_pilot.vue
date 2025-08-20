<template>
  <div class="agenda-pilot">
    <div class="controls">
      <select v-model="viewType" @change="onViewChange">
        <option value="Day">Dia</option>
        <option value="Week">Semana</option>
        <option value="Month">Mês</option>
      </select>
      <button @click="goToday">Hoje</button>
      <button @click="prev">‹</button>
      <button @click="next">›</button>
    </div>

    <div class="calendar-container">
      <DayPilotCalendar :config="config" :events="events" ref="calendarRef" />
    </div>

    <div class="events-list">
      <h4>Eventos</h4>
      <ul>
        <li v-for="ev in events" :key="ev.id">
          {{ ev.text }} — {{ ev.start }} → {{ ev.end }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-vue";
import { onMounted, ref, watch } from "vue";

const calendarRef = ref(null);
const viewType = ref("Week");
const events = ref([
  {
    id: 1,
    start: DayPilot.Date.today().addHours(9).toString(),
    end: DayPilot.Date.today().addHours(10).toString(),
    text: "Consulta A",
  },
  {
    id: 2,
    start: DayPilot.Date.today().addDays(1).addHours(14).toString(),
    end: DayPilot.Date.today().addDays(1).addHours(15).toString(),
    text: "Consulta B",
  },
]);

const config = ref({
  viewType: viewType.value,
  startDate: DayPilot.Date.today(),
  // allow selecting time ranges to create events
  onTimeRangeSelected: async (args) => {
    const modal = await DayPilot.Modal.prompt("Criar evento:", "Novo evento");
    args.control.clearSelection();
    if (modal.canceled) return;
    events.value.push({
      id: DayPilot.guid(),
      start: args.start,
      end: args.end,
      text: modal.result,
    });
  },
  onEventMoved: (args) => {
    // optional: show message
    args.control.message("Evento movido: " + args.e.text());
  },
  onEventResized: (args) => args.control.message("Evento redimensionado"),
});

function updateConfigView() {
  config.value = { ...config.value, viewType: viewType.value };
}

function onViewChange() {
  updateConfigView();
}

function goToday() {
  const cal = calendarRef.value?.control;
  if (cal) cal.update({ startDate: DayPilot.Date.today() });
}

function prev() {
  const cal = calendarRef.value?.control;
  if (!cal) return;
  if (viewType.value === "Day")
    cal.startDate = DayPilot.Date.parse(cal.startDate).addDays(-1);
  else if (viewType.value === "Week")
    cal.startDate = DayPilot.Date.parse(cal.startDate).addDays(-7);
  else if (viewType.value === "Month")
    cal.startDate = DayPilot.Date.parse(cal.startDate).addMonths(-1);
  cal.update();
}

function next() {
  const cal = calendarRef.value?.control;
  if (!cal) return;
  if (viewType.value === "Day")
    cal.startDate = DayPilot.Date.parse(cal.startDate).addDays(1);
  else if (viewType.value === "Week")
    cal.startDate = DayPilot.Date.parse(cal.startDate).addDays(7);
  else if (viewType.value === "Month")
    cal.startDate = DayPilot.Date.parse(cal.startDate).addMonths(1);
  cal.update();
}

onMounted(() => {
  // ensure config viewType is in sync on mount
  updateConfigView();
});

// keep config updated if viewType changes
watch(viewType, () => updateConfigView());

// expose for template
const calendar = calendarRef;

// ...existing code...
</script>

<style scoped>
.agenda-pilot {
  padding: 16px;
}
.controls {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}
.calendar-container {
  border: 1px solid #e5e7eb;
  padding: 8px;
}
.events-list {
  margin-top: 12px;
}
</style>
