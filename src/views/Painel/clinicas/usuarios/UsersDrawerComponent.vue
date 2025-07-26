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
        <span class="font-bold">Adicionar Usuário</span>
      </div>
    </template>
    <Form
      ref="formClinic"
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      @submit="saveUser"
      class="grid grid-cols-12 w-full gap-4"
    >
      <!-- SEÇÃO: DADOS PESSOAIS -->
      <div class="col-span-12 grid grid-cols-12 gap-4">
        <div
          class="col-span-12 flex items-center gap-2 text-gray-700 text-base font-semibold mt-2 mb-1 border-b border-gray-200 pb-2"
        >
          <SquareUserRound class="w-5 h-5" /> Dados Pessoais
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
      </div>
      <!-- SEÇÃO: CONTATO -->
      <div class="col-span-12 grid grid-cols-12 gap-4">
        <div
          class="col-span-12 flex items-center gap-2 text-gray-700 text-base font-semibold mt-4 mb-1 border-b border-gray-200 pb-2"
        >
          <i class="pi pi-phone w-5 h-5"></i> Informações de Contato
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
      </div>
      <!-- SEÇÃO: INFORMAÇÕES PROFISSIONAIS -->
      <div class="col-span-12 grid grid-cols-12 gap-4">
        <div
          class="col-span-12 flex items-center gap-2 text-gray-700 text-base font-semibold mt-4 mb-1 border-b border-gray-200 pb-2"
        >
          <i class="pi pi-briefcase w-5 h-5"></i> Informações Profissionais
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

        <!-- Função/Cargo -->
        <div class="col-span-12 flex flex-col gap-1">
          <FloatLabel variant="on">
            <Select
              v-model="initialValues.RoleID"
              :options="listRoles"
              optionValue="ID"
              optionLabel="Nome"
              fluid
              size="small"
              :disabled="blockRole"
            />
            <label for="RoleID"
              >Função/Cargo
              <span class="text-red-500">*</span>
            </label>
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
      <!-- SEÇÃO: ACESSO AO SISTEMA -->
      <div class="col-span-12 grid grid-cols-12 gap-4">
        <div
          class="col-span-12 flex items-center gap-2 text-gray-700 text-base font-semibold mt-4 mb-1 border-b border-gray-200 pb-2"
        >
          <i class="pi pi-lock w-5 h-5"></i> Acesso ao Sistema
        </div>

        <!-- Senha -->
        <div class="col-span-12 flex flex-col gap-1">
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
      </div>

      <cite
        class="text-gray-400 text-sm col-span-12 mt-4 pt-4 border-t border-gray-100"
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
          @click="confirmSaveUser()"
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
import { inject, onMounted, ref, watch, type Ref } from "vue";
//@ts-ignore
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { SquareUserRound } from "lucide-vue-next";
import {
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
import { useConfirm } from "primevue/useconfirm";
import { z } from "zod";
import { RolesServices } from "../../../../services/roles/RolesServices";
import { UsersServices } from "../../../../services/user/UsersServices";
import { useUserStore } from "../../../../stores/user";
import { DateUtils } from "../../../../utils/DateUtils";

const userStore = useUserStore();
const toast = useToast();
const confirm = useConfirm();
const props = defineProps<{
  drawerState: boolean;
  inEdition: any | null;
}>();

const emit = defineEmits<{
  (e: "update:drawerState", value: boolean): void;
  (e: "saveUser", clinic: any): void;
}>();

interface Role {
  ID: string;
  Nome: string;
  Permissoes: any | null;
  Hierarquia: number;
}
const blockRole = ref(false);
const globalLoading = inject<Ref<boolean>>("globalLoading");
const isEditing = ref(false);
const formClinic = ref(null);
const listRoles = ref<Role[]>([]);
const initialValues = ref({
  nome_clinica: "",
  Cnpj: "",
  Endereco: "",
  Email: "",
  Nome: "",
  Cpf: "",
  DataNascimento: null as Date | null, // Mantém Date para o DatePicker
  Telefone: "",
  Convenio: "",
  PasswordHash: "",
  RoleID: "",
  ID: "",
});

const getValidationSchema = () => {
  return z.object({
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
    DataNascimento: z.union([z.date(), z.null()]).refine(
      (val) => {
        // No modo de edição, permitir null/undefined
        if (isEditing.value && !val) return true;
        // No modo de criação, exigir uma data válida
        if (!isEditing.value && !val) return false;
        // Se tem valor, validar se é uma data válida
        if (val) {
          const minDate = new Date("1900-01-01");
          const maxDate = new Date();
          return val >= minDate && val <= maxDate;
        }
        return true;
      },
      {
        message: isEditing.value
          ? "Data de nascimento inválida."
          : "Data de nascimento é obrigatória e deve ser uma data válida.",
      }
    ),
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
      ? z.string().optional().or(z.literal(""))
      : z
          .string()
          .min(6, { message: "Senha deve ter no mínimo 6 caracteres." })
          .max(48, { message: "Senha deve ter no máximo 48 caracteres." }),
  });
};

const resolver = ref(zodResolver(getValidationSchema()));

const confirmSaveUser = () => {
  // Vamos validar manualmente usando o schema
  try {
    // Se chegou até aqui, o formulário é válido
    // Mostra o diálogo de confirmação
    confirm.require({
      message: "Tem certeza que deseja salvar este usuário?",
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
      reject: () => {},
    });
  } catch (error) {
    toast.add({
      severity: "warn",
      summary: "Formulário Inválido",
      detail: "Por favor, corrija os erros antes de continuar",
      life: 4000,
    });
  }
};

async function saveUser({ valid, values, states }) {
  console.log(initialValues.value);

  if (!valid) {
    toast.add({
      severity: "error",
      summary: "Formulário Inválido",
      detail: "Por favor, corrija os erros antes de salvar",
      life: 4000,
    });
    return;
  }
  console.log("Formulário válido. Salvando usuário...", initialValues.value);

  try {
    globalLoading.value = true;

    let responseUser: any;
    if (isEditing.value) {
      console.log(initialValues.value);

      // Edição de usuário existente
      responseUser = await UsersServices.putUser({
        Usuario: {
          nome_completo: initialValues.value.Nome,
          Cpf: initialValues.value.Cpf.replace(/\D/g, ""),
          data_nascimento: initialValues.value.DataNascimento
            ? DateUtils.formatDateToISOWithTimezone(
                initialValues.value.DataNascimento
              )
            : "",
          Convenio: initialValues.value.Convenio,
          Email: initialValues.value.Email,
          Telefone: initialValues.value.Telefone.replace(/\D/g, ""),
          ID: initialValues.value.ID,
          password_hash: initialValues.value.PasswordHash,
        },
        Role: {
          role_id: initialValues.value.RoleID,
        },
      });
    } else {
      // Criação de novo usuário
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
      };
      responseUser = await UsersServices.postUser(user);
    }
    if (responseUser.status >= 200 && responseUser.status < 300) {
      emit("saveUser", responseUser.data);
      emit("update:drawerState", false);
    }
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
  } finally {
    globalLoading.value = false;
  }
}

