<template>
  <!-- BEGIN: TopBar -->
  <div class="flex justify-between items-center pl-1 py-4 bg-white">
    <div>
      <h2 class="font-semibold text-gray-500">Lista de Pacientes</h2>
      <p class="text-sm text-gray-400">
        Gerencie os pacientes cadastrados na clínica, incluindo edição e
        exclusão.
      </p>
    </div>
    <div class="flex items-center gap-2">
      <Button
        label="Procedimentos"
        icon="pi pi-file"
        severity="secondary"
        size="small"
        @click="procedureModal.open()"
        :disabled="!permissionsUserPage.editar"
        v-if="userStore.user.Role?.toUpperCase() === 'MEDICO'"
      />
      <Button
        label="Adicionar"
        icon="pi pi-plus"
        severity="primary"
        size="small"
        @click="
          globalLoading = true;
          router.push({ name: 'Detalhes do Paciente', params: { id: 'novo' } });
        "
        :disabled="!permissionsUserPage.criar"
      ></Button>
    </div>
  </div>
  <!-- END: TopBar -->

  <!-- BEGIN: Insights -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4 gap-4">
    <Card
      class="col-span-1 !gap-0 !p-0"
      title="Total de Pacientes"
      :value="totalRecords"
      icon="pi pi-users"
      color="blue"
    >
      <template #title>
        <span class="text-lg text-gray-500 font-semibold"> Pacientes </span>
      </template>
      <template #content>
        <div class="flex items-center justify-start gap-2">
          <icon class="pi pi-users !text-2xl text-gray-500"></icon>
          <span class="text-2xl font-bold text-gray-700">{{
            totalRecords
          }}</span>
        </div>
      </template>
    </Card>
    <Card
      class="col-span-1 !gap-0 !p-0"
      title="Pacientes Femininos"
      :value="insightsData.womenUsers"
    >
      <template #title>
        <span class="text-lg text-gray-500 font-semibold"> Mulheres </span>
      </template>
      <template #content>
        <div class="flex items-center justify-start gap-2">
          <icon class="pi pi-venus !text-2xl text-pink-500"></icon>
          <span class="text-2xl font-bold text-gray-700">{{
            insightsData.womenUsers
          }}</span>
        </div>
      </template>
    </Card>
    <Card
      class="col-span-1 !gap-0 !p-0"
      title="Pacientes Masculinos"
      :value="insightsData.menUsers"
    >
      <template #title>
        <span class="text-lg text-gray-500 font-semibold"> Homens </span>
      </template>
      <template #content>
        <div class="flex items-center justify-start gap-2">
          <icon class="pi pi-mars !text-2xl text-blue-500"></icon>
          <span class="text-2xl font-bold text-gray-700">{{
            insightsData.menUsers
          }}</span>
        </div>
      </template>
    </Card>
    <Card
      class="col-span-1 !gap-0 !p-0"
      title="Pacientes Masculinos"
      :value="insightsData.menUsers"
    >
      <template #title>
        <span class="text-lg text-gray-500 font-semibold">
          Top 1 Convênios
        </span>
      </template>
      <template #content>
        <div class="flex items-center justify-start gap-2">
          <icon class="pi pi-trophy !text-2xl text-amber-400"></icon>
          <span
            v-tooltip.top="insightsData.convenio_mais_utilizado"
            class="text-2xl font-medium whitespace-nowrap text-ellipsis overflow-hidden text-gray-700"
            >{{ insightsData.convenio_mais_utilizado }}</span
          >
        </div>
      </template>
    </Card>
  </div>

  <!-- BEGIN: Table -->
  <div class="border border-gray-200/70 rounded-lg overflow-hidden">
    <DataTable
      :value="patients"
      v-model:expandedRows="expandedRows"
      stripedRows
      tableStyle="min-width: 50rem"
      :rows="rows"
      v-model:selection="selectedPatients"
      dataKey="ID"
      size="small"
      :loading="loading"
      class="text-sm"
    >
      <template #empty> Nenhum usuário encontrada. </template>
      <template #loading>
        <span class="!text-gray-500 flex items-center justify-center gap-2">
          <i class="pi pi-spin pi-spinner text-gray-500"></i>
          Carregando Pacientes
        </span>
      </template>

      <Column field="nome_completo" header="Nome" sortable>
        <template #body="slotProps">
          <span class="font-semibold text-gray-600">{{
            slotProps.data.nome_completo
          }}</span>
        </template>
      </Column>
      <Column field="celular" header="Celular" sortable></Column>
      <Column field="telefone" header="Telefone" sortable></Column>
      <Column field="data_nascimento" header="Data de Nascimento" sortable>
        <template #body="slotProps">
          {{
            new Date(slotProps.data.data_nascimento).toLocaleDateString("pt-BR")
          }}
        </template>
      </Column>

      <Column headerStyle="width:4rem">
        <template #body="slotProps">
          <div class="flex items-center justify-center gap-1">
            <Button
              label="Relatório"
              icon="pi pi-file"
              severity="info"
              variant="outlined"
              size="small"
              @click="
                globalLoading = true;
                router.push({
                  name: 'Anamneses',
                  params: { id: slotProps.data.id },
                });
              "
              :disabled="!permissionsUserPage.editar"
            />
            <Button
              icon="pi pi-user-edit"
              label="Editar"
              severity="secondary"
              size="small"
              variant="text"
              @click="
                globalLoading = true;
                router.push({
                  name: 'Detalhes do Paciente',
                  params: { id: slotProps.data.id },
                });
              "
              :disabled="!permissionsUserPage.editar"
            />
            <Button
              icon="pi pi-trash"
              label="Excluir"
              severity="danger"
              size="small"
              variant="text"
              class="ml-2"
              @click="confirmDeleteUser(slotProps.data.id)"
              :disabled="!permissionsUserPage.excluir"
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

  <ProcedureModalComponent ref="procedureModal" />
