<template>
  <!-- BEGIN: TopBar -->
  <div class="flex justify-between items-center pl-1 py-4 bg-white">
    <div>
      <h2 class="font-semibold text-gray-500">Lista de Clínicas</h2>
      <p class="text-sm text-gray-400">
        Gerencie as clínicas do sistema, incluindo suas informações e
        responsáveis.
      </p>
    </div>
    <Button
      label="Adicionar"
      icon="pi pi-plus"
      severity="primary"
      size="small"
      @click="
        inEdition = null;
        drawerClinicsState = true;
      "
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
      dataKey="ID"
      size="small"
      class="text-sm"
      :loading="loading"
    >
      <template #empty> Nenhuma clínica encontrada. </template>
      <template #loading> Carregando clínicas... </template>
      <Column expander style="width: 5rem" />
      <Column field="NomeClinica" sortable header="Nome"></Column>
      <Column field="dono" sortable header="Responsável"></Column>
      <Column field="Cnpj" sortable header="CNPJ">
        <template #body="slotProps">
          {{ maskCnpj(slotProps.data.Cnpj) }}
        </template></Column
      >
      <Column field="Endereco" sortable header="Endereço"></Column>
      <Column field="Token" sortable header="Token (Integração)">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-mono text-gray-600 truncate max-w-xs"
              :title="slotProps.data.Token"
            >
              {{ slotProps.data.Token }}
            </span>
            <Button
              v-if="slotProps.data.Token"
              icon="pi pi-copy"
              severity="secondary"
              size="small"
              variant="text"
              class="p-1"
              @click="copyToken(slotProps.data.Token)"
              v-tooltip="'Copiar token'"
            />
          </div>
        </template>
      </Column>
      <!-- <Column headerStyle="width:4rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-pen-to-square"
            label="Editar"
            severity="secondary"
            size="small"
            variant="text"
            @click="
              inEdition = slotProps.data;
              drawerClinicsState = true;
            "
        /></template>
      </Column> -->

      <template #expansion="slotProps">
        <div class="p-2 rounded-lg" v-if="slotProps.data?.Donos?.length > 0">
          <DataTable
            :value="slotProps.data.Donos"
            stripedRows
            dataKey="id"
            size="small"
          >
            <Column field="nome_completo" header="Nome" sortable></Column>
            <Column field="email" header="E-mail" sortable></Column>
            <Column field="convenio" header="Convênio" sortable></Column>

            <Column headerStyle="width:4rem">
              <template #body>
                <Button
                  icon="pi pi-user-edit"
                  label="Editar"
                  severity="secondary"
                  size="small"
                  variant="text"
                  @click="editCEO(slotProps.data?.Donos[0])"
                />
              </template>
            </Column>
          </DataTable>
        </div>
        <div v-else class="p-4 text-gray-500 bg-blue-50 rounded-lg">
          Nenhum responsável encontrado para esta clínica.
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

  <ClinicsDrawerComponent
    :drawerState="drawerClinicsState"
    :inEdition="inEdition"
    @update:drawerState="drawerClinicsState = $event"
    @saveClinic="fetchClinics"
  />

  <UsersDrawerComponent
    :drawerState="drawerCEOState"
    :inEdition="inEdition"
    @update:drawerState="drawerCEOState = $event"
    @saveUser="fetchClinics"
  />
</template>

<script setup lang="ts">
import { Button, Paginator, useToast } from "primevue";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { onMounted, ref } from "vue";
import { ClinicsServices } from "../../../../services/clinics/ClinicsServices";
import { usePermissionsStore } from "../../../../stores/permissions";
import UsersDrawerComponent from "../../clinicas/usuarios/UsersDrawerComponent.vue";
import ClinicsDrawerComponent from "./ClinicsDrawerComponent.vue";
const permissionsStore = usePermissionsStore();

const loading = ref(false);
const drawerClinicsState = ref(false);
const drawerCEOState = ref(false);
const inEdition = ref(null);
const selectedClinics = ref([]);
const expandedRows = ref({});
const clinics = ref([]);
const toast = useToast();

const rows = 20; // número fixo de itens por página
const totalRecords = ref(0);
const currentPage = ref(1);

function maskCnpj(cnpj: string) {
  if (!cnpj) return "";
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

function changePage(event: any) {
  currentPage.value = event.page + 1;
  fetchClinics();
}

function editCEO(data: any) {
  inEdition.value = {
    Email: data.email || "",
    NomeCompleto: data.nome_completo || "",
    Cpf: data.cpf || "",
    DataNascimento: data.data_nascimento || "",
    Telefone: data.telefone || "",
    Convenio: data.convenio || "",
    PasswordHash: "",
    ID: data.id || "",
    BlockRole: true,
  };
  drawerCEOState.value = true;
}

async function copyToken(token: string) {
  try {
    if (!navigator.clipboard) {
      throw new Error("Clipboard API não suportada");
    }

    await navigator.clipboard.writeText(token);
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Token copiado para a área de transferência.",
      life: 1000,
    });
  } catch (error) {
    console.error("Erro ao copiar token:", error);

    try {
      const textArea = document.createElement("textarea");
      textArea.value = token;
      textArea.style.position = "fixed";

      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand
        ? document.execCommand("copy")
        : false;
      document.body.removeChild(textArea);

      if (successful) {
        toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Token copiado para a área de transferência.",
          life: 1000,
        });
      } else {
        throw new Error("Falha ao copiar usando fallback");
      }
    } catch (fallbackError) {
      console.error("Fallback também falhou:", fallbackError);
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível copiar o token.",
        life: 1000,
      });
    }
  }
}

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
          Donos: Array.isArray(it.Donos) ? it.Donos : [],
          dono:
            Array.isArray(it.Donos) && it.Donos.length > 0
              ? it.Donos[0].nome_completo
              : "",
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
  console.log("Permissions:", permissionsStore.permissions);
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
