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
      <!-- INIT: Clinica -->
      <div class="col-span-12 flex items-center gap-1 text-gray-500 text-sm">
        <Hospital class="w-4 h-4" /> Dados da Clínica
      </div>
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
          <label for="nome_clinica">Nome</label>
        </FloatLabel>
        <Message
          v-if="$form.nome_clinica?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.nome_clinica.error.message }}</Message
        >
      </div>
      <div class="col-span-12 flex flex-col gap-1">
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
          <label for="Cnpj">CNPJ</label>
        </FloatLabel>
        <Message
          v-if="$form.Cnpj?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.Cnpj.error.message }}</Message
        >
      </div>
      <div class="col-span-12 flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputText
            id="Endereco"
            name="Endereco"
            type="text"
            fluid
            v-model="initialValues.Endereco"
            size="small"
          />
          <label for="Endereco">Endereço</label>
        </FloatLabel>
        <Message
          v-if="$form.Endereco?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.Endereco.error.message }}</Message
        >
      </div>
      <!-- END: Clinica -->

      <!-- INIT: CEO -->
      <div
        class="col-span-12 flex items-center gap-1 text-gray-500 text-sm mt-4"
      >
        <SquareUserRound class="w-4 h-4" /> Dados CEO
      </div>
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
          <label for="Nome">Nome</label>
        </FloatLabel>
        <Message
          v-if="$form.Nome?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.Nome.error.message }}</Message
        >
      </div>
      <div class="col-span-12 flex flex-col gap-1">
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
          <label for="Cpf">CPF</label>
        </FloatLabel>
        <Message
          v-if="$form.Cpf?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.Cpf.error.message }}</Message
        >
      </div>
      <div class="col-span-12 flex flex-col gap-1">
        <FloatLabel variant="on">
          <DatePicker
            id="DataNascimento"
            name="DataNascimento"
            fluid
            dateFormat="dd/mm/yy"
            v-model="initialValues.DataNascimento"
            size="small"
          />
          <label for="DataNascimento">Data de Nascimento</label>
        </FloatLabel>
        <Message
          v-if="$form.DataNascimento?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.DataNascimento.error.message }}</Message
        >
      </div>
      <div class="col-span-12 flex flex-col gap-1">
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
          <label for="Telefone">Telefone</label>
        </FloatLabel>
        <Message
          v-if="$form.Telefone?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.Telefone.error.message }}</Message
        >
      </div>
      <div class="col-span-12 flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputText
            id="Email"
            name="Email"
            type="email"
            fluid
            v-model="initialValues.Email"
            size="small"
          />
          <label for="Email">Email</label>
        </FloatLabel>
        <Message
          v-if="$form.Email?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.Email.error.message }}</Message
        >
      </div>
      <div class="col-span-12 flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputText
            id="Convenio"
            name="Convenio"
            type="text"
            fluid
            v-model="initialValues.Convenio"
            size="small"
            disabled
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
          <label for="PasswordHash">Senha</label>
        </FloatLabel>
        <Message
          v-if="$form.PasswordHash?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.PasswordHash.error.message }}</Message
        >
      </div>
      <div class="col-span-12 flex flex-col gap-1">
        <FloatLabel variant="on">
          <!-- <InputText
            id="RoleID"
            name="RoleID"
            type="text"
            fluid
            v-model="initialValues.RoleID"
            size="small"
          /> -->
          <Select
            v-model="initialValues.RoleID"
            :options="listRoles"
            optionValue="value"
            optionLabel="label"
            fluid
          />
          <label for="RoleID">ID da Função</label>
        </FloatLabel>
        <Message
          v-if="$form.RoleID?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.RoleID.error.message }}</Message
        >
      </div>

      <!-- END: CEO -->
    </Form>
    <template #footer>
      <div class="flex items-center gap-2">
        <Button
          label="Salvar"
          icon="pi pi-save"
          severity="success"
          class="flex-auto"
          size="small"
          @click="formClinic?.submit()"
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
import { onMounted, ref, watch } from "vue";
//@ts-ignore
import { zodResolver } from "@primevue/forms/resolvers/zod";
import Drawer from "primevue/drawer";
import Button from "primevue/button";
import { ClinicsServices } from "../../../services/clinics/ClinicsServices";
import { z } from "zod";
import { Form } from "@primevue/forms";
import {
  DatePicker,
  FloatLabel,
  InputMask,
  InputText,
  Message,
  Select,
  useToast,
} from "primevue";
import { Hospital, SquareUserRound } from "lucide-vue-next";
import { RolesServices } from "../../../services/roles/RolesServices";
import { useUserStore } from "../../../stores/user";
import { UsersServices } from "../../../services/user/UsersServices";
import { DateUtils } from "../../../utils/DateUtils";

