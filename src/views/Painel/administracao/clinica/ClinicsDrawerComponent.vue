<template>
  <Drawer
    v-model:visible="props.drawerState"
    header="Adicionar Clínica"
    position="right"
    class="!w-full md:!w-80 lg:!w-[30rem]"
    @update:visible="emit('update:drawerState', $event)"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <span class="font-bold">Adicionar Clínica</span>
      </div>
    </template>
    <Form
      ref="formClinic"
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      @submit="saveClinic"
      class="grid grid-cols-12 w-full gap-4"
    >
      <!-- SEÇÃO: DADOS DA CLÍNICA -->
      <div
        class="col-span-12 grid grid-cols-12 gap-4"
        v-show="
          (isEditing && !!initialValues?.ClinicaID) ||
          (!isEditing && !initialValues?.ClinicaID)
        "
      >
        <div
          class="col-span-12 flex items-center gap-2 text-gray-700 text-base font-semibold mt-2 mb-1 border-b border-gray-200 pb-2"
        >
          <Hospital class="w-5 h-5" /> Dados da Clínica
        </div>

        <!-- Nome da Clínica -->
        <div class="col-span-12 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputText
              id="nome_clinica"
              name="nome_clinica"
              type="text"
              fluid
              size="small"
              v-model="initialValues.nome_clinica"
            />
            <label for="nome_clinica"
              >Nome da Clínica
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.nome_clinica?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.nome_clinica.error.message }}</Message
          >
        </div>

        <!-- CNPJ e Endereço na mesma linha -->
        <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputMask
              id="Cnpj"
              name="Cnpj"
              mask="**.***.***/****-**"
              type="text"
              fluid
              v-model="initialValues.Cnpj"
              size="small"
            />
            <label for="Cnpj"
              >CNPJ
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.Cnpj?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.Cnpj.error.message }}</Message
          >
        </div>

        <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputText
              id="Endereco"
              name="Endereco"
              type="text"
              fluid
              v-model="initialValues.Endereco"
              size="small"
            />
            <label for="Endereco"
              >Endereço
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.Endereco?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.Endereco.error.message }}</Message
          >
        </div>
        <div class="col-span-12 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputText
              id="assinatura_id"
              name="assinatura_id"
              type="text"
              fluid
              v-model="initialValues.assinatura_id"
              size="small"
            />
            <label for="assinatura_id">
              ID da Assinatura
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.assinatura_id?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.assinatura_id.error.message }}</Message
          >
        </div>

        <div class="col-span-12 flex flex-col gap-1">
          <FloatLabel variant="on">
            <Select
              v-model="initialValues.plano_id"
              :options="listPlans"
              optionValue="id"
              optionLabel="nome"
              fluid
              size="small"
              @change="handlePlanChange"
            />
            <label for="plano_id">Plano</label>
          </FloatLabel>
          <Message
            v-if="$form.plano_id?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.plano_id.error.message }}</Message
          >
        </div>

        <div
          class="col-span-12 grid grid-cols-12 gap-4 mb-2"
          v-show="initialValues.plano_custom"
        >
          <div class="col-span-12 flex flex-col gap-1">
            <FloatLabel variant="on">
              <InputText
                id="plano_custom_nome"
                name="plano_custom_nome"
                type="text"
                fluid
                v-model="initialValues.plano_custom_dados.nome"
                size="small"
              />
              <label for="plano_nome">Apelido</label>
            </FloatLabel>
          </div>
          <div class="col-span-6 flex flex-col gap-1">
            <FloatLabel variant="on">
              <InputText
                id="plano_custom_valor"
                name="plano_custom_valor"
                type="text"
                fluid
                v-model="(initialValues.plano_custom_dados.valor as unknown as string)"
                size="small"
              />
              <label for="plano_valor">Valor do Plano</label>
            </FloatLabel>
          </div>

          <div class="col-span-6 flex flex-col gap-1">
            <FloatLabel variant="on">
              <InputText
                id="plano_custom_periodo_dias"
                name="plano_custom_periodo_dias"
                type="text"
                fluid
                v-model="(initialValues.plano_custom_dados.periodo_dias as unknown as string)"
                size="small"
              />
              <label for="plano_periodo_dias">Período (dias)</label>
            </FloatLabel>
          </div>
          <div class="col-span-6 flex flex-col gap-1">
            <FloatLabel variant="on">
              <InputText
                id="plano_custom_limite_conversas"
                name="plano_custom_limite_conversas"
                type="text"
                fluid
                v-model="(initialValues.plano_custom_dados.limite_conversas as unknown as string)"
                size="small"
              />
              <label for="plano_limite_conversas">Limite de Conversas</label>
            </FloatLabel>
          </div>
        </div>

        <div class="col-span-7 flex flex-col gap-1">
          <FloatLabel variant="on">
            <DatePicker
              id="plano_custom_data_inicio"
              name="plano_custom_data_inicio"
              v-model="initialValues.plano_custom_dados.data_inicio"
              showIcon
              dateFormat="dd/mm/yy"
              inputClass="w-full"
              size="small"
            />
            <label for="plano_custom_data_inicio">Início</label>
          </FloatLabel>
        </div>

        <!-- Checkbox Recorrência -->
        <div class="col-span-5 flex flex-col gap-1 my-auto">
          <div class="flex items-center gap-2">
            <Checkbox
              id="plano_custom_recorrencia"
              name="plano_custom_recorrencia"
              :binary="true"
              v-model="initialValues.plano_custom_dados.recorrente"
            />
            <label for="plano_custom_recorrencia">Recorrência</label>
          </div>
        </div>
      </div>

      <!-- SEÇÃO: WEBHOOKS (apenas em edição) -->
      <div
        class="col-span-12 grid grid-cols-12 gap-4"
        v-show="isEditing && !!initialValues?.ClinicaID"
      >
        <div
          class="col-span-12 flex items-center gap-2 text-gray-700 text-base font-semibold mt-4 mb-1 border-b border-gray-200 pb-2"
        >
          <Webhook class="w-5 h-5" /> Webhooks da Clínica
        </div>

        <!-- Lista de Webhooks -->
        <div class="col-span-12 flex flex-col gap-3">
          <div
            v-if="loadingWebhooks"
            class="flex items-center justify-center py-6"
          >
            <Loader2 class="w-6 h-6 animate-spin text-blue-500" />
          </div>

          <div v-else-if="webhooks.length === 0" class="col-span-12">
            <div
              class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-500 text-sm"
            >
              Nenhum webhook configurado para esta clínica.
            </div>
          </div>

          <div
            v-else
            v-for="webhook in webhooks"
            :key="webhook.id"
            class="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <div
                    :class="[
                      'w-2 h-2 rounded-full',
                      webhook.is_active ? 'bg-green-500' : 'bg-gray-400',
                    ]"
                  ></div>
                  <p class="text-sm text-gray-700 truncate font-mono">
                    {{ webhook.webhook_url }}
                  </p>
                </div>
                <p class="text-xs text-gray-400 ml-3">
                  {{
                    new Date(webhook.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                </p>
              </div>

              <ToggleSwitch
                :modelValue="webhook.is_active"
                @update:modelValue="handleWebhookToggle(webhook.id, $event)"
              />
            </div>
          </div>
        </div>

        <!-- Adicionar Novo Webhook -->
        <div class="col-span-12 flex flex-col gap-2 mt-2">
          <FloatLabel variant="on">
            <InputText
              id="new_webhook_url"
              v-model="newWebhookUrl"
              type="text"
              fluid
              size="small"
            />
            <label for="new_webhook_url">URL do Webhook (n8n)</label>
          </FloatLabel>
          <Button
            label="Adicionar Webhook"
            icon="pi pi-plus"
            severity="info"
            size="small"
            @click="addWebhook"
            :disabled="!newWebhookUrl.trim()"
            class="w-full"
          />
        </div>
      </div>

      <div class="col-span-12 grid grid-cols-12 gap-4" v-show="!isEditing">
        <div
          class="col-span-12 flex items-center gap-2 text-gray-700 text-base font-semibold mt-4 mb-1 border-b border-gray-200 pb-2"
        >
          <SquareUserRound class="w-5 h-5" /> Dados do CEO
        </div>

        <!-- Nome Completo -->
        <div class="col-span-12 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputText
              id="Nome"
              name="Nome"
              type="text"
              fluid
              v-model="initialValues.Nome"
              size="small"
            />
            <label for="Nome"
              >Nome Completo
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.Nome?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.Nome.error.message }}</Message
          >
        </div>

        <!-- CPF e Data de Nascimento na mesma linha -->
        <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputMask
              id="Cpf"
              name="Cpf"
              mask="***.***.***-**"
              type="text"
              fluid
              v-model="initialValues.Cpf"
              size="small"
            />
            <label for="Cpf"
              >CPF
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.Cpf?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.Cpf.error.message }}</Message
          >
        </div>

        <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
          <FloatLabel variant="on">
            <DatePicker
              id="DataNascimento"
              name="DataNascimento"
              fluid
              dateFormat="dd/mm/yy"
              v-model="initialValues.DataNascimento"
              size="small"
            />
            <label for="DataNascimento"
              >Data de Nascimento
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.DataNascimento?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.DataNascimento.error.message }}</Message
          >
        </div>

        <!-- Email e Telefone na mesma linha -->
        <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputText
              id="Email"
              name="Email"
              type="email"
              fluid
              v-model="initialValues.Email"
              size="small"
            />
            <label for="Email"
              >Email
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.Email?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.Email.error.message }}</Message
          >
        </div>

        <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputMask
              id="Telefone"
              name="Telefone"
              mask="(99) 99999-9999"
              type="text"
              fluid
              v-model="initialValues.Telefone"
              size="small"
            />
            <label for="Telefone"
              >Telefone
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.Telefone?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.Telefone.error.message }}</Message
          >
        </div>

        <!-- Convênio -->
        <div class="col-span-12 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputText
              id="Convenio"
              name="Convenio"
              type="text"
              fluid
              v-model="initialValues.Convenio"
              size="small"
            />
            <label for="Convenio">Convênio</label>
          </FloatLabel>
          <Message
            v-if="$form.Convenio?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.Convenio.error.message }}</Message
          >
        </div>

        <!-- Senha e Função na mesma linha -->
        <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputText
              id="PasswordHash"
              name="PasswordHash"
              type="password"
              fluid
              v-model="initialValues.PasswordHash"
              size="small"
            />
            <label for="PasswordHash"
              >Senha
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.PasswordHash?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.PasswordHash.error.message }}</Message
          >
        </div>

        <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
          <FloatLabel variant="on">
            <Select
              v-model="initialValues.RoleID"
              :options="listRoles"
              optionValue="ID"
              optionLabel="Nome"
              fluid
              disabled
              size="small"
            />
            <!-- <label for="RoleID"
              >Função/Cargo
              <span class="text-red-500">*</span>
            </label> -->
          </FloatLabel>
          <Message
            v-if="$form.RoleID?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.RoleID.error.message }}</Message
          >
        </div>
      </div>

      <div
        class="bg-red-100 border border-red-300 text-red-800 text-sm p-3 rounded-lg col-span-12 mt-2"
        v-if="isEditing"
        :class="{
          '!bg-blue-100 !border-blue-300 !text-blue-800': initialValues.Ativa,
        }"
      >
        <div class="flex justify-between items-start gap-2">
          <div v-if="initialValues.Ativa">
            <div class="font-semibold mb-1">Clínica Ativa:</div>
            <span class="text-justify font-normal">
              Ao desativar a clínica, todos os usuários vinculados a ela serão
              desativados e não poderão mais acessar o sistema.
            </span>
          </div>
          <div v-else>
            <div class="font-semibold mb-1">Clínica Inativa:</div>
            <span class="text-justify font-normal">
              Ao ativar a clínica, todos os usuários vinculados a ela serão
              ativados e poderão acessar o sistema normalmente.
            </span>
          </div>

          <div>
            <!-- <Button
              icon="pi pi-exclamation-triangle"
              severity="danger"
              size="small"
              label="Desativar"
              class="p-0 mt-1"
            /> -->
            <ToggleSwitch
              v-model="initialValues.Ativa"
              @value-change="handleToggleChange"
            />
          </div>
        </div>
      </div>

      <cite
        class="text-gray-400 text-sm col-span-12 mt-2 pt-2 border-t border-gray-100"
      >
        <span class="text-red-500">*</span> Campos obrigatórios
      </cite>
    </Form>
    <template #footer>
      <div class="flex items-center gap-2">
        <Button
          label="Salvar"
          icon="pi pi-save"
          severity="success"
          class="flex-auto"
          size="small"
          @click="confirmAddClinic()"
        ></Button>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          class="flex-auto"
          severity="contrast"
          size="small"
          text
          @click="emit('update:drawerState', false)"
        ></Button>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";
