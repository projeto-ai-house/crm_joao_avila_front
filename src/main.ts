import { createApp } from "vue";
import PrimeVue from "primevue/config";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import ToastService from "primevue/toastservice";
import App from "./App.vue";
import { router } from "./routes";
import { createPinia } from "pinia";
import ConfirmationService from "primevue/confirmationservice";
import Tooltip from "primevue/tooltip";
import "primeicons/primeicons.css";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{blue.50}",
      100: "{blue.100}",
      200: "{blue.200}",
      300: "{blue.300}",
      400: "{blue.400}",
      500: "{blue.500}", // cor principal
      600: "{blue.600}",
      700: "{blue.700}",
      800: "{blue.800}",
      900: "{blue.900}",
      950: "{blue.950}",
    },
  },
});

const pinia = createPinia();
export const app = createApp(App);

app.directive("tooltip", Tooltip);
app.use(PrimeVue, {
  locale: {
    accept: "Sim",
    reject: "Cancelar",
    dayNames: [
      "domingo",
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
    ],
    dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
    dayNamesMin: ["Do", "Se", "Te", "Qa", "Qi", "Sx", "Sa"],
    monthNames: [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ],
    monthNamesShort: [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ],
    today: "Hoje",
    clear: "Limpar",
    dateFormat: "dd/mm/yy",
    firstDayOfWeek: 0,
  },
  ripple: true,
  //  zIndex: {
  //   modal: 1100,
  //   overlay: 1000
  // },
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: ".app-dark",
    },
  },
});
app.use(ConfirmationService);
app.use(router);
app.use(pinia);
app.use(ToastService);

app.mount("#app");
