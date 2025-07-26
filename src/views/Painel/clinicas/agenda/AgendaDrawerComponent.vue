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
        <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
          <FloatLabel variant="on">
            <DatePicker
              id="data"
              name="data"
              fluid
              dateFormat="dd/mm/yy"
              size="small"
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
              mask="(99) 99999-9999"
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
import { inject, onMounted, ref, watch, type Ref } from "vue";
//@ts-ignore
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { Calendar, User } from "lucide-vue-next";
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
import { AppointmentsServices } from "../../../../services/appointments/AppointmentsServices";
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
const listMedicos = ref<Medico[]>([]);

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
  data_nascimento: null as Date | null,
  MedicoID: "",
  status: "",
});

const getValidationSchema = () => {
  const baseSchema = {
    titulo: z.string().min(1, { message: "Título é obrigatório." }),
    convenio: z.string(),
    Nome_paciente: z
      .string()
      .min(1, { message: "Nome do paciente é obrigatório." })
      .refine((val) => val.trim().split(/\s+/).length > 1, {
        message: "Informe o nome completo do paciente.",
      }),
    telefone_contato: z
      .string()
      .min(1, { message: "Telefone de contato é obrigatório." })
      .transform((val) => val.replace(/\D/g, ""))
      .refine((val) => /^\d{10,11}$/.test(val), {
        message: "Telefone inválido. Deve conter 10 ou 11 dígitos.",
      }),
    // Validação de data dinâmica baseada no modo de edição
    data: isEditing.value
      ? z.date() // Permite qualquer data quando editando
      : z.date().min(new Date(new Date().setHours(0, 0, 0, 0)), {
          message: "Data não pode ser anterior ao dia atual.",
        }),
    hora: z.string().min(1, { message: "Hora é obrigatória." }),
    data_nascimento: z
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
    };
    delete appointment.hora;
    delete appointment.data;

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

watch(
  () => props.drawerState,
  (newValue) => {
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
        console.log("Data e hora do agendamento:", dataHora);

        const hora = dataHora
          ? `${dataHora.getHours().toString().padStart(2, "0")}:${dataHora
              .getMinutes()
              .toString()
              .padStart(2, "0")}`
          : "";

        // Converter data_nascimento para Date
        const dataNascimento = props.inEdition.data_nascimento
          ? new Date(props.inEdition.data_nascimento)
          : null;

        initialValues.value = {
          titulo: props.inEdition.titulo || "AGENDAMENTO",
          convenio: props.inEdition.convenio || "",
          Nome_paciente: props.inEdition.nome_cliente || "",
          telefone_contato: props.inEdition.telefone_contato || "",
          data: data,
          hora: hora,
          data_nascimento: dataNascimento,
          MedicoID: props.inEdition.medico_id || "",
          status: props.inEdition.status || "ATIVO",
        };
        appointmentId.value = props.inEdition.id || null;
      }

      resolver.value = zodResolver(getValidationSchema());
    } else {
      isEditing.value = false;
      initialValues.value = {
        titulo: "AGENDAMENTO",
        convenio: "",
        Nome_paciente: "",
        telefone_contato: "",
        data: null,
        hora: "",
        data_nascimento: null,
        MedicoID: "",
        status: "",
      };
    }
  }
);

watch(
  () => isEditing.value,
  () => {
    resolver.value = zodResolver(getValidationSchema());
  }
);
</script>