import { computed, inject, onMounted, ref, watch, type Ref } from "vue";
//@ts-ignore
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { Hospital, Loader2, SquareUserRound, Webhook } from "lucide-vue-next";
import {
  Checkbox,
  DatePicker,
  FloatLabel,
  InputMask,
  InputText,
  Message,
  Select,
  ToggleSwitch,
  useToast,
} from "primevue";
import Button from "primevue/button";
import Drawer from "primevue/drawer";
import { z } from "zod";
import { ClinicsServices } from "../../../../services/clinics/ClinicsServices";
import {
  PlansServices,
  type IPlan,
} from "../../../../services/plans/PlansServices";
import { RolesServices } from "../../../../services/roles/RolesServices";
import { UsersServices } from "../../../../services/user/UsersServices";
import {
  WebhooksService,
  type IWebhook,
} from "../../../../services/webhooks/WebhooksService";
import { useUserStore } from "../../../../stores/user";
import { DateUtils } from "../../../../utils/DateUtils";

const userStore = useUserStore();
const confirm = useConfirm();
const toast = useToast();
const props = defineProps<{
  drawerState: boolean;
  inEdition: any | null;
}>();

const emit = defineEmits<{
  (e: "update:drawerState", value: boolean): void;
  (e: "saveClinic", clinic: any): void;
}>();

