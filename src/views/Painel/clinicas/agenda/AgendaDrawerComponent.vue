<template>
  <Drawer
    v-model:visible="props.drawerState"
    header="Adicionar Agendamento"
    position="right"
    class="!w-full md:!w-80 lg:!w-[30rem]"
    @update:visible="emit('update:drawerState', $event)"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <span class="font-bold">{{
          isEditing ? "Editar Agendamento" : "Novo Agendamento"
        }}</span>
      </div>
    </template>
    <Form
      ref="formAgendamento"
      v-slot="$form"
      :key="formKey"
      :initialValues="initialValues"
      :resolver="resolver"
      @submit="saveAppointment"
      class="grid grid-cols-12 w-full gap-4"
    >
      <!-- SEÇÃO: DADOS DO AGENDAMENTO -->
      <div class="col-span-12 grid grid-cols-12 gap-4">
        <div
          class="col-span-12 flex items-center gap-2 text-gray-700 text-base font-semibold mt-2 mb-1 border-b border-gray-200 pb-2"
        >
          <Calendar class="w-5 h-5" /> Dados do Agendamento
        </div>

        <!-- Título -->
        <div class="col-span-12 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputText
              id="titulo"
              name="titulo"
              type="text"
              fluid
              size="small"
              v-model="preservedValues.titulo"
            />
            <label for="titulo"
              >Título
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.titulo?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.titulo.error.message }}</Message
          >
        </div>

        <!-- Data e Hora na mesma linha -->
        <div class="col-span-12 md:col-span-12 flex flex-col gap-1">
          <FloatLabel variant="on">
            <DatePicker
              id="data"
              name="data"
              fluid
              dateFormat="dd/mm/yy"
              size="small"
              v-model="preservedValues.data"
            />
            <label for="data"
              >Data
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.data?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.data.error.message }}</Message
          >
        </div>

        <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
          <FloatLabel variant="on">
            <Select
              id="hora"
              name="hora"
              :options="horariosDisponiveis"
              optionValue="value"
              optionLabel="label"
              fluid
              size="small"
              v-model="preservedValues.hora"
            />
            <label for="hora"
              >Hora
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.hora?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.hora.error.message }}</Message
          >
        </div>

        <!-- Duração -->
        <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputNumber
              id="duracao_sec"
              name="duracao_sec"
              :min="1"
              :max="1440"
              :step="1"
              fluid
              size="small"
              showButtons
              v-model="preservedValues.duracao_sec"
            />
            <label for="duracao_sec">
              Duração (minutos)
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.duracao_sec?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.duracao_sec.error.message }}</Message
          >
        </div>

        <!-- Médico -->
        <div class="col-span-12 flex flex-col gap-1">
          <FloatLabel variant="on">
            <Select
              name="MedicoID"
              :options="Array.isArray(listMedicos) ? listMedicos : []"
              optionValue="ID"
              optionLabel="Nome"
              fluid
              size="small"
              v-model="preservedValues.MedicoID"
            />
            <label for="MedicoID"
              >Médico
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.MedicoID?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.MedicoID.error.message }}</Message
          >
        </div>

        <!-- Status (apenas durante edição) -->
        <div v-if="isEditing" class="col-span-12 flex flex-col gap-1">
          <FloatLabel variant="on">
            <Select
              name="status"
              :options="statusOptions"
              optionValue="value"
              optionLabel="label"
              fluid
              size="small"
              v-model="preservedValues.status"
            />
            <label for="status"
              >Status
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.status?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.status.error.message }}</Message
          >
        </div>
      </div>

      <!-- SEÇÃO: DADOS DO PACIENTE -->
      <div class="col-span-12 grid grid-cols-12 gap-4">
        <div
          class="col-span-12 flex items-center gap-2 text-gray-700 text-base font-semibold mt-4 mb-1 border-b border-gray-200 pb-2"
        >
          <User class="w-5 h-5" /> Dados do Paciente
        </div>

        <!-- Buscar Paciente Existente (apenas ao criar novo agendamento) -->
        <div v-if="!isEditing" class="col-span-12">
          <div class="flex flex-col gap-2">
            <label class="text-sm text-gray-600">
              Buscar paciente cadastrado (opcional)
            </label>
            <div class="flex gap-2">
              <InputText
                id="busca_paciente"
                v-model="buscaPaciente"
                type="text"
                fluid
                size="small"
                placeholder="Digite o CPF do paciente"
                @keyup.enter="buscarPaciente"
                :disabled="loadingPaciente"
                class="flex-1"
              />
              <Button
                icon="pi pi-search"
                severity="secondary"
                size="small"
                @click="buscarPaciente"
                :loading="loadingPaciente"
                :disabled="!buscaPaciente || loadingPaciente"
              />
              <Button
                v-if="pacienteSelecionado"
                icon="pi pi-times"
                severity="danger"
                size="small"
                outlined
                @click="limparPaciente"
                v-tooltip.top="'Desvincular paciente'"
              />
            </div>
            <div
              v-if="pacienteSelecionado"
              class="bg-green-50 border border-green-200 rounded-md p-2 flex items-center gap-2"
            >
              <i class="pi pi-check-circle text-green-600"></i>
              <span class="text-sm text-green-700">
                <strong>Paciente vinculado:</strong>
                {{ pacienteSelecionado.nome_completo }} -
                CPF: {{ formatarCPF(pacienteSelecionado.cpf) }}
              </span>
            </div>
            <Message
              v-if="erroBuscaPaciente"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ erroBuscaPaciente }}
            </Message>
          </div>
        </div>

        <!-- Nome do Paciente -->
        <div class="col-span-12 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputText
              id="Nome_paciente"
              name="Nome_paciente"
              type="text"
              fluid
              size="small"
            />
            <label for="Nome_paciente"
              >Nome do Paciente
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.Nome_paciente?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.Nome_paciente.error.message }}</Message
          >
        </div>

        <!-- Telefone de Contato e Data de Nascimento na mesma linha -->
        <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputMask
              id="telefone_contato"
              name="telefone_contato"
              :mask="dynamicMask"
              type="text"
              fluid
              size="small"
            />
            <label for="telefone_contato"
              >Telefone de Contato
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.telefone_contato?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.telefone_contato.error.message }}
          </Message>
        </div>

        <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
          <FloatLabel variant="on">
            <DatePicker
              id="data_nascimento"
              name="data_nascimento"
              fluid
              dateFormat="dd/mm/yy"
              size="small"
            />
            <label for="data_nascimento">
              Data de Nascimento
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$form.data_nascimento?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.data_nascimento.error.message }}
          </Message>
        </div>

        <!-- Convênio -->
        <div class="col-span-12 flex flex-col gap-1">
          <FloatLabel variant="on">
            <InputText
              id="convenio"
              name="convenio"
              type="text"
              fluid
              size="small"
            />
            <label for="convenio">Convênio</label>
          </FloatLabel>
          <Message
            v-if="$form.convenio?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.convenio.error.message }}</Message
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
          @click="confirmSaveAgendamento()"
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
import {
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type Ref,
} from "vue";
//@ts-ignore
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import dayjs from "dayjs";
import { Calendar, User } from "lucide-vue-next";
import {
  DatePicker,
  FloatLabel,
  InputMask,
  InputNumber,
  InputText,
  Message,
  Select,
  useToast,
} from "primevue";
import Button from "primevue/button";
import Drawer from "primevue/drawer";
import { useConfirm } from "primevue/useconfirm";
import { z } from "zod";
import { AppointmentsServices } from "../../../../services/appointments/AppointmentsServices";
import { PatientsServices, type IPatient } from "../../../../services/patients/PatientsServices";
import { UserLinksServices } from "../../../../services/user/UserLinksServices";
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
  (e: "saveAgendamento", agendamento: any): void;
}>();

