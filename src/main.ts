import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import { createPinia } from "pinia";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./routes";

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
  components: {
    image: {
      toolbar: {
        // Gradiente suave
        background:
          "linear-gradient(to top right, #FFDBF566, #ffffff66, #A8D8EF66)",
        borderColor: "#7f83c4", // Cor do contorno
      },
      action: {
        // Cor do ícone
        color: "#7f83c4",
        hoverBackground: "#7f83c466", // Cor de fundo ao passar o mouse
      },
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

document.addEventListener("DOMContentLoaded", async () => {
  app.mount("#app");
});
