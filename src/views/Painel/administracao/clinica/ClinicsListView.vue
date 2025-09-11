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
      <Column expander style="width: 1rem" />
      <Column field="" header="" class="" style="max-width: 200px">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <div v-tooltip.top="slotProps.data.Ativa ? 'Ativa' : 'Inativa'">
              <Power
                class="w-4 h-4 text-green-300"
                style="stroke-width: 3.4px"
                v-if="!!slotProps.data.Ativa"
              />
              <PowerOff
                class="w-4 h-4 text-red-300"
                style="stroke-width: 3.4px"
                v-if="!slotProps.data.Ativa"
              />
            </div>

            <div
              v-tooltip.top="
                'Limite do plano atingido em ' +
                (slotProps.data.LimiteAtingidoEm
                  ? new Date(
                      slotProps.data.LimiteAtingidoEm
                    ).toLocaleDateString()
                  : 'N/A')
              "
            >
              <TriangleAlert
                class="w-4 h-4 text-orange-400"
                style="stroke-width: 3px"
                v-if="slotProps.data.LimitePlanoAtingido"
              />
            </div>
          </div>
        </template>
      </Column>
      <Column
        field="NomeClinica"
        sortable
        header="Nome"
        class="!pl-0"
        style="max-width: 200px"
      >
        <template #body="slotProps">
          <div
            class="truncate-cell font-medium"
            :title="slotProps.data.NomeClinica"
          >
            {{ slotProps.data.NomeClinica }}
          </div>
        </template>
      </Column>
      <Column field="Status" sortable header="Status" style="max-width: 200px">
        <template #body="slotProps">
          <div
            :title="translateStatus(slotProps.data.Status)"
            class="truncate-cell font-medium text-gray-500"
            :class="{
              '!text-green-400': slotProps.data.Status === 'paid',
              '!text-blue-400': slotProps.data.Status === 'active',
            }"
          >
            {{ translateStatus(slotProps.data.Status) }}
            <Check
              v-if="
                slotProps.data.Status === 'paid' ||
                slotProps.data.Status === 'active'
              "
              class="inline w-4 h-4"
            />
          </div>
        </template>
      </Column>
      <Column
        field="dono"
        sortable
        header="Responsável"
        style="max-width: 200px"
      >
        <template #body="slotProps">
          <div class="truncate-cell" :title="slotProps.data.dono">
            {{ slotProps.data.dono }}
          </div>
        </template>
        <!-- 
        AssinaturaId
