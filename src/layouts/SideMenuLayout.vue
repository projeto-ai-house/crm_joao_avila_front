<template>
  <div class="w-full h-full flex flex-col items-start justify-start">
    <div
      class="hidden items-center gap-2 md:flex w-full py-3 px-4 rounded-md shadow-lg relative border border-white bg-white overflow-hidden"
    >
      <div
        class="bg-gradient-to-tr from-blue-400 via-white to-pink-300 blur-md opacity-80 absolute top-0 left-0 w-full h-full rounded-lg z-0"
      ></div>
      <img
        src="@/assets/images/logo.png"
        alt="Mednova Logo"
        class="w-10 h-10 drop-shadow-2xl drop-shadow-gray-800/20 z-10"
      />
      <h1 class="text-xl !font-secondary z-10">Mednova</h1>
    </div>
    <div class="flex flex-col justify-center w-full p-4">
      <div class="w-full" v-for="(item, index) in items">
        <h4
          class="text-xs font-semibold text-gray-500/80 mt-4 mb-2"
          v-if="item?.placeholder"
        >
          <span
            class="h-[1px] w-full bg-gray-200 rounded-full block my-4"
            v-if="index !== 0"
          ></span>
          {{ item?.placeholder?.toUpperCase() }}
        </h4>
        <div class="flex flex-col w-full" v-else>
          <Button
            :href="item.to"
            size="small"
            :label="item.label as string"
            :severity="
              PAGENAME?.toUpperCase() === item.pageName
                ? 'primary'
                : 'secondary'
            "
            :icon="item.icon as string"
            :variant="PAGENAME?.toUpperCase() === item.pageName ? '' : 'text'"
            @click="
              () => {
                if (item.to) {
                  router.push(item.to);
                }
              }
            "
            class=""
            :class="{
              '!border !border-gray-100': PAGENAME?.toUpperCase() === item.pageName,
            }"
            :badge="item.badge"
            badge-class="!ml-auto !rounded-sm"
            badge-severity="primary"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import PanelMenu from "primevue/panelmenu";
import { Button, useToast } from "primevue";
import { MenuItemCommandEvent } from "primevue/menuitem";
import { useUserStore } from "../stores/user";
import { AuthenticationUtils } from "../utils/AuthenticationUtils";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const toast = useToast();

const userData = ref(userStore.getData());
const PAGENAME = ref<string | undefined>("");

interface MenuItem {
  label?: string;
  pageName?: string;
  icon?: string;
  to?: string;
  badge?: string;
  placeholder?: string;
}

const items = ref<MenuItem[]>([
  {
    placeholder: "Administração",
  },
  {
    label: "Dashboard",
    pageName: "DASHBOARD",
    icon: "pi pi-th-large",
    to: "/painel/dashboard",
  },
  {
    label: "Clinicas",
    pageName: "CLINICAS",
    icon: "pi pi-building",
    to: "/painel/clinicas",
  },
  {
    label: "Médicos",
    pageName: "MEDICOS",
    icon: "pi pi-user",
    to: "/painel/medicos",
  },
  {
    label: "Convênios",
    pageName: "CONVENIOS",
    icon: "pi pi-credit-card",
    to: "/painel/convenios",
  },
  {
    placeholder: "Clinica",
  },
  {
    label: "Agenda",
    pageName: "AGENDA",
    icon: "pi pi-calendar",
    to: "/painel/clinica/agenda",
    badge: (userData.value?.clinica?.agenda?.length || 1).toString(),
  },
  {
    label: "Pacientes",
    pageName: "PACIENTES",
    icon: "pi pi-users",
    to: "/painel/clinica/pacientes",
  },
  {
    label: "Consultas",
    pageName: "CONSULTAS",
    icon: "pi pi-clipboard",
    to: "/painel/clinica/consultas",
  },
  {
    placeholder: "Financeiro",
  },
  {
    label: "Faturamento",
    pageName: "FATURAMENTO",
    icon: "pi pi-dollar",
    to: "/painel/financeiro/faturamento",
  },
  {
    label: "Contas a Pagar",
    pageName: "CONTAS_A_PAGAR",
    icon: "pi pi-money-bill",
    to: "/painel/financeiro/contas-a-pagar",
  },
]);

function handleSelectedPage() {
  let page = router.currentRoute.value?.name as string | undefined;
  if (page === "PainelNotFound")
    page = router.currentRoute.value?.path.split("/").pop() as
      | string
      | undefined;
  if (page) PAGENAME.value = page;
  else PAGENAME.value = "Home";
}

onMounted(() => {
  handleSelectedPage();
});

watch(
  () => router.currentRoute.value.fullPath,
  () => {
    handleSelectedPage();
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.p-button {
  justify-content: flex-start;
}
.p-button-primary {
  background-color: #fff !important;
  border: none;
  color: #444444 !important;
  box-shadow: 1px 2px 10px 1px #00000015 !important;
  margin-bottom: 0.2rem !important;
  z-index: 100;
}
</style>
