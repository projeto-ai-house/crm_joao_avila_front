<template>
  <div class="left">
    <DayPilotNavigator id="nav" :config="navigatorConfig" ref="navigator" />
  </div>
  <div class="agenda-view">
    <DayPilotCalendar ref="calendar" :config="calendarConfig" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-vue";

const calendar = ref<DayPilotCalendar | null>(null);

const calendarConfig = {
  viewType: "Week",
  startDate: new DayPilot.Date("2023-08-01"),
  selectionDay: new DayPilot.Date("2023-08-01"),
  timeRangeSelectedHandling: "Enabled",
  onTimeRangeSelected: (args) => {
    console.log("Time range selected:", args);
    calendar.value?.startDate(args.day);
  },
  eventDeleteHandling: "Update",
  eventDeleteConfirm: false,
  events: [],
};
const navigatorConfig = {
  showMonths: 3,
  skipMonths: 3,
  selectMode: "Day",
  startDate: "2023-08-01",
  selectionDay: "2023-08-01",
  onTimeRangeSelected: (args) => {
    calendarConfig.startDate = args.day;
  },
};
// Reactive variables
const startDate = ref(new Date());
const events = ref([]);
const view = ref("Week");

// Methods
const onTimeRangeSelected = (args: any) => {
  console.log("Time range selected:", args);
};

const setDayView = (calendar: any) => {
  console.log("Day view set:", calendar);
};

events.value = [
  {
    id: 1,
    text: "Event 1",
    start: DayPilot.Date.today().addHours(9),
    end: DayPilot.Date.today().addHours(11),
  },
  {
    id: 2,
    text: "Event 2",
    start: DayPilot.Date.today().addHours(10),
    end: DayPilot.Date.today().addHours(12),
    backColor: "#93c47d",
    borderColor: "darker",
  },
  {
    id: 9,
    text: "Event 9",
    start: DayPilot.Date.today().addHours(13),
    end: DayPilot.Date.today().addHours(15),
    backColor: "#76a5af", // Teal background
    borderColor: "darker",
  },
  {
    id: 3,
    text: "Event 3",
    start: DayPilot.Date.today().addDays(1).addHours(9),
    end: DayPilot.Date.today().addDays(1).addHours(11),
    backColor: "#ffd966", // Yellow background
    borderColor: "darker",
  },
  {
    id: 4,
    text: "Event 4",
    start: DayPilot.Date.today().addDays(1).addHours(11).addMinutes(30),
    end: DayPilot.Date.today().addDays(1).addHours(13).addMinutes(30),
    backColor: "#f6b26b", // Orange background
    borderColor: "darker",
  },

  {
    id: 7,
    text: "Event 7",
    start: DayPilot.Date.today().addDays(1).addHours(14),
    end: DayPilot.Date.today().addDays(1).addHours(16),
    backColor: "#e691b8", // Pink background
    borderColor: "darker",
  },
  {
    id: 5,
    text: "Event 5",
    start: DayPilot.Date.today().addDays(4).addHours(9),
    end: DayPilot.Date.today().addDays(4).addHours(11),
    backColor: "#8e7cc3", // Purple background
    borderColor: "darker",
  },
  {
    id: 6,
    text: "Event 6",
    start: DayPilot.Date.today().addDays(4).addHours(13),
    end: DayPilot.Date.today().addDays(4).addHours(15),
    backColor: "#6fa8dc", // Light Blue background
    borderColor: "darker",
  },

  {
    id: 8,
    text: "Event 8",
    start: DayPilot.Date.today().addDays(5).addHours(13),
    end: DayPilot.Date.today().addDays(5).addHours(15),
    backColor: "#b6d7a8", // Light Green background
    borderColor: "darker",
  },
  // ...
];
</script>
