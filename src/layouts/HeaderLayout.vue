<template>
  <div class="card w-full">
    <Toolbar
      style="padding: 1rem 1rem 1rem 1.5rem"
      class="!rounded-none !border-t-0 !border-l-0 !border-r-0 border-gray-200"
    >
      <template #start>
        <div class="flex items-center gap-2 md:hidden">
          <img
            src="@/assets/images/logo.png"
            alt="Mednova Logo"
            class="w-10 h-10 mb-1 mx-auto drop-shadow-2xl drop-shadow-gray-800/20"
          />
          <h1 class="text-xl !font-secondary">Mednova</h1>
        </div>
        <div
          class="hidden md:flex items-center gap-2 text-lg font-semibold text-gray-600"
        >
          {{ PAGENAME }}
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
          <Avatar
            class="cursor-pointer"
            :label="initials"
            @click="toggle"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            size="normal"
            shape="circle"
          />
          <Menu ref="menuRef" id="overlay_menu" :model="items" :popup="true">
            <template #start>
              <span class="inline-flex items-center gap-1 px-2 py-2">
                <span class="text-sm font-semibold px-1 pt-1">
                  {{ userData.Nome }}
                </span>
              </span>
            </template>
          </Menu>
        </div>
      </template>
    </Toolbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import { useToast } from "primevue";
import { MenuItem, MenuItemCommandEvent } from "primevue/menuitem";
import { useUserStore } from "../stores/user";
import { AuthenticationUtils } from "../utils/AuthenticationUtils";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const toast = useToast();
const menuRef = ref(null);
const items = ref<MenuItem[]>([
  // {
  //   label: "Documents",
  //   items: [
  //     {
  //       label: "New",
  //       icon: "pi pi-plus",
  //     },
  //     {
  //       label: "Search",
  //       icon: "pi pi-search",
  //     },
  //   ],
  // },
  {
    separator: true,
  },
  {
    label: "Conta",
    items: [
      {
        label: "Configurações",
        icon: "pi pi-cog",
        disabled: true,
      },
      {
        label: "Sair",
        icon: "pi pi-sign-out",
        command: (event: MenuItemCommandEvent) => {
          handleLogout();
        },
      },
    ],
  },
]);

const userData = ref(userStore.getData());
const initials = ref(generateInitials(userData.value.Nome));
const PAGENAME = ref<string | undefined>("");

function toggle(event) {
  menuRef.value.toggle(event);
  event.preventDefault();
}

function generateInitials(name: string): string {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
}

function handleLogout(): void {
  userStore.logout();
  new AuthenticationUtils().removeToken();
  router.push({ name: "Login" });
  toast.add({
    severity: "info",
    summary: "Logout",
    detail: "Você foi desconectado.",
    life: 3000,
  });
}

onMounted(() => {
  let page = router.currentRoute.value?.name as string | undefined;
  if (page === "PainelNotFound") page = "Página Não Encontrada!";
  if (page) PAGENAME.value = page;
  else PAGENAME.value = "Home";
});
</script>