async function fetchRoles() {
  try {
    const user_id = userStore.user?.ID;
    const roles = await RolesServices.getRoles({ id: user_id });
    if (roles.status === 200) {
      listRoles.value = roles.data?.data;
      // initialValues.value.RoleID =
      // listRoles.value.find((role) => role.Nome === "CEO/DONO")?.ID || "";
    } else {
      console.error("Erro ao carregar cargos");
    }
  } catch (error) {
    console.error("Erro ao carregar cargos:", error);
  }
}

onMounted(async () => {
  await fetchRoles();
});

watch(
  () => props.drawerState,
  (newValue) => {
    if (newValue) {
      // console.log("Drawer aberto, resetando valores iniciais.");
      // console.log(props.inEdition);

      isEditing.value = !!props.inEdition;
      console.log("Is Editing:", props.inEdition);

      if (isEditing.value) {
        initialValues.value = {
          ...props.inEdition,
          Nome: props.inEdition.NomeCompleto,
          PasswordHash: "",
          RoleID: props.inEdition.Role?.id || "",
          DataNascimento: props.inEdition.DataNascimento
            ? new Date(props.inEdition.DataNascimento)
            : null,
        };
        blockRole.value = props.inEdition.BlockRole || false;
        if (blockRole.value) {
          initialValues.value.RoleID = listRoles.value.find(
            (role) => role.Nome === "CEO/DONO"
          )?.ID;
        }
      }

      // Atualiza o resolver baseado no estado de edição
      resolver.value = zodResolver(getValidationSchema());
    } else {
      isEditing.value = false;
      initialValues.value = {
        nome_clinica: "",
        Cnpj: "",
        Endereco: "",
        Email: "",
        Nome: "",
        Cpf: "",
        DataNascimento: null,
        Telefone: "",
        Convenio: "",
        PasswordHash: "",
        RoleID: listRoles.value.find((role) => role.Nome === "CEO/DONO")?.ID,
        ID: "",
      };
    }
  }
);

// Watcher para atualizar o resolver quando isEditing mudar
watch(
  () => isEditing.value,
  () => {
    resolver.value = zodResolver(getValidationSchema());
  }
);
</script>
