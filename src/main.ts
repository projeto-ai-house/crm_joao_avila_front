import { createApp } from "vue";
import PrimeVue from "primevue/config";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import ToastService from "primevue/toastservice";
import App from "./App.vue";
import { router } from "./routes";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{green.50}",
      100: "{green.100}",
      200: "{green.200}",
      300: "{green.300}",
      400: "{green.400}",
      500: "{green.500}", // cor principal
      600: "{green.600}",
      700: "{green.700}",
      800: "{green.800}",
      900: "{green.900}",
      950: "{green.950}",
    },
  },
});

const app = createApp(App);
app.use(PrimeVue, {
  locale: {
    accept: "Sim",
    reject: "Cancelar",
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
app.use(router);
app.use(ToastService);
app.mount("#app");