: 
"in_1Ruyn7LwRkNmI7bLXM5WOSpY"
Ativa
: 
true
Cnpj
: 
"12312132323233"
Donos
: 
null
Endereco
: 
" TESTE token 2"
ID
: 
"760a12e1-107d-4be1-a96d-2bb508c425b0"
LimiteAtingidoEm
: 
null
LimitePlanoAtingido
: 
false
NomeClinica
: 
"Clinica Mestra"
Plano
: 
{nome: "", limite_conversas: 0, periodo_dias: 0, valor: 0, recorrente: null,…}
Status
: 
"paid"
Token
: 
""
plano_id
: 
"e6eb6472-b61f-429c-a66a-c1f370bfb941"
        -->
      </Column>
      <Column field="Cnpj" sortable header="CNPJ" style="max-width: 200px">
        <template #body="slotProps">
          <div class="truncate-cell" :title="maskCnpj(slotProps.data.Cnpj)">
            {{ maskCnpj(slotProps.data.Cnpj) }}
          </div>
        </template>
      </Column>
      <Column field="Plano" sortable header="Plano" style="max-width: 200px">
        <template #body="slotProps">
          <div class="flex items-center">
            <div
              class="pl-2 pr-1 rounded-l-full h-6"
              :class="{
                'border border-orange-600 font-semibold text-orange-600 bg-white ':
                  slotProps.data?.LimitePlanoAtingido,
              }"
              :title="
                slotProps.data?.Plano?.nome +
                  (slotProps.data?.Plano?.recorrente ? ' (Recorrente)' : '') ||
                'Indefinido'
              "
            >
              {{
                slotProps.data?.Plano?.nome +
                  (slotProps.data?.Plano?.recorrente ? " (Recorrente)" : "") ||
                "Indefinido"
              }}
            </div>
            <div
              v-if="slotProps.data.LimitePlanoAtingido"
              class="text-xs bg-orange-600 pl-2 pr-3 py-0 rounded-r-full text-white font-semibold flex items-center justify-center h-6"
              v-tooltip.top="
                generateDaysCount(slotProps.data.LimiteAtingidoEm) +
                ' Dias desde o limite de uso atingido'
              "
            >
              {{ generateDaysCount(slotProps.data.LimiteAtingidoEm) }}
            </div>
          </div>
        </template>
      </Column>
      <Column
        field="Endereco"
        sortable
        header="Endereço"
        style="max-width: 200px"
      >
        <template #body="slotProps">
          <div class="truncate-cell" :title="slotProps.data.Endereco">
            {{ slotProps.data.Endereco }}
          </div>
        </template>
      </Column>
      <Column
        field="Token"
        sortable
        header="Token (Integração)"
        style="max-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <span
              class="truncate-cell font-mono text-gray-600"
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
              class="p-1 flex-shrink-0"
              @click="copyToken(slotProps.data.Token)"
              v-tooltip="'Copiar token'"
            />
          </div>
        </template>
      </Column>
      <Column headerStyle="width:4rem">
        <template #body="slotProps">
          <div class="flex justify-start items-center gap-2">
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
            />

            <Button
              label="Assinatura"
              icon="pi pi-ticket"
              severity="info"
              size="small"
              variant="outlined"
              v-show="slotProps.data?.AssinaturaId"
              @click="
                signatureSelected = slotProps.data?.AssinaturaId;
                drawerSignatureState = true;
              "
            />
          </div>
        </template>
      </Column>

      <template #expansion="slotProps">
        <div class="p-2 rounded-lg" v-if="slotProps.data?.Donos?.length > 0">
          <DataTable
            :value="slotProps.data.Donos"
            stripedRows
            dataKey="id"
            size="small"
          >
            <Column
              field="nome_completo"
              header="Nome"
              sortable
              style="max-width: 200px"
            >
              <template #body="slotProps">
                <div
                  class="truncate-cell"
                  :title="slotProps.data.nome_completo"
                >
                  {{ slotProps.data.nome_completo }}
                </div>
              </template>
            </Column>
            <Column
              field="email"
              header="E-mail"
              sortable
              style="max-width: 200px"
            >
              <template #body="slotProps">
                <div class="truncate-cell" :title="slotProps.data.email">
                  {{ slotProps.data.email }}
                </div>
              </template>
            </Column>
            <Column
              field="convenio"
              header="Convênio"
              sortable
              style="max-width: 200px"
            >
              <template #body="slotProps">
                <div class="truncate-cell" :title="slotProps.data.convenio">
                  {{ slotProps.data.convenio }}
                </div>
              </template>
            </Column>

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
        <div
          v-else
          class="py-1 px-4 text-gray-500 bg-blue-50 rounded-lg flex items-center justify-between"
        >
          Nenhum responsável encontrado para esta clínica.
          <Button
            icon="pi pi-user-plus"
            label="Adicionar Responsável"
            severity="primary"
            size="small"
            variant="text"
            @click="addCEO(slotProps.data?.ID)"
          />
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

  <SignatureDrawerComponent
    :drawerState="drawerSignatureState"
    :assinaturaId="signatureSelected"
    @update:drawerState="drawerSignatureState = $event"
  />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { Check, Power, PowerOff, TriangleAlert } from "lucide-vue-next";
import { Button, Paginator, useToast } from "primevue";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { onMounted, ref } from "vue";
import { ClinicsServices } from "../../../../services/clinics/ClinicsServices";
import { usePermissionsStore } from "../../../../stores/permissions";
import UsersDrawerComponent from "../../clinicas/usuarios/UsersDrawerComponent.vue";
import ClinicsDrawerComponent from "./ClinicsDrawerComponent.vue";
import SignatureDrawerComponent from "./SignatureDrawerComponent.vue";
const permissionsStore = usePermissionsStore();

const loading = ref(false);
const drawerClinicsState = ref(false);
const drawerCEOState = ref(false);
const drawerSignatureState = ref(false);
const signatureSelected = ref(null);
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
    "$1.***.***/****-$5"
  );
}

function changePage(event: any) {
  currentPage.value = event.page + 1;
  fetchClinics();
}

function translateStatus(status: string) {
  if (!status) return "Indefinido";
  if (status === "paid") return "Pago";
  if (status === "active") return "Ativo";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function generateDaysCount(date: string) {
  if (!date) return "-";
  const now = dayjs();
  const pastDate = dayjs(date);
  const diff = now.diff(pastDate, "day");
  return diff + (diff === 1 ? " dia" : " dias");
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

function addCEO(clinic_id: any) {
  inEdition.value = {
    Email: "",
    NomeCompleto: "",
    Cpf: "",
    DataNascimento: "",
    Telefone: "",
    Convenio: "",
    PasswordHash: "",
    ID: "",
    BlockRole: true,
    ClinicaID: clinic_id,
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

.truncate-cell {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

/* Ensure table cells respect the max-width */
:deep(.p-datatable-tbody td) {
  max-width: 200px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
}

/* Make sure the flex container in Token column doesn't overflow */
:deep(.p-datatable-tbody td .flex) {
  max-width: 100%;
  overflow: hidden;
}
</style>