interface Role {
  ID: string;
  Nome: string;
  Permissoes: any | null;
  Hierarquia: number;
}
const globalLoading = inject<Ref<boolean>>("globalLoading");
const isEditing = ref(false);
const formClinic = ref(null);
const old_assinatura_id = ref("");
const listRoles = ref<Role[]>([]);
const listPlans = ref<IPlan[]>([]);

// Webhooks
const webhooks = ref<IWebhook[]>([]);
const loadingWebhooks = ref(false);
const newWebhookUrl = ref("");
const initialValues = ref({
  nome_clinica: "",
  Ativa: false,
  Cnpj: "",
  Endereco: "",
  assinatura_id: "",
  plano_custom: false,
  plano_id: "",
  plano_custom_dados: {
    nome: "",
    limite_conversas: 0,
    periodo_dias: 0,
    valor: 0,
    recorrente: false,
    data_inicio: null as Date | null,
  },
  Email: "",
  Nome: "",
  Cpf: "",
  DataNascimento: null as Date | null, // Mantém Date para o DatePicker
  Telefone: "",
  Convenio: "",
  PasswordHash: "",
  RoleID: "",
  ClinicaID: "",
});

const resolver = computed(() =>
  zodResolver(
    z.object({
      nome_clinica: z
        .string()
        .min(1, { message: "Nome da clínica é obrigatório." }),
      Cnpj: z
        .string()
        .min(1, { message: "CNPJ é obrigatório." })
        .transform((val) => val.replace(/\D/g, ""))
        .refine((val) => /^\d{14}$/.test(val), {
          message: "CNPJ inválido. Deve conter 14 dígitos.",
        }),
      Endereco: z.string().min(1, { message: "Endereço é obrigatório." }),
      Email: z
        .string()
        .email({ message: "Email inválido." })
        .min(1, { message: "Email é obrigatório." }),
      Nome: z
        .string()
        .min(1, { message: "Nome é obrigatório." })
        .refine((val) => val.trim().split(/\s+/).length > 1, {
          message: "Informe o nome completo.",
        }),
      Cpf: z
        .string()
        .min(1, { message: "CPF é obrigatório." })
        .transform((val) => val.replace(/\D/g, ""))
        .refine((val) => /^\d{11}$/.test(val), {
          message: "CPF inválido. Deve conter 11 dígitos.",
        }),
      DataNascimento: z
        .date()
        .min(new Date("1900-01-01"), {
          message: "Data de nascimento inválida.",
        })
        .max(new Date(), {
          message: "Data de nascimento não pode ser futura.",
        }),
      Telefone: z
        .string()
        .min(1, { message: "Telefone é obrigatório." })
        .transform((val) => val.replace(/\D/g, ""))
        .refine((val) => [10, 11, 12, 13].includes(val.length), {
          message: "Telefone inválido. Deve conter 10, 11, 12 ou 13 dígitos.",
        }),
      Convenio: z.string(),
      // .min(1, { message: "Convênio é obrigatório." }),
      PasswordHash: isEditing.value
        ? z
            .string()
            .min(6, { message: "Senha deve ter no mínimo 6 caracteres." })
            .max(48, { message: "Senha deve ter no máximo 48 caracteres." })
            .optional()
        : z
            .string()
            .min(6, { message: "Senha deve ter no mínimo 6 caracteres." })
            .max(48, { message: "Senha deve ter no máximo 48 caracteres." }),
      assinatura_id: z
        .string()
        .min(1, { message: "ID da assinatura é obrigatório." }),
    })
  )
);

