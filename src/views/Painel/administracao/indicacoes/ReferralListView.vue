<template>
  <!-- BEGIN: TopBar -->
  <div class="flex justify-between items-center pl-1 py-4 bg-white">
    <div>
      <h2 class="font-semibold text-gray-500">Lista de indicações</h2>
      <p class="text-sm text-gray-400">Gerencie as indicações de usuários.</p>
    </div>
  </div>
  <!-- END: TopBar -->

  <!-- BEGIN: Table -->
  <div class="border border-gray-200/70 rounded-lg overflow-hidden">
    <DataTable
      :value="referralList"
      v-model:expandedRows="expandedRows"
      stripedRows
      tableStyle="min-width: 50rem"
      :rows="rows"
      v-model:selection="selectedReferral"
      size="small"
      :loading="loading"
      class="text-sm"
      selectionMode="single"
      dataKey="id"
      @row-select="referralSubsDrawer.openDrawer(selectedReferral)"
    >
      <template #empty> Nenhum usuário encontrada. </template>
      <template #loading>
        <span class="!text-gray-500 flex items-center justify-center gap-2">
          <i class="pi pi-spin pi-spinner text-gray-500"></i>
          Carregando usuários
        </span>
      </template>

      <Column field="codigo_indicacao" header="Código" sortable></Column>
      <Column field="gerado_por_ceo_nome" header="Gerado por CEO" sortable>
        <template #body="slotProps">
          <span class="font-semibold text-gray-600">{{
            slotProps.data.gerado_por_ceo_nome || "Não informado"
          }}</span>
        </template>
      </Column>
      <Column
        field="gerado_na_clinica_nome"
        header="Gerado na Clínica"
        sortable
      >
      </Column>
      <Column field="status_link" header="Status" sortable></Column>
      <Column
        field="total_submissoes"
        header="Total de Submissões"
        sortable
      ></Column>
    </DataTable>
    <Paginator
      :rows="rows"
      :totalRecords="totalRecords"
      :first="(currentPage - 1) * rows"
      @page="changePage"
    />
  </div>
  <cite class="text-xs text-gray-500 p-2">
    * Clique em uma linha para expandir e ver mais detalhes.
  </cite>

  <ReferralSubsDrawerComponent
    ref="referralSubsDrawer"
    @update:close="selectedReferral = null"
  />
</template>

<script setup lang="ts">
import { Paginator, useConfirm, useToast } from "primevue";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ReferralsServices } from "../../../../services/referral/ReferralServices";
import { useUserStore } from "../../../../stores/user";
import { PermissionsUtils } from "../../../../utils/PermissionsUtils";
import ReferralSubsDrawerComponent from "./ReferralSubsDrawerComponent.vue";

const toast = useToast();
const loading = ref(false);
const linksLoading = ref(false);
const drawerState = ref(false);
const inEdition = ref(null);
const selectedReferral = ref("");
const userInDeletion = ref(null);
const expandedRows = ref({});
const userStore = useUserStore();
const confirm = useConfirm();
const referralList = ref([]);
const router = useRouter();
const referralSubsDrawer = ref(null);
const permissionsUserPage = ref(
  PermissionsUtils.checkMethodPemission(router.currentRoute.value.fullPath)
);

const rows = 20; // número fixo de itens por página
const totalRecords = ref(0);
const currentPage = ref(1);

function changePage(event: any) {
  currentPage.value = event.page + 1;
  fetchReferrals();
}

async function fetchReferrals() {
  try {
    loading.value = true;
    const response = await ReferralsServices.getReferrals({
      pagina: currentPage.value || 1,
      limite: 20,
    });

    // Check if the response is successful
    if (response.status === 200) {
      referralList.value = response.data?.data?.indicacoes || [];
      totalRecords.value = response.data?.data?.paginacao?.total || 0;
    }
  } catch (error) {
    console.error("Error fetching clinics:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await fetchReferrals();
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
