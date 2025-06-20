<template>
  <!-- BEGIN: TopBar -->
  <div class="flex justify-between items-center pl-1 py-4 bg-white">
    <h2 class="font-semibold text-gray-500">Lista de Clínicas</h2>
    <Button
      label="Adicionar"
      icon="pi pi-plus"
      severity="primary"
      size="small"
      @click="drawerState = true"
    ></Button>
  </div>
  <!-- END: TopBar -->

  <!-- BEGIN: Table -->
  <div class="border border-gray-200/70 rounded-lg overflow-hidden">
    <DataTable
      :value="clinics"
      v-model:expandedRows="expandedRows"
      stripedRows
      tableStyle="min-width: 50rem"
      :rows="rows"
      v-model:selection="selectedClinics"
      dataKey="id"
      size="small"
      :loading="loading"
      
    >
      <template #empty> Nenhuma clínica encontrada. </template>
      <template #loading> Carregando clínicas... </template>
      <Column expander style="width: 5rem" />
      <Column field="NomeClinica" sortable header="Nome"> </Column>
      <Column field="dono" sortable header="Responsável"></Column>
      <Column field="Cnpj" sortable header="CNPJ"> </Column>
      <Column field="Endereco" sortable header="Endereço"></Column>

      <template #expansion="slotProps" v-ripple="true">
        <div class="p-2">
          <DataTable :value="slotProps.data.Donos" stripedRows>
            <Column field="nome_completo" header="Nome" sortable></Column>
            <Column field="email" header="E-mail" sortable></Column>
            <Column field="convenio" header="Convênio" sortable></Column>
            <!-- <Column field="amount" header="Amount" sortable>
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.amount) }}
              </template>
            </Column>
            <Column field="status" header="Status" sortable>
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.status.toLowerCase()"
                  :severity="getOrderSeverity(slotProps.data)"
                />
              </template>
            </Column> -->
            <!-- <Column headerStyle="width:4rem">
              <template #body>
                <Button icon="pi pi-search" />
              </template>
            </Column> -->
          </DataTable>
        </div>
      </template>
    </DataTable>
    <Paginator
      :rows="rows"
      :totalRecords="totalRecords"
      :first="(currentPage - 1) * rows"
      @page="changePage"
    />
  </div>
  <!-- END: Table -->

  <Drawer
    v-model:visible="drawerState"
    header="Adicionar Clínica"
    position="right"
    class="!w-full md:!w-80 lg:!w-[30rem]"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <span class="font-bold">Adicionar Clínica</span>
      </div>
    </template>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </p>
    <template #footer>
      <div class="flex items-center gap-2">
        <Button
          label="Salvar"
          icon="pi pi-save"
          severity="success"
          class="flex-auto"
          size="small"
        ></Button>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          class="flex-auto"
          severity="contrast"
          size="small"
          text
          @click="drawerState = false"
        ></Button>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { Button, Drawer, Paginator } from "primevue";
import { ClinicsServices } from "../../../services/clinics/ClinicsServices";

const loading = ref(false);
const drawerState = ref(false);
const selectedClinics = ref([]);
const expandedRows = ref({});
const clinics = ref([]);

const rows = 20; // número fixo de itens por página
const totalRecords = ref(0);
const currentPage = ref(1);

function changePage(event: any) {
  currentPage.value = event.page + 1;
  fetchClinics();
}

const expandAll = () => {
  expandedRows.value = clinics.value.reduce(
    (acc, p) => (acc[p.id] = true) && acc,
    {}
  );
};
const collapseAll = () => {
  expandedRows.value = null;
};

async function fetchClinics() {
  try {
    loading.value = true;
    const response = await ClinicsServices.getClinics({
      page: currentPage.value,
    });
    if (response.status === 200) {
      clinics.value =
        response.data?.data?.Clinicas?.map((it: any) => ({
          ...it,
          dono: it.Donos.length > 0 ? it.Donos[0].nome_completo : "",
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
  fetchClinics();
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