interface Medico {
  ID: string;
  Nome: string;
}

const globalLoading = inject<Ref<boolean>>("globalLoading");
const isEditing = ref(false);
const appointmentId = ref<string | null>(null);
const formAgendamento = ref(null);
const telefoneInterval = ref<number | null>(null);
const listMedicos = ref<Medico[]>([]);
const oldDate = ref<Date | null>(null);
const dynamicMask = ref("(99) 99999-9999");
const formKey = ref(0); // Key para forçar remontagem do formulário

// Refs para busca de paciente
const buscaPaciente = ref("");
const pacienteSelecionado = ref<IPatient | null>(null);
const loadingPaciente = ref(false);
const erroBuscaPaciente = ref("");

// Refs para preservar valores de agendamento durante vinculação de paciente
const preservedValues = ref({
  titulo: "",
  data: null as Date | null,
  hora: "",
  duracao_sec: null as number | null,
  MedicoID: "",
  convenio: "",
  status: "",
});

const horariosDisponiveis = ref([
  { label: "08:00", value: "08:00" },
  { label: "08:30", value: "08:30" },
  { label: "09:00", value: "09:00" },
  { label: "09:30", value: "09:30" },
  { label: "10:00", value: "10:00" },
  { label: "10:30", value: "10:30" },
  { label: "11:00", value: "11:00" },
  { label: "11:30", value: "11:30" },
  { label: "12:00", value: "12:00" },
  { label: "12:30", value: "12:30" },
  { label: "13:00", value: "13:00" },
  { label: "13:30", value: "13:30" },
  { label: "14:00", value: "14:00" },
  { label: "14:30", value: "14:30" },
  { label: "15:00", value: "15:00" },
  { label: "15:30", value: "15:30" },
  { label: "16:00", value: "16:00" },
  { label: "16:30", value: "16:30" },
  { label: "17:00", value: "17:00" },
]);