const confirmAddClinic = () => {
  confirm.require({
    message: "Tem certeza que deseja salvar esta clínica?",
    header: "Confirmação",
    icon: "pi pi-info-circle",
    rejectProps: {
      label: "Cancelar",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Salvar",
      severity: "success",
    },
    accept: () => {
      if (isEditing.value) {
        editClinicOnly();
        return;
      }
      formClinic.value?.submit();
    },
    reject: () => {
      toast.add({
        severity: "info",
        summary: "Cancelado",
        detail: "Operação cancelada",
        life: 3000,
      });
    },
  });
};

function handleToggleChange(value: boolean) {
  const action = value ? "ativar" : "desativar";
  confirm.require({
    message: `Tem certeza que deseja ${action} a clínica?`,
    header: "Confirmação",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancelar",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Confirmar",
      severity: "success",
    },
    accept: () => {
      initialValues.value.Ativa = value;
    },
    reject: () => {
      // Reverter o valor do toggle switch
      initialValues.value.Ativa = !value;
    },
  });
}

function handlePlanChange(event: any) {
  const selectedPlan = event.value;
  const customPlan = listPlans.value.find((plan) =>
    plan.nome?.toUpperCase().includes("PERSONALIZADO")
  );
  if (!!customPlan && customPlan?.id === selectedPlan) {
    initialValues.value.plano_custom = true;
  } else {
    initialValues.value.plano_custom = false;
  }
}