const userStore = useUserStore();
const toast = useToast();
const props = defineProps<{
  drawerState: boolean;
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
const globalLoading = ref(false);
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
  ClinicaID: "",
});

const resolver = ref(
  zodResolver(
    z.object({
      nome_clinica: z
        .string()
        .min(1, { message: "Nome da clínica é obrigatório." }),
      Cnpj: z
        .string()
        .min(1, { message: "CNPJ é obrigatório." })
        .regex(/^\d{14}$/, {
          message: "CNPJ inválido. Deve conter 14 dígitos.",
        }),
      Endereco: z.string().min(1, { message: "Endereço é obrigatório." }),
      Email: z
        .string()
        .email({ message: "Email inválido." })
        .min(1, { message: "Email é obrigatório." }),
      Nome: z.string().min(1, { message: "Nome é obrigatório." }),
      Cpf: z
        .string()
        .min(1, { message: "CPF é obrigatório." })
        .regex(/^\d{11}$/, {
          message: "CPF inválido. Deve conter 11 dígitos numéricos.",
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
        .regex(/^\d{10,11}$/, {
          message: "Telefone inválido. Deve conter 10 ou 11 dígitos numéricos.",
        }),
      Convenio: z.string(),
      // .min(1, { message: "Convênio é obrigatório." }),
      PasswordHash: z
        .string()
        .min(6, { message: "Senha deve ter no mínimo 6 caracteres." })
        .max(48, { message: "Senha deve ter no máximo 48 caracteres." }),
      // RoleID: z.string().min(1, { message: "ID da função é obrigatório." }),
      // ClinicaID: z.string().min(1, { message: "ID da clínica é obrigatório." }),
      // senha: z
      //   .string()
      //   .min(6, { message: "Minimo de 8 caracteres" })
      //   .max(48, { message: "Máximo de 48 caracteres." }),
      // .refine((value) => /[a-z]/.test(value), {
      //   message: "Deve conter uma letra minúscula.",
      // })
      // .refine((value) => /[A-Z]/.test(value), {
      //   message: "Deve conter uma letra maiúscula.",
      // })
      // .refine((value) => /d/.test(value), {
      //   message: "Deve conter um número.",
      // }),
    })
  )
);

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
    };
    const responseClinic = await ClinicsServices.postClinic(clinic);
    if (responseClinic.status >= 200 && responseClinic.status < 300) {
      const user = {
        Nome: initialValues.value.Nome,
        Cpf: initialValues.value.Cpf.replace(/\D/g, ""),
        DataNascimento: initialValues.value.DataNascimento
          ? DateUtils.formatDateBRtoISO(
              initialValues.value.DataNascimento
            )
          : "",
        Telefone: initialValues.value.Telefone.replace(/\D/g, ""),
        Email: initialValues.value.Email,
        Convenio: initialValues.value.Convenio,
        PasswordHash: initialValues.value.PasswordHash,
        RoleID: initialValues.value.RoleID,
        ClinicaID: responseClinic.data.ID,
      };
      const responseUser = await UsersServices.postUser(user);
      if (responseUser.status >= 200 && responseUser.status < 300) {
        // Sucesso
      }
    } else {
      return;
    }
  } catch (error) {
    console.error("Erro ao salvar clínica:", error);
  }
}

async function fetchRoles() {
  try {
    const user_id = userStore.user?.ID;
    const roles = await RolesServices.getRoles({ id: user_id });
    if (roles.status === 200) {
      listRoles.value =
        roles.data?.data?.map((role: Role) => ({
          label: role.Nome,
          value: role.ID,
        })) || [];
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
      console.log("Drawer aberto, resetando valores iniciais.");
    }
  }
);
</script>