const statusOptions = ref([
  { label: "Ativo", value: "ATIVO" },
  { label: "Cancelado", value: "CANCELADO" },
  { label: "Confirmado", value: "CONFIRMADO" },
]);

const initialValues = ref({
  titulo: "AGENDAMENTO",
  convenio: "",
  Nome_paciente: "",
  telefone_contato: "",
  data: null as Date | null,
  hora: "" as string,
  duracao_sec: 30 as number | null,
  data_nascimento: null as Date | null,
  MedicoID: "",
  status: "",
});

const maskLiterals: { [key: number]: string } = {
  10: "(99) 9999-9999", // Telefone fixo
  11: "(99) 99999-9999", // Celular
  12: "99 (99) 9999-9999", // Telefone fixo com código do país
  13: "99 (99) 99999-9999", // Celular com código do país
};

const getValidationSchema = () => {
  // Se houver paciente vinculado, os campos do paciente são opcionais
  const temPacienteVinculado = !!pacienteSelecionado.value;

  const baseSchema = {
    titulo: z.string().min(1, { message: "Título é obrigatório." }),
    convenio: z.string(),
    // Nome do paciente: obrigatório apenas se não houver paciente vinculado
    Nome_paciente: temPacienteVinculado
      ? z.string()
      : z
          .string()
          .min(1, { message: "Nome do paciente é obrigatório." })
          .refine((val) => val.trim().split(/\s+/).length > 1, {
            message: "Informe o nome completo do paciente.",
          }),
    // Telefone: obrigatório apenas se não houver paciente vinculado
    telefone_contato: temPacienteVinculado
      ? z.string()
      : z
          .string()
          .min(1, { message: "Telefone de contato é obrigatório." })
          .transform((val) => val.replace(/\D/g, ""))
          .refine((val) => [10, 11, 12, 13].includes(val.length), {
            message: "Telefone inválido. Deve conter 10, 11, 12 ou 13 dígitos.",
          }),
    // Validação de data dinâmica baseada no modo de edição
    data: isEditing.value
      ? z.date() // Permite qualquer data quando editando
      : z.date().min(new Date(new Date().setHours(0, 0, 0, 0)), {
          message: "Data não pode ser anterior ao dia atual.",
        }),
    hora: z.string().min(1, { message: "Hora é obrigatória." }),
    duracao_sec: z
      .number({ invalid_type_error: "Duração é obrigatória." })
      .min(1, { message: "Duração deve ser pelo menos 1 minuto." })
      .max(1440, { message: "Duração não pode exceder 1440 minutos." }),
    // Data de nascimento: obrigatória apenas se não houver paciente vinculado
    data_nascimento: temPacienteVinculado
      ? z.date().nullable().optional()
      : z
          .date()
          .min(new Date("1900-01-01"), {
            message: "Data de nascimento inválida.",
          })
          .max(new Date(), {
            message: "Data de nascimento não pode ser futura.",
          }),
    MedicoID: z.string().min(1, { message: "Selecione um médico." }),
  };

  // Adicionar validação de status apenas quando estiver editando
  if (isEditing.value) {
    return z.object({
      ...baseSchema,
      status: z.string().min(1, { message: "Selecione um status." }),
    });
  }

  return z.object(baseSchema);
};