async function editClinicOnly() {
  try {
    globalLoading.value = true;
    const clinic = {
      nome_clinica: initialValues.value.nome_clinica,
      Cnpj: initialValues.value.Cnpj.replace(/\D/g, ""),
      Endereco: initialValues.value.Endereco,
      plano_id: initialValues.value.plano_id,
      plano_custom: initialValues.value.plano_custom,
      plano_custom_dados: null,
      is_active: initialValues.value.Ativa,
    };
    if (old_assinatura_id.value !== initialValues.value.assinatura_id) {
      clinic["assinatura_id"] = initialValues.value.assinatura_id;
    }

    if (initialValues.value.plano_custom) {
      clinic.plano_custom_dados = {
        ...initialValues.value.plano_custom_dados,
        data_inicio: initialValues.value.plano_custom_dados.data_inicio
          ? DateUtils.formatDatetoISOGlobalTimezone(
              initialValues.value.plano_custom_dados.data_inicio
            )
          : null,
      };
    } else {
      clinic.plano_custom_dados = listPlans.value.find(
        (plan) => plan.id === initialValues.value.plano_id
      ) as any;
      clinic.plano_custom_dados = {
        ...clinic.plano_custom_dados,
        recorrente: initialValues.value.plano_custom_dados.recorrente,
        data_inicio: initialValues.value.plano_custom_dados.data_inicio
          ? DateUtils.formatDatetoISOGlobalTimezone(
              initialValues.value.plano_custom_dados.data_inicio
            )
          : null,
      };
      delete clinic.plano_custom_dados.id;
    }

    const responseClinic = await ClinicsServices.putClinic(
      props.inEdition?.ID,
      clinic
    );

    if (responseClinic.status >= 200 && responseClinic.status < 300) {
      emit("saveClinic", responseClinic.data);
      emit("update:drawerState", false);
    } else {
      return;
    }
  } catch (error) {
    console.error("Erro ao salvar clínica:", error);
  } finally {
    globalLoading.value = false;
  }
}