</template>

<script setup lang="ts">
import { Button, Card, Paginator, useConfirm, useToast } from "primevue";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { inject, onMounted, ref, type Ref } from "vue";
import { useRouter } from "vue-router";
import ProcedureModalComponent from "../../../../components/ProcedureModal/ProcedureModalComponent.vue";
import { PatientsServices } from "../../../../services/patients/PatientsServices";
import { useUserStore } from "../../../../stores/user";
import { PermissionsUtils } from "../../../../utils/PermissionsUtils";

const toast = useToast();
const loading = ref(false);
const linksLoading = ref(false);
const drawerState = ref(false);
const inEdition = ref(null);
const selectedPatients = ref([]);
const userInDeletion = ref(null);
const expandedRows = ref({});
const userStore = useUserStore();
const confirm = useConfirm();
const patients = ref([]);
const router = useRouter();
const insightsData = ref({
  totalUsers: 0,
  womenUsers: 0,
  menUsers: 0,
  convenio_mais_utilizado: 0,
});
const procedureModal = ref<InstanceType<typeof ProcedureModalComponent> | null>(
  null
);
const globalLoading = inject<Ref<boolean>>("globalLoading");

const permissionsUserPage = ref(
  PermissionsUtils.checkMethodPemission(router.currentRoute.value.fullPath)
);

const rows = 20; // número fixo de itens por página
const totalRecords = ref(0);
const currentPage = ref(1);

function changePage(event: any) {
  currentPage.value = event.page + 1;
  fetchPatients();
}

const confirmDeleteUser = (userID: string) => {
  try {
    confirm.require({
      message: "Você tem certeza que deseja salvar as alterações?",
      header: "Confirmação",
      icon: "pi pi-exclamation-triangle",
      rejectProps: {
        label: "Cancelar",
        severity: "secondary",
        outlined: true,
        size: "small",
      },
      acceptProps: {
        label: "Confirmar",
        severity: "danger",
        size: "small",
      },
      accept: () => {
        deleteUser(userID);
      },
      reject: () => {
        console.log("Ação cancelada pelo usuário.");
      },
    });
  } catch (error) {
    console.error("Erro na validação:", error);
  }
};

async function deleteUser(userId: string) {
  try {
    loading.value = true;
    const response = await PatientsServices.deletePatient(userId);
    if (response.status === 200) {
      fetchPatients();
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  } finally {
    loading.value = false;
  }
}

async function fetchPatients() {
  try {
    loading.value = true;
    const response = await PatientsServices.getPatients({
      pagina: currentPage.value,
      limite: rows,
    });
    if (response.status === 200) {
      patients.value = response.data?.data?.pacientes || [];
      totalRecords.value = response.data?.data?.Itens || 0;
      const insights = response.data?.data?.estatisticas || {};

      insightsData.value.totalUsers = insights.total_pacientes || 0;
      insightsData.value.womenUsers = insights.total_mulheres || 0;
      insightsData.value.menUsers = insights.total_homens || 0;
      insightsData.value.convenio_mais_utilizado =
        insights.convenio_mais_utilizado || "Nenhum";

      currentPage.value = response.data?.data?.paginacao?.pagina || 1;
      // rows = response.data?.data?.paginacao?.limite || 20;
      totalRecords.value = response.data?.data?.paginacao?.total || 0;
    }
  } catch (error) {
    console.error("Error fetching clinics:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await fetchPatients();
});
</script>

<style>
.p-overlay-mask {
  background-color: #437efd11 !important;
  backdrop-filter: blur(5px);
  color: #4c71c0;
  font-weight: 600;
}

.p-card-body {
  padding: 0.8rem !important;
}

.p-card-body,
.p-card-caption {
  gap: 0 !important;
}
</style>
