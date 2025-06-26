<template>
  <!-- BEGIN: TopBar -->
  <div class="flex justify-between items-center pl-1 py-4 bg-white">
    <div>
      <h2 class="font-semibold text-gray-500">Lista de Usuários</h2>
      <p class="text-sm text-gray-400">
        Gerencie os usuários do sistema, incluindo suas informações e
        permissões.
      </p>
    </div>
    <Button
      label="Adicionar"
      icon="pi pi-plus"
      severity="primary"
      size="small"
      @click="
        inEdition = null;
        drawerState = true;
      "
      :disabled="!permissionsUserPage.editar"
    ></Button>
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

      <Column field="NomeCompleto" header="Nome" sortable>
        <template #body="slotProps">
          <span class="font-semibold text-gray-600">{{
            slotProps.data.NomeCompleto
          }}</span>
        </template>
      </Column>
      <Column field="Email" header="E-mail" sortable></Column>
      <Column field="Convenio" header="Convênio" sortable></Column>
      <Column field="Cargo" header="Cargo" sortable></Column>

      <Column headerStyle="width:4rem">
        <template #body="slotProps">
          <div class="flex items-center justify-center">
            <Button
              icon="pi pi-user-edit"
              label="Editar"
              severity="secondary"
              size="small"
              variant="text"
              @click="
                inEdition = slotProps.data;
                drawerState = true;
              "
            />
            <Button
              icon="pi pi-trash"
              label="Excluir"
              severity="danger"
              size="small"
              variant="text"
              class="ml-2"
              @click="
                userInDeletion = slotProps.data.ID;
                confirmDeleteUser();
              "
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <Paginator
      :rows="rows"
      :totalRecords="totalRecords"
      :first="(currentPage - 1) * rows"
      @page="changePage"
    />
  </div>
  <!-- END: Table -->
  <UsersDrawerComponent
    :drawerState="drawerState"
    :inEdition="inEdition"
    @update:drawerState="drawerState = $event"
    @saveUser="fetchUsers"
  />
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { Button, Drawer, Paginator, useConfirm } from "primevue";
import { ClinicsServices } from "../../../../services/clinics/ClinicsServices";
import UsersDrawerComponent from "./UsersDrawerComponent.vue";
import { UsersServices } from "../../../../services/user/UsersServices";
import { PermissionsUtils } from "../../../../utils/PermissionsUtils";
import { useRouter } from "vue-router";

const loading = ref(false);
const drawerState = ref(false);
const inEdition = ref(null);
const selectedUsers = ref([]);
const userInDeletion = ref(null);
const expandedRows = ref({});
const confirm = useConfirm();
const users = ref([]);
const router = useRouter();
const permissionsUserPage = ref(
  PermissionsUtils.checkMethodPemission(router.currentRoute.value.fullPath)
);

const rows = 20; // número fixo de itens por página
const totalRecords = ref(0);
const currentPage = ref(1);

function changePage(event: any) {
  currentPage.value = event.page + 1;
  fetchUsers();
}

const confirmDeleteUser = () => {
  try {
    confirm.require({
      message: "Você tem certeza que deseja salvar as alterações?",
      header: "Confirmação",
      icon: "pi pi-exclamation-triangle",
      rejectProps: {
        label: "Cancelar",
        severity: "secondary",
        outlined: true,
      },
      acceptProps: {
        label: "Confirmar",
        severity: "danger",
        outlined: true,
      },
      accept: () => {
        deleteUser(userInDeletion.value);
      },
      reject: () => {
        userInDeletion.value = null;
      },
    });
  } catch (error) {
    console.error("Erro na validação:", error);
  }
};

async function deleteUser(userId: string) {
  try {
    const response = await UsersServices.deleteUser(userId);
    if (response.status === 200) {
      fetchUsers();
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

async function fetchUsers() {
  try {
    loading.value = true;
    const response = await UsersServices.getUsers({
      page: currentPage.value,
    });
    if (response.status === 200) {
      users.value =
        response.data?.data?.Usuarios?.map((it: any) => ({
          ...it,
          Cargo: it.Role?.nome || "N/A",
        })) || [];
      totalRecords.value = response.data?.data?.Itens || 0;
    }
  } catch (error) {
    console.error("Error fetching clinics:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchUsers();
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