async function saveClinic({ valid, values, states }) {
  if (!valid) {
    return;
  }

  try {
    globalLoading.value = true;
    const clinic = {
      nome_clinica: initialValues.value.nome_clinica,
      Cnpj: initialValues.value.Cnpj.replace(/\D/g, ""),
      Endereco: initialValues.value.Endereco,
      assinatura_id: initialValues.value.assinatura_id,
      plano_id: initialValues.value.plano_id,
      plano_custom: initialValues.value.plano_custom,
      plano_custom_dados: null,
    };

    if (initialValues.value.plano_custom) {
      clinic.plano_custom_dados = {
        ...initialValues.value.plano_custom_dados,
        data_inicio: initialValues.value.plano_custom_dados.data_inicio
          ? DateUtils.formatDatetoISOGlobalTimezone(
              initialValues.value.plano_custom_dados.data_inicio
            )
          : null,
      };
    } else {
      clinic.plano_custom_dados = listPlans.value.find(
        (plan) => plan.id === initialValues.value.plano_id
      ) as any;
      clinic.plano_custom_dados = {
        ...clinic.plano_custom_dados,
        recorrente: initialValues.value.plano_custom_dados.recorrente,
        data_inicio: initialValues.value.plano_custom_dados.data_inicio
          ? DateUtils.formatDatetoISOGlobalTimezone(
              initialValues.value.plano_custom_dados.data_inicio
            )
          : null,
      };
      delete clinic.plano_custom_dados.id;
    }

    let responseClinic: any;
    if (isEditing.value) {
      responseClinic = await ClinicsServices.putClinic(
        props.inEdition?.ID,
        clinic
      );
    } else {
      responseClinic = await ClinicsServices.postClinic(clinic);
    }

    if (responseClinic.status >= 200 && responseClinic.status < 300) {
      const user = {
        Nome: initialValues.value.Nome,
        Cpf: initialValues.value.Cpf.replace(/\D/g, ""),
        DataNascimento: initialValues.value.DataNascimento
          ? DateUtils.formatDateBRtoISO(initialValues.value.DataNascimento)
          : "",
        Telefone: initialValues.value.Telefone.replace(/\D/g, ""),
        Email: initialValues.value.Email,
        Convenio: initialValues.value.Convenio,
        PasswordHash: initialValues.value.PasswordHash,
        RoleID: initialValues.value.RoleID,
        ClinicaID: responseClinic.data?.data?.id,
      };
      const responseUser = await UsersServices.postUser(user);
      if (responseUser.status >= 200 && responseUser.status < 300) {
        // Sucesso
        // toast.add({
        //   severity: "success",
        //   summary: "Sucesso",
        //   detail: "Clínica e CEO adicionados com sucesso!",
        //   life: 3000,
        // });
        emit("saveClinic", responseClinic.data);
        emit("update:drawerState", false);
      }
    } else {
      return;
    }
  } catch (error) {
    console.error("Erro ao salvar clínica:", error);
  } finally {
    globalLoading.value = false;
  }
}

async function fetchPlans() {
  try {
    const response = await PlansServices.getPlans();
    if (response.status === 200) {
      listPlans.value = [
        ...response.data?.data.map((plan) => ({
          ...plan,
          nome: plan.nome?.includes("Custom")
            ? "Plano Personalizado"
            : plan.nome,
        })),
      ];
    } else {
      console.error("Erro ao carregar planos");
    }
  } catch (error) {
    console.error("Erro ao carregar planos:", error);
  }
}

