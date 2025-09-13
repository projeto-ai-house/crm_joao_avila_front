<template>
  <!-- BEGIN: TopBar -->
  <div class="flex justify-between items-start sm:p-1 py-4 bg-white pb-4">
    <div>
      <h2 class="font-semibold text-gray-500">Anamneses do Paciente</h2>
      <p class="text-sm text-gray-400">
        Histórico de anamneses realizadas pelo paciente
      </p>
      <p class="text-sm text-gray-400">
        Paciente:
        <span class="font-semibold">{{ patientData?.nome_completo }}</span>
      </p>
    </div>
    <div class="flex sm:gap-2 flex-row-reverse sm:flex-row">
      <Button
        icon="pi pi-plus"
        label="Nova Anamnese"
        severity="primary"
        size="small"
        class="[&_.p-button-label]:hidden sm:[&_.p-button-label]:inline-block !p-3 sm:!p-2"
        v-tooltip="'Adicionar nova anamnese'"
        @click="openAnamneseDrawer()"
        :disabled="!permissionsUserPage.criar"
      />
      <Button
        label="Voltar"
        severity="secondary"
        size="small"
        class="[&_.p-button-label]:hidden sm:[&_.p-button-label]:inline-block !p-3 sm:!p-2 sm:ml-2"
        v-tooltip="'Voltar'"
        variant="text"
        @click="router.go(-1)"
      >
        <template #icon>
          <Undo2 class="w-4 h-4" />
        </template>
      </Button>
    </div>
  </div>
  <!-- END: TopBar -->

  <!-- BEGIN: Lista de Anamneses -->
  <div class="border border-gray-200/70 rounded-lg overflow-hidden">
    <DataTable
      :value="anamneses"
      stripedRows
      tableStyle="min-width: 50rem"
      :loading="loading"
      class="text-sm"
      dataKey="id"
      size="small"
    >
      <template #empty>
        <div class="text-center py-8">
          <i class="pi pi-file-o text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Nenhuma anamnese encontrada</p>
          <p class="text-sm text-gray-400">
            Clique em "Nova Anamnese" para começar
          </p>
        </div>
      </template>
      <template #loading>
        <span class="!text-gray-500 flex items-center justify-center gap-2">
          <i class="pi pi-spin pi-spinner text-gray-500"></i>
          Carregando Anamneses
        </span>
      </template>

      <Column field="queixa_principal" header="Queixa Principal" sortable>
        <template #body="slotProps">
          <div class="max-w-xs">
            <p class="font-semibold text-gray-600 truncate">
              {{ slotProps.data.queixa_principal }}
            </p>
          </div>
        </template>
      </Column>

      <Column field="medico_nome" header="Médico" sortable>
        <template #body="slotProps">
          <span class="text-gray-600">{{ slotProps.data.medico_nome }}</span>
        </template>
      </Column>

      <Column field="created_at" header="Data de Criação" sortable>
        <template #body="slotProps">
          <span class="text-gray-600">
            {{ DateUtils.separateDateAndTime(slotProps.data.created_at)[0] }}
          </span>
        </template>
      </Column>

      <Column field="updated_at" header="Última Atualização" sortable>
        <template #body="slotProps">
          <span class="text-gray-600">
            {{ DateUtils.separateDateAndTime(slotProps.data.updated_at)[0] }}
          </span>
        </template>
      </Column>

      <Column headerStyle="width:4rem">
        <template #body="slotProps">
          <div class="flex items-center justify-center gap-1">
            <Button
              icon="pi pi-eye"
              label="Visualizar"
              severity="info"
              variant="outlined"
              size="small"
              @click="openAnamneseDrawer(slotProps.data, true)"
              :disabled="!permissionsUserPage.visualizar"
            />
            <Button
              v-if="userStore.user?.Role?.includes('CEO')"
              icon="pi pi-trash"
              severity="danger"
              variant="text"
              size="small"
              class="ml-2"
              @click="confirmDeleteAnamnese(slotProps.data)"
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
  <!-- END: Lista de Anamneses -->

  <!-- BEGIN: Drawer de Anamnese -->
  <HistoryDrawerComponent
    v-model:drawerState="drawerVisible"
    :inEdition="selectedAnamnese"
    :permissionsUserPage="permissionsUserPage"
    :patientId="pacienteId"
    @saveAnamnese="handleSaveAnamnese"
  />
  <!-- END: Drawer de Anamnese -->
</template>

