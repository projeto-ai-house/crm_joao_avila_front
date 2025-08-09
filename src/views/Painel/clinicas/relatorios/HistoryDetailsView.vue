<template>
  <!-- BEGIN: TopBar -->
  <div class="flex justify-between items-center p-1 py-4 bg-white pb-4">
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
    <div class="flex gap-2">
      <Button
        icon="pi pi-plus"
        label="Nova Anamnese"
        severity="primary"
        size="small"
        @click="openAnamneseDrawer()"
        :disabled="!permissionsUserPage.visualizar"
      />
      <Button
        label="Voltar"
        severity="secondary"
        size="small"
        variant="text"
        class="ml-2"
        @click="router.go(-1)"
      />
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
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <!-- END: Lista de Anamneses -->

  <!-- BEGIN: Drawer de Anamnese -->
  <HistoryDrawerComponent
    v-model:drawerState="drawerVisible"
    :inEdition="selectedAnamnese"
    :permissionsUserPage="permissionsUserPage"
    @saveAnamnese="handleSaveAnamnese"
  />
  <!-- END: Drawer de Anamnese -->
</template>

<script lang="ts" setup>
import { Button, Column, DataTable } from "primevue";
import { inject, onMounted, ref, type Ref } from "vue";
import { useRouter } from "vue-router";
import { AnamneseServices } from "../../../../services/anamnese/AnamneseServices";
import {
  type IPatient,
  PatientsServices,
} from "../../../../services/patients/PatientsServices";
import { DateUtils } from "../../../../utils/DateUtils";
import { PermissionsUtils } from "../../../../utils/PermissionsUtils";
import HistoryDrawerComponent, {
  type IAnamnese,
} from "./HistoryDrawerComponent.vue";

const globalLoading = inject<Ref<boolean>>("globalLoading");
const router = useRouter();
const permissionsUserPage = ref(
  PermissionsUtils.checkMethodPemission(router.currentRoute.value.fullPath)
);

// Estados da tabela
const loading = ref(false);
const anamneses = ref<IAnamnese[]>([]);

// Estados da gaveta
const drawerVisible = ref(false);

const patientData = ref<IPatient | null>(null);

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

async function handleSaveAnamnese(anamnese: IAnamnese) {
  try {
    globalLoading!.value = true;

    if (anamnese.id) {
      // TODO: Implementar AnamneseServices.updateAnamnese(anamnese.id, anamnese);
      console.log("Atualizando anamnese:", anamnese);
    } else {
      // TODO: Implementar AnamneseServices.createAnamnese(anamnese);
      console.log("Criando anamnese:", anamnese);
    }

    // Fechar gaveta e recarregar lista
    drawerVisible.value = false;
    await fetchAnamnesesList(selectedAnamnese.value.id);
  } catch (error) {
    console.error("Erro ao salvar anamnese:", error);
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
    const response = await AnamneseServices.getAnamneses(pacienteId);

    if (response.data && response.data?.data.anamneses) {
      anamneses.value = response.data?.data.anamneses;
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
  const pacienteId = router.currentRoute.value.params.id as string;
  console.log(permissionsUserPage.value);
  globalLoading!.value = false;
  await fetchPatientDetails(pacienteId);
  await fetchAnamnesesList(pacienteId);
});
</script>

<style></style>