async function fetchRoles() {
  try {
    const user_id = userStore.user?.ID;
    const roles = await RolesServices.getRoles({ id: user_id });
    if (roles.status === 200) {
      listRoles.value = roles.data?.data;
      initialValues.value.RoleID =
        listRoles.value.find((role) => role.Nome === "CEO/DONO")?.ID || "";
    } else {
      console.error("Erro ao carregar cargos");
    }
  } catch (error) {
    console.error("Erro ao carregar cargos:", error);
  }
}

// Funções de gerenciamento de webhooks
async function fetchWebhooks() {
  if (!initialValues.value.ClinicaID) return;

  try {
    loadingWebhooks.value = true;
    const response = await WebhooksService.listWebhooks(
      initialValues.value.ClinicaID,
      1,
      3
    );

    if (response.status === 200) {
      // A API pode retornar tanto um array direto quanto um objeto com a propriedade webhooks
      const data = response.data?.data;
      webhooks.value = Array.isArray(data) ? data : data?.webhooks || [];

      console.log("Webhooks carregados:", webhooks.value);
    } else {
      console.error("Erro ao carregar webhooks");
    }
  } catch (error) {
    console.error("Erro ao carregar webhooks:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível carregar os webhooks.",
      life: 3000,
    });
  } finally {
    loadingWebhooks.value = false;
  }
}

async function addWebhook() {
  if (!newWebhookUrl.value.trim() || !initialValues.value.ClinicaID) return;

  // Validação básica de URL
  try {
    new URL(newWebhookUrl.value);
  } catch {
    toast.add({
      severity: "error",
      summary: "URL Inválida",
      detail: "Por favor, insira uma URL válida.",
      life: 3000,
    });
    return;
  }

  confirm.require({
    message: `Tem certeza que deseja adicionar este webhook? ${
      webhooks.value.some((w) => w.is_active)
        ? "O novo webhook será ativado e o webhook ativo atual será desativado automaticamente."
        : "O novo webhook será ativado automaticamente."
    }`,
    header: "Adicionar Webhook",
    icon: "pi pi-question-circle",
    rejectProps: {
      label: "Cancelar",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Adicionar",
      severity: "success",
    },
    accept: async () => {
      try {
        globalLoading.value = true;

        // Primeiro, desativar todos os webhooks ativos existentes
        const activeWebhooks = webhooks.value.filter((w) => w.is_active);
        for (const webhook of activeWebhooks) {
          await WebhooksService.deactivateWebhook(webhook.id);
        }

        // Criar o novo webhook
        const response = await WebhooksService.createWebhook({
          clinica_id: initialValues.value.ClinicaID,
          webhook_url: newWebhookUrl.value.trim(),
        });

        if (response.status >= 200 && response.status < 300) {
          const newWebhookId = response.data?.data?.id;

          // Ativar o novo webhook
          if (newWebhookId) {
            await WebhooksService.activateWebhook(newWebhookId);
          }

          toast.add({
            severity: "success",
            summary: "Sucesso",
            detail: "Webhook adicionado e ativado com sucesso!",
            life: 3000,
          });
          newWebhookUrl.value = "";
          await fetchWebhooks();
        }
      } catch (error) {
        console.error("Erro ao adicionar webhook:", error);
        toast.add({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível adicionar o webhook.",
          life: 3000,
        });
      } finally {
        globalLoading.value = false;
      }
    },
  });
}

function handleWebhookToggle(webhookId: string, newValue: boolean) {
  if (newValue) {
    activateWebhook(webhookId);
  } else {
    deactivateWebhook(webhookId);
  }
}