const resolver = ref(zodResolver(getValidationSchema()));

const confirmSaveAgendamento = () => {
  try {
    confirm.require({
      message: "Tem certeza que deseja salvar este agendamento?",
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
        formAgendamento.value?.submit();
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
async function saveAppointment({ valid, values, states }) {
  if (!valid) {
    toast.add({
      severity: "error",
      summary: "Formulário Inválido",
      detail: "Por favor, corrija os erros antes de salvar",
      life: 4000,
    });
    return;
  }
  console.log(`duracao_sec antes: ${values.duracao_sec}`);

  try {
    globalLoading.value = true;

    const appointment = {
      ...values,
      data_hora:
        values.hora && values.data
          ? DateUtils.formatDatetoISOGlobalTimezone(
              DateUtils.generateDateAndHour(values.data, values.hora)
            )
          : null,
      data_nascimento: values.data_nascimento
        ? DateUtils.formatDatetoISOGlobalTimezone(values.data_nascimento)
        : null,
      duracao_sec: values.duracao_sec ? values.duracao_sec * 60 : null,
    };
    delete appointment.hora;
    delete appointment.data;

    // Adicionar paciente_id se houver um paciente vinculado
    if (pacienteSelecionado.value?.id) {
      appointment.paciente_id = pacienteSelecionado.value.id;
    }

    // Deletar data_hora se não houver alteração
    if (
      DateUtils.formatDatetoISOGlobalTimezone(oldDate.value) ===
      DateUtils.formatDatetoISOGlobalTimezone(
        DateUtils.generateDateAndHour(values.data, values.hora)
      )
    ) {
      delete appointment.data_hora;
    }

    let response: any;
    console.log(isEditing.value, appointmentId.value);

    if (isEditing.value && appointmentId.value) {
      appointment.ID = appointmentId.value;

      // Verificar se a data é anterior ao dia atual e remover o campo se necessário
      if (appointment.data_hora) {
        const appointmentDate = new Date(appointment.data_hora);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset para início do dia

        if (appointmentDate < today) {
          delete appointment.data_hora;
        }
      }

      response = await AppointmentsServices.updateAppointment(appointment);
    } else {
      appointment.ID = null; // Ensure ID is null for new appointments
      response = await AppointmentsServices.createAppointment(appointment);
    }
    if (response.status !== 201 && response.status !== 200) {
      throw new Error("Erro ao salvar agendamento");
    }

    emit("saveAgendamento", values);
    emit("update:drawerState", false);
  } catch (error) {
    console.error("Erro ao salvar agendamento:", error);
  } finally {
    globalLoading.value = false;
  }
}

// Funções de busca de paciente
async function buscarPaciente() {
  if (!buscaPaciente.value.trim()) {
    erroBuscaPaciente.value = "Digite um CPF para buscar.";
    return;
  }

  loadingPaciente.value = true;
  erroBuscaPaciente.value = "";

  try {
    // Remove formatação do CPF se houver (mantém apenas números)
    const termo = buscaPaciente.value.replace(/\D/g, "");

    // Busca o paciente (API aceita ID ou CPF normalizado)
    const response = await PatientsServices.getPatient(termo);

    if (response.status === 200 && response.data?.data) {
      pacienteSelecionado.value = response.data.data;

      // Preencher campos automaticamente
      preencherDadosPaciente(response.data.data);

      toast.add({
        severity: "success",
        summary: "Paciente Encontrado",
        detail: `Paciente ${response.data.data.nome_completo} vinculado com sucesso.`,
        life: 3000,
      });
    } else {
      erroBuscaPaciente.value = "Paciente não encontrado.";
    }
  } catch (error: any) {
    console.error("Erro ao buscar paciente:", error);
    erroBuscaPaciente.value =
      error.response?.data?.message ||
      "Erro ao buscar paciente. Verifique o CPF e tente novamente.";
  } finally {
    loadingPaciente.value = false;
  }
}

function preencherDadosPaciente(paciente: IPatient) {
  // Copiar valores preservados de volta para initialValues (dados do agendamento)
  if (preservedValues.value.titulo) initialValues.value.titulo = preservedValues.value.titulo;
  if (preservedValues.value.data) initialValues.value.data = preservedValues.value.data;
  if (preservedValues.value.hora) initialValues.value.hora = preservedValues.value.hora;
  if (preservedValues.value.duracao_sec !== null) initialValues.value.duracao_sec = preservedValues.value.duracao_sec;
  if (preservedValues.value.MedicoID) initialValues.value.MedicoID = preservedValues.value.MedicoID;
  if (preservedValues.value.convenio) initialValues.value.convenio = preservedValues.value.convenio;
  if (isEditing.value && preservedValues.value.status) initialValues.value.status = preservedValues.value.status;

  // Atualizar campos do paciente
  initialValues.value.Nome_paciente = paciente.nome_completo;
  initialValues.value.data_nascimento = paciente.data_nascimento
    ? new Date(paciente.data_nascimento)
    : null;
  initialValues.value.telefone_contato = paciente.celular || paciente.telefone || "";

  // Preencher convênio se disponível (sobrescrever apenas se paciente tiver)
  if (paciente.convenio_1_plano) {
    initialValues.value.convenio = paciente.convenio_1_plano;
  }

  // Incrementar formKey para forçar remontagem do formulário com todos os valores
  formKey.value++;
}

function limparPaciente() {
  pacienteSelecionado.value = null;
  buscaPaciente.value = "";
  erroBuscaPaciente.value = "";

  // Copiar valores preservados de volta para initialValues (dados do agendamento)
  if (preservedValues.value.titulo) initialValues.value.titulo = preservedValues.value.titulo;
  if (preservedValues.value.data) initialValues.value.data = preservedValues.value.data;
  if (preservedValues.value.hora) initialValues.value.hora = preservedValues.value.hora;
  if (preservedValues.value.duracao_sec !== null) initialValues.value.duracao_sec = preservedValues.value.duracao_sec;
  if (preservedValues.value.MedicoID) initialValues.value.MedicoID = preservedValues.value.MedicoID;
  if (preservedValues.value.convenio) initialValues.value.convenio = preservedValues.value.convenio;
  if (isEditing.value && preservedValues.value.status) initialValues.value.status = preservedValues.value.status;

  // Limpar apenas campos do paciente
  initialValues.value.Nome_paciente = "";
  initialValues.value.data_nascimento = null;
  initialValues.value.telefone_contato = "";

  // Forçar remontagem do formulário
  formKey.value++;

  toast.add({
    severity: "info",
    summary: "Paciente Desvinculado",
    detail: "Você pode preencher os dados manualmente.",
    life: 3000,
  });
}

function formatarCPF(cpf: string): string {
  if (!cpf) return "";
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

async function fetchMedicos() {
  try {
    const currentUserRole = userStore.user?.Role;

    switch (currentUserRole) {
      case "CEO/DONO":
        try {
          const usersListResponse = await UsersServices.getUsers({
            page: 1,
            limit: 1000,
          });
          if (usersListResponse.status === 200) {
            const users = usersListResponse.data?.data?.Usuarios || [];
            listMedicos.value = users
              .filter((user: any) => user.Role?.nome === "MEDICO")
              .map((user: any) => ({
                ID: user.ID,
                Nome: user.NomeCompleto,
              }));
          } else {
            listMedicos.value = [];
          }
        } catch (error) {
          console.error("Erro ao buscar usuários:", error);
          listMedicos.value = [];
        }
        break;

      case "MEDICO":
        listMedicos.value = [
          {
            ID: userStore.user?.ID || "",
            Nome: userStore.user?.Nome || "Você",
          },
        ];
        initialValues.value.MedicoID = listMedicos.value[0]?.ID || "";
        break;

      case "SECRETARIA":
        try {
          const userLinksResponse = await UserLinksServices.getLinks();
          if (userLinksResponse.status === 200) {
            const vinculos = userLinksResponse.data?.data?.Vinculos || [];
            listMedicos.value = vinculos
              .map((vinculo: any) => vinculo.Medico)
              .map((medico: any) => ({
                ID: medico.ID,
                Nome: medico.NomeCompleto,
              }));
          } else {
            listMedicos.value = [];
          }
        } catch (error) {
          console.error("Erro ao buscar vínculos:", error);
          listMedicos.value = [];
        }
        break;

      default:
        listMedicos.value = [];
    }

    // console.log("Lista de médicos carregada:", listMedicos.value);
  } catch (error) {
    console.error("Erro ao carregar médicos:", error);
    listMedicos.value = [];
  }
}

onMounted(async () => {
  await fetchMedicos();
});

onUnmounted(() => {
  if (telefoneInterval.value) {
    clearInterval(telefoneInterval.value);
    telefoneInterval.value = null;
  }
});

watch(
  () => props.drawerState,
  async (newValue) => {
    if (newValue) {
      isEditing.value = !!props.inEdition;
      if (isEditing.value) {
        // Extrair data e hora do data_hora
        const dataHora = props.inEdition.data_hora
          ? new Date(props.inEdition.data_hora)
          : null;
        const data = dataHora
          ? new Date(
              dataHora.getFullYear(),
              dataHora.getMonth(),
              dataHora.getDate()
            )
          : null;

        const hora = dataHora
          ? `${dataHora.getHours().toString().padStart(2, "0")}:${dataHora
              .getMinutes()
              .toString()
              .padStart(2, "0")}`
          : "";

        oldDate.value = props.inEdition.data_hora
          ? new Date(props.inEdition.data_hora)
          : null;

        // Converter data_nascimento para Date
        const dataNascimento = props.inEdition.data_nascimento
          ? new Date(props.inEdition.data_nascimento)
          : null;

        dynamicMask.value =
          maskLiterals[
            (props.inEdition.telefone_contato?.replace(/\D/g, "") || "").length
          ] || "(99) 99999-9999";
        await nextTick();

        initialValues.value = {
          titulo: props.inEdition.titulo || "AGENDAMENTO",
          convenio: props.inEdition.convenio || "",
          Nome_paciente: props.inEdition.nome_cliente || "",
          telefone_contato:
            props.inEdition.telefone_contato?.replace(/\D/g, "") || "",
          data: data,
          hora: hora,
          duracao_sec: props.inEdition.duracao_sec ? props.inEdition.duracao_sec / 60 : 30, // Converter segundos para minutos
          data_nascimento: dataNascimento
            ? dayjs(dataNascimento)
                .add(dayjs(dataNascimento).utcOffset() * -1, "minutes")
                .toDate()
            : null,
          MedicoID: props.inEdition.medico_id || "",
          status: props.inEdition.status || "ATIVO",
        };

        // Sincronizar preservedValues com initialValues
        preservedValues.value = {
          titulo: initialValues.value.titulo,
          data: initialValues.value.data,
          hora: initialValues.value.hora,
          duracao_sec: initialValues.value.duracao_sec,
          MedicoID: initialValues.value.MedicoID,
          convenio: initialValues.value.convenio,
          status: initialValues.value.status,
        };

        appointmentId.value = props.inEdition.id || null;

        // Forçar remontagem do formulário
        formKey.value++;
      } else {
        // Modo de criação de novo agendamento
        initialValues.value = {
          titulo: "AGENDAMENTO",
          convenio: "",
          Nome_paciente: "",
          telefone_contato: "",
          data: null,
          hora: "",
          duracao_sec: 30,
          data_nascimento: null,
          MedicoID: "",
          status: "",
        };

        // Sincronizar preservedValues com initialValues
        preservedValues.value = {
          titulo: "AGENDAMENTO",
          data: null,
          hora: "",
          duracao_sec: 30,
          MedicoID: "",
          convenio: "",
          status: "",
        };
      }

      resolver.value = zodResolver(getValidationSchema());
    } else {
      isEditing.value = false;

      // Limpar estado de busca de paciente
      pacienteSelecionado.value = null;
      buscaPaciente.value = "";
      erroBuscaPaciente.value = "";

      initialValues.value = {
        titulo: "AGENDAMENTO",
        convenio: "",
        Nome_paciente: "",
        telefone_contato: "",
        data: null,
        hora: "",
        duracao_sec: 30,
        data_nascimento: null,
        MedicoID: "",
        status: "",
      };

      // Limpar preservedValues
      preservedValues.value = {
        titulo: "",
        data: null,
        hora: "",
        duracao_sec: null,
        MedicoID: "",
        convenio: "",
        status: "",
      };

      // Resetar formulário quando fechar o drawer
      formKey.value++;
    }
  }
);

watch(
  () => isEditing.value,
  () => {
    resolver.value = zodResolver(getValidationSchema());
  }
);

// Watch para atualizar validação quando paciente for vinculado/desvinculado
watch(
  () => pacienteSelecionado.value,
  () => {
    resolver.value = zodResolver(getValidationSchema());
  }
);
</script>