<script lang="ts" setup>
import { Undo2 } from "lucide-vue-next";
import { Button, Column, DataTable, Paginator, useConfirm } from "primevue";
import { inject, onMounted, ref, type Ref } from "vue";
import { useRouter } from "vue-router";
import { AnamneseServices } from "../../../../services/anamnese/AnamneseServices";
import {
  type IPatient,
  PatientsServices,
} from "../../../../services/patients/PatientsServices";
import { useUserStore } from "../../../../stores/user";
import { DateUtils } from "../../../../utils/DateUtils";
import { PermissionsUtils } from "../../../../utils/PermissionsUtils";
import HistoryDrawerComponent, {
  type IAnamnese,
} from "./HistoryDrawerComponent.vue";

const userStore = useUserStore();
const globalLoading = inject<Ref<boolean>>("globalLoading");
const router = useRouter();
const permissionsUserPage = ref(
  PermissionsUtils.checkMethodPemission(router.currentRoute.value.fullPath)
);
const confirm = useConfirm();
const rows = ref(10); // Número de registros por página
const totalRecords = ref(0);
const currentPage = ref(1);

// Estados da tabela
const loading = ref(false);
const anamneses = ref<IAnamnese[]>([]);

// Estados da gaveta
const drawerVisible = ref(false);

const patientData = ref<IPatient | null>(null);
const pacienteId = ref<string | null>(null);

const emptyAnamnese: IAnamnese = {
  id: "",
  queixa_principal: "",
  historia_doenca_atual: "",
  historia_familiar: "",
  historia_pessoal: "",
  revisao_sistemas: "",
  habitos_de_vida: "",
  medicamentos_em_uso: "",
  alergias: "",
};

const selectedAnamnese = ref<IAnamnese | null>(null);

function openAnamneseDrawer(anamnese?: IAnamnese, readonly = false) {
  if (anamnese) {
    selectedAnamnese.value = { ...anamnese };
  } else {
    selectedAnamnese.value = {
      ...emptyAnamnese,
    };
  }
  drawerVisible.value = true;
}

const confirmDeleteAnamnese = (anamnese: IAnamnese) => {
  confirm.require({
    message: "Tem certeza que deseja excluir esta anamnese?",
    header: "Confirmação",
    icon: "pi pi-exclamation-triangle ",
    accept: async () => {
      await handleDeleteAnamnese(anamnese);
    },
    rejectProps: {
      label: "Cancelar",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Excluir",
      severity: "danger",
    },
  });
};

function changePage(event: any) {
  currentPage.value = event.page + 1;
  fetchAnamnesesList(pacienteId.value);
}

async function handleSaveAnamnese(anamnese: IAnamnese) {
  try {
    globalLoading!.value = true;
    drawerVisible.value = false;
    await fetchAnamnesesList(pacienteId.value);
  } catch (error) {
    console.error("Erro ao salvar anamnese:", error);
  } finally {
    globalLoading!.value = false;
  }
}

async function handleDeleteAnamnese(anamnese: IAnamnese) {
  try {
    globalLoading!.value = true;
    await AnamneseServices.deleteAnamnese(anamnese.id);
    await fetchAnamnesesList(pacienteId.value);
  } catch (error) {
    console.error("Erro ao excluir anamnese:", error);
  } finally {
    globalLoading!.value = false;
  }
}

async function fetchPatientDetails(id: string) {
  try {
    const response = await PatientsServices.getPatient(id);
    if (response.status !== 200) {
      return console.warn("Failed to fetch patient details");
    }
    patientData.value = response.data.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes do paciente:", error);
  }
}

async function fetchAnamnesesList(pacienteId: string) {
  try {
    loading.value = true;
    const response = await AnamneseServices.getAnamneses(
      pacienteId,
      rows.value,
      currentPage.value
    );

    if (response.data && response.data?.data.anamneses) {
      anamneses.value = response.data?.data.anamneses;
      totalRecords.value = response.data?.data.paginacao.total || 0;
      currentPage.value = response.data?.data.paginacao.pagina || 1;
      rows.value = response.data?.data.paginacao.limite || 20;
    } else {
      anamneses.value = [];
    }
  } catch (error) {
    console.error("Erro ao buscar anamneses:", error);
    anamneses.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  pacienteId.value = router.currentRoute.value.params.id as string;
  globalLoading!.value = false;
  await fetchPatientDetails(pacienteId.value);
  await fetchAnamnesesList(pacienteId.value);
});
</script>

<style></style>