async function activateWebhook(webhookId: string) {
  confirm.require({
    message:
      "Ao ativar este webhook, todos os outros webhooks desta clínica serão desativados automaticamente. Deseja continuar?",
    header: "Ativar Webhook",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancelar",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Ativar",
      severity: "success",
    },
    accept: async () => {
      try {
        globalLoading.value = true;

        // Primeiro, desativar todos os webhooks ativos
        const activeWebhooks = webhooks.value.filter((w) => w.is_active);
        for (const webhook of activeWebhooks) {
          if (webhook.id !== webhookId) {
            await WebhooksService.deactivateWebhook(webhook.id);
          }
        }

        // Depois ativar o webhook selecionado
        const response = await WebhooksService.activateWebhook(webhookId);

        if (response.status >= 200 && response.status < 300) {
          toast.add({
            severity: "success",
            summary: "Sucesso",
            detail: "Webhook ativado com sucesso!",
            life: 3000,
          });
          await fetchWebhooks();
        }
      } catch (error) {
        console.error("Erro ao ativar webhook:", error);
        toast.add({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível ativar o webhook.",
          life: 3000,
        });
        await fetchWebhooks(); // Recarregar mesmo em caso de erro
      } finally {
        globalLoading.value = false;
      }
    },
    reject: () => {
      // Recarregar para reverter o toggle
      fetchWebhooks();
    },
  });
}

async function deactivateWebhook(webhookId: string) {
  confirm.require({
    message:
      "Tem certeza que deseja desativar este webhook? O chat interno da clínica ficará sem resposta do agente.",
    header: "Desativar Webhook",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancelar",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Desativar",
      severity: "danger",
    },
    accept: async () => {
      try {
        globalLoading.value = true;
        const response = await WebhooksService.deactivateWebhook(webhookId);

        if (response.status >= 200 && response.status < 300) {
          toast.add({
            severity: "success",
            summary: "Sucesso",
            detail: "Webhook desativado com sucesso!",
            life: 3000,
          });
          await fetchWebhooks();
        }
      } catch (error) {
        console.error("Erro ao desativar webhook:", error);
        toast.add({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível desativar o webhook.",
          life: 3000,
        });
      } finally {
        globalLoading.value = false;
      }
    },
    reject: () => {
      // Recarregar para reverter o toggle
      fetchWebhooks();
    },
  });
}

onMounted(async () => {
  await fetchRoles();
  await fetchPlans();
});

watch(
  () => props.drawerState,
  (newValue) => {
    if (newValue) {
      switch (props.inEdition) {
        case null:
          isEditing.value = false;
          initialValues.value = {
            nome_clinica: "",
            Ativa: false,
            Cnpj: "",
            Endereco: "",
            assinatura_id: "",
            plano_custom: false,
            plano_id: "",
            plano_custom_dados: {
              nome: "",
              limite_conversas: 0,
              periodo_dias: 0,
              valor: 0,
              recorrente: false,
              data_inicio: null as Date | null,
            },
            Email: "",
            Nome: "",
            Cpf: "",
            DataNascimento: null,
            Telefone: "",
            Convenio: "",
            PasswordHash: "",
            RoleID: listRoles.value.find((role) => role.Nome === "CEO/DONO")
              ?.ID,
            ClinicaID: "",
          };
          break;
        default:
          isEditing.value = true;
          old_assinatura_id.value = props.inEdition?.AssinaturaId || "";
          initialValues.value = {
            nome_clinica: props.inEdition?.NomeClinica || "",
            ClinicaID: props.inEdition?.ID || "",
            assinatura_id: props.inEdition?.AssinaturaId || "",
            plano_custom_dados: Object.assign(
              initialValues.value.plano_custom_dados,
              props.inEdition?.Plano
            ),
            ...props.inEdition,
          };
          if (!!initialValues.value.plano_custom_dados) {
            handlePlanChange({
              value: initialValues.value.plano_id,
            });
          }
          // Carregar webhooks da clínica em edição
          fetchWebhooks();
          break;
      }
    } else {
      isEditing.value = false;
      webhooks.value = [];
      newWebhookUrl.value = "";
      initialValues.value = {
        nome_clinica: "",
        Ativa: false,
        Cnpj: "",
        Endereco: "",
        assinatura_id: "",
        plano_custom: false,
        plano_id: "",
        plano_custom_dados: {
          nome: "",
          limite_conversas: 0,
          periodo_dias: 0,
          valor: 0,
          recorrente: false,
          data_inicio: null as Date | null,
        },
        Email: "",
        Nome: "",
        Cpf: "",
        DataNascimento: null,
        Telefone: "",
        Convenio: "",
        PasswordHash: "",
        RoleID: listRoles.value.find((role) => role.Nome === "CEO/DONO")?.ID,
        ClinicaID: "",
      };
    }
  }
);
</script>
