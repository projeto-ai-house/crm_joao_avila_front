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
import { Hospital, SquareUserRound } from "lucide-vue-next";
import {
  Checkbox,
  DatePicker,
  FloatLabel,
  InputMask,
  InputText,
  Message,
  Select,
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
const listRoles = ref<Role[]>([]);
const listPlans = ref<IPlan[]>([
  {
    id: "custom",
    nome: "Plano Personalizado",
  },
]);
const initialValues = ref({
  nome_clinica: "",
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
        .refine((val) => /^\d{10,11}$/.test(val), {
          message: "Telefone inválido. Deve conter 10 ou 11 dígitos.",
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

function handlePlanChange(event: any) {
  const selectedPlan = event.value;
  if (selectedPlan === "custom") {
    initialValues.value.plano_custom = true;
  } else {
    initialValues.value.plano_custom = false;
  }
}

async function saveClinic({ valid, values, states }) {
  if (!valid) {
    return;
  }
  console.log("Formulário válido. Salvando clínica...", initialValues.value);

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

    const responseClinic = await ClinicsServices.postClinic(clinic);
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
      listPlans.value = [...response.data?.data, ...listPlans.value];
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
          console.log("props.inEdition:", props.inEdition);

          initialValues.value = {
            nome_clinica: props.inEdition?.NomeClinica || "",
            Nome: props.inEdition?.Donos[0].nome_completo || "",
            Cpf: props.inEdition?.Donos[0].cpf || "",
            DataNascimento: props.inEdition?.Donos[0].data_nascimento
              ? new Date(
                  props.inEdition?.Donos[0].data_nascimento
                ).toISOString()
              : null,
            Telefone: props.inEdition?.Donos[0].telefone || "",
            Email: props.inEdition?.Donos[0].email || "",
            Convenio: props.inEdition?.Donos[0].convenio || "",
            ClinicaID: props.inEdition?.ID || "",
            plano_custom_dados: props.inEdition?.Plano,
            ...props.inEdition,
          };
          console.log("Valores iniciais para edição:", initialValues.value);

          break;
      }
    } else {
      isEditing.value = false;
      initialValues.value = {
        nome_clinica: "",
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
