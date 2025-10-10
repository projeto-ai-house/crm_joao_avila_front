<template>
  <div class="w-full h-full flex flex-col items-start justify-start relative">
    <div
      class="hidden items-center gap-2 lg:flex w-full py-3 px-4 rounded-md shadow-lg relative border border-white bg-white overflow-hidden"
    >
      <div
        class="bg-gradient-to-tr from-blue-400 via-white to-pink-300 blur-md opacity-80 absolute top-0 left-0 w-full h-full rounded-lg z-0"
      ></div>
      <img
        src="@/assets/images/logo.png"
        alt="Mednova Logo"
        class="w-10 h-10 drop-shadow-2xl drop-shadow-gray-800/20 z-10"
      />
      <div
        class="flex flex-col items-start justify-center z-10 -space-y-1 min-w-0 flex-1"
      >
        <h1 class="text-xl !font-secondary z-10 leading-tight">Mednova</h1>
        <span
          class="text-sm font-normal text-gray-600 z-10 w-full truncate"
          v-if="CLINICNAME"
        >
          {{ CLINICNAME }}
        </span>
      </div>
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
                  emit('change:page');
                  router.push(item.to);
                }
              }
            "
            class=""
            :class="{
              '!border !border-gray-100':
                PAGENAME?.toUpperCase() === item.pageName,
            }"
            :badge="item.badge"
            badge-class="!ml-auto !rounded-sm"
            badge-severity="primary"
          />
        </div>
      </div>
    </div>
    <div class="w-full absolute bottom-0 left-0 p-4">
      <ReferralButton :userId="userData?.ID" @share="handleReferralShare" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, useToast } from "primevue";
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import ReferralButton from "../components/Referral/ReferralButton.vue";
import { useUserStore } from "../stores/user";
import { MenuUtils } from "../utils/MenuUtils";
import { PermissionsUtils } from "../utils/PermissionsUtils";

const router = useRouter();
const userStore = useUserStore();
const toast = useToast();
const emit = defineEmits(["change:page"]);
// const sseStore = useSSEStore();

const userData = ref(userStore.getData());
const PAGENAME = ref<string | undefined>("");
const CLINICNAME = ref<string | undefined>(userData.value?.Clinica[0]?.Nome);

interface MenuItem {
  label?: string;
  pageName?: string;
  icon?: string;
  to?: string;
  badge?: string;
  placeholder?: string;
}

const items = ref<MenuItem[]>([]);

// Handler para compartilhamento de indicação
const handleReferralShare = (link: string) => {
  toast.add({
    severity: "success",
    summary: "Link compartilhado!",
    detail: "O link de indicação foi compartilhado com sucesso.",
    life: 3000,
  });
};

function handleSelectedPage() {
  let page = router.currentRoute.value?.name as string | undefined;
  console.log(page);

  if (page === "PainelNotFound")
    page = router.currentRoute.value?.path.split("/").pop() as
      | string
      | undefined;
  if (page?.toUpperCase()?.includes("DASHBOARD")) PAGENAME.value = "Dashboard";
  else if (page) PAGENAME.value = page;
  else PAGENAME.value = "Home";
}

onBeforeMount(() => {
  const [role, permissions, error] = PermissionsUtils.handleUser();
  // console.log(permissions);

  if (error) {
    toast.add({
      severity: "error",
      summary: "Erro ao carregar permissões!",
      detail:
        "Não foi possível carregar as permissões do usuário. Faça login novamente.",
      life: 3000,
    });
    return;
  }
  const menuList = MenuUtils.getPermissionedMenus(
    role,
    permissions.map((p) => p.split("_")[0])
  );
  items.value = menuList;
});

onMounted(() => {
  handleSelectedPage();
  CLINICNAME.value = userData.value?.Clinica[0]?.Nome;
  // sseStore.connectSSE(token);
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
