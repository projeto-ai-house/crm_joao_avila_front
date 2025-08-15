<template>
  <!-- BEGIN: TopBar -->
  <div class="flex justify-between items-center pl-1 py-4 bg-white">
    <div>
      <h2 class="font-semibold text-gray-500">Lista de Cargos</h2>
      <p class="text-sm text-gray-400">
        Gerencie os cargos e permissões dos usuários do sistema.
      </p>
    </div>
    <!-- <Button
      label="Adicionar"
      icon="pi pi-plus"
      severity="primary"
      size="small"
      @click="
        inEdition = null;
        dialogState = true;
      "
      :disabled="!permissionsUserPage.editar"
    ></Button> -->
  </div>
  <!-- END: TopBar -->

  <!-- BEGIN: Table -->
  <div class="border border-gray-200/70 rounded-lg overflow-hidden">
    <DataTable
      :value="users"
      v-model:expandedRows="expandedRows"
      stripedRows
      tableStyle="min-width: 50rem"
      :rows="rows"
      v-model:selection="selectedUsers"
      dataKey="ID"
      size="small"
      :loading="loading"
    >
      <template #empty> Nenhum usuário encontrada. </template>
      <template #loading> Carregando usuários... </template>

      <Column field="Nome" header="Nome" :style="{ width: 'max-content' }">
        <template #body="slotProps">
          <span class="font-semibold text-gray-600">{{
            slotProps.data.Nome
          }}</span>
        </template>
        >
      </Column>
      <Column field="Seleções" header="Seleções" :style="{ width: '8rem' }">
        <template #body="slotProps">
          <Badge
            :value="slotProps.data.Permissoes?.length"
            :severity="stockSeverity(slotProps.data.Permissoes?.length)"
        /></template>
      </Column>

      <Column
        headerStyle="width:4rem"
        align-frozen="right"
        header-class="w-fit"
      >
        <template #body="slotProps">
          <Button
            class="w-fit"
            icon="pi pi-pencil"
            label="Editar"
            severity="secondary"
            size="small"
            variant="text"
            :disabled="!permissionsUserPage.editar && false"
            @click="
              inEdition = slotProps.data;
              isEditionPermissionsList = slotProps.data.Permissoes || [];
              dialogState = true;
            "
          />
        </template>
      </Column>
    </DataTable>
  </div>
  <!-- END: Table -->
  <RoleDialogComponent
    :dialogState="dialogState"
    :inEdition="inEdition"
    :permissionsList="isEditionPermissionsList"
    @update:dialogState="dialogState = $event"
    @saveUser="fetchRoles"
  />
</template>

<script setup lang="ts">
import { Badge, Button } from "primevue";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { RolesServices } from "../../../../services/roles/RolesServices";
import { useUserStore } from "../../../../stores/user";
import { PermissionsUtils } from "../../../../utils/PermissionsUtils";
import RoleDialogComponent from "./RoleDialogComponent.vue";

const loading = ref(false);
const dialogState = ref(false);
const inEdition = ref(null);
const isEditionPermissionsList = ref([]);
const selectedUsers = ref([]);
const expandedRows = ref({});
const users = ref([]);
const userStore = useUserStore();
const router = useRouter();
const permissionsUserPage = ref(
  PermissionsUtils.checkMethodPemission(router.currentRoute.value.fullPath)
);

const rows = 20;

function stockSeverity(quantity: number): string {
  // console.log("quantity", quantity);

  if (quantity === 0) return "danger";
  else if (quantity > 6 && quantity < 12) return "warn";
  else return "success";
}

async function fetchRoles() {
  const userRole = userStore.user?.Role;
  try {
    loading.value = true;
    const response = await RolesServices.getRoles({ id: userStore.user?.ID });
    if (response.status === 200) {
      // console.log("response.data", response.data);

      users.value = response.data?.data
        ?.filter((role) => role.Nome !== userRole)
        .sort((a: { Hierarquia: number }, b: { Hierarquia: number }) => {
          return b.Hierarquia - a.Hierarquia;
        });
    }
  } catch (error) {
    console.error("Error fetching clinics:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchRoles();
});
</script>

<style>
.p-overlay-mask {
  background-color: #437efd11 !important;
  backdrop-filter: blur(5px);
  color: #4c71c0;
  font-weight: 600;
}
</style>
