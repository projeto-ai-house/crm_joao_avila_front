<template>
  <Drawer
    v-model:visible="props.drawerState"
    :header="drawerTitle"
    position="right"
    class="!w-full md:!w-[50rem] lg:!w-[60rem]"
    @update:visible="emit('update:drawerState', $event)"
  >
    <Form
      ref="formAnamnese"
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      @submit="saveAnamnese"
      class="grid grid-cols-12 w-full gap-4"
    >
      <div class="col-span-12 border-t border-gray-200 mt-2 pt-2">
        <h3 class="font-semibold text-gray-500">Queixa Principal</h3>
      </div>

      <div class="col-span-12 flex flex-col gap-1">
        <FloatLabel variant="on">
          <Textarea
            id="queixa_principal"
            name="queixa_principal"
            v-model="initialValues.queixa_principal"
            rows="3"
            fluid
            size="small"
          />
          <label for="queixa_principal">
            Queixa Principal
            <span class="text-red-500">*</span>
          </label>
        </FloatLabel>
        <Message
          v-if="$form.queixa_principal?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.queixa_principal.error.message }}
        </Message>
      </div>

      <div class="col-span-12 border-t border-gray-200 mt-2 pt-2">
        <h3 class="font-semibold text-gray-500">História da Doença Atual</h3>
      </div>

      <div class="col-span-12 flex flex-col gap-1">
        <FloatLabel variant="on">
          <Textarea
            id="historia_doenca_atual"
            name="historia_doenca_atual"
            v-model="initialValues.historia_doenca_atual"
            rows="4"
            fluid
            size="small"
          />
          <label for="historia_doenca_atual">
            História da Doença Atual
            <span class="text-red-500">*</span>
          </label>
        </FloatLabel>
        <Message
          v-if="$form.historia_doenca_atual?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.historia_doenca_atual.error.message }}
        </Message>
      </div>

      <div class="col-span-12 border-t border-gray-200 mt-2 pt-2">
        <h3 class="font-semibold text-gray-500">História Familiar</h3>
      </div>

      <div class="col-span-12 flex flex-col gap-1">
        <FloatLabel variant="on">
          <Textarea
            id="historia_familiar"
            name="historia_familiar"
            v-model="initialValues.historia_familiar"
            rows="3"
            fluid
            size="small"
          />
          <label for="historia_familiar">História Familiar</label>
        </FloatLabel>
        <Message
          v-if="$form.historia_familiar?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.historia_familiar.error.message }}
        </Message>
      </div>

      <div class="col-span-12 border-t border-gray-200 mt-2 pt-2">
        <h3 class="font-semibold text-gray-500">História Pessoal</h3>
      </div>

      <div class="col-span-12 flex flex-col gap-1">
        <FloatLabel variant="on">
          <Textarea
            id="historia_pessoal"
            name="historia_pessoal"
            v-model="initialValues.historia_pessoal"
            rows="4"
            fluid
            size="small"
          />
          <label for="historia_pessoal">História Pessoal</label>
        </FloatLabel>
        <Message
          v-if="$form.historia_pessoal?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.historia_pessoal.error.message }}
        </Message>
      </div>

      <div class="col-span-12 border-t border-gray-200 mt-2 pt-2">
        <h3 class="font-semibold text-gray-500">Revisão de Sistemas</h3>
      </div>

      <div class="col-span-12 flex flex-col gap-1">
        <FloatLabel variant="on">
          <Textarea
            id="revisao_sistemas"
            name="revisao_sistemas"
            v-model="initialValues.revisao_sistemas"
            rows="4"
            fluid
            size="small"
          />
          <label for="revisao_sistemas">Revisão de Sistemas</label>
        </FloatLabel>
        <Message
          v-if="$form.revisao_sistemas?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.revisao_sistemas.error.message }}
        </Message>
      </div>

      <div class="col-span-12 border-t border-gray-200 mt-2 pt-2">
        <h3 class="font-semibold text-gray-500">Hábitos de Vida</h3>
      </div>

      <div class="col-span-12 flex flex-col gap-1">
        <FloatLabel variant="on">
          <Textarea
            id="habitos_de_vida"
            name="habitos_de_vida"
            v-model="initialValues.habitos_de_vida"
            rows="3"
            fluid
            size="small"
          />
          <label for="habitos_de_vida">Hábitos de Vida</label>
        </FloatLabel>
        <Message
          v-if="$form.habitos_de_vida?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.habitos_de_vida.error.message }}
        </Message>
      </div>

      <div class="col-span-12 border-t border-gray-200 mt-2 pt-2">
        <h3 class="font-semibold text-gray-500">Medicamentos em Uso</h3>
      </div>

      <div class="col-span-12 flex flex-col gap-1">
        <FloatLabel variant="on">
          <Textarea
            id="medicamentos_em_uso"
            name="medicamentos_em_uso"
            v-model="initialValues.medicamentos_em_uso"
            rows="3"
            fluid
            size="small"
          />
          <label for="medicamentos_em_uso">Medicamentos em Uso</label>
        </FloatLabel>
        <Message
          v-if="$form.medicamentos_em_uso?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.medicamentos_em_uso.error.message }}
        </Message>
      </div>

      <div class="col-span-12 border-t border-gray-200 mt-2 pt-2">
        <h3 class="font-semibold text-gray-500">Alergias</h3>
      </div>

      <div class="col-span-12 flex flex-col gap-1">
        <FloatLabel variant="on">
          <Textarea
            id="alergias"
            name="alergias"
            v-model="initialValues.alergias"
            rows="2"
            fluid
            size="small"
          />
          <label for="alergias">Alergias</label>
        </FloatLabel>
        <Message
          v-if="$form.alergias?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.alergias.error.message }}
        </Message>
      </div>

      <!-- Data criação -->
      <cite
        class="col-span-12 text-sm text-gray-500 text-right pb-2"
        v-if="initialValues.id"
      >
        Criado em
        {{ DateUtils.separateDateAndTime(initialValues.created_at)[0] }} às
        {{ DateUtils.separateDateAndTime(initialValues.created_at)[1] }}
      </cite>

      <cite
        class="text-gray-400 text-sm col-span-12 mt-4 pt-4 border-t border-gray-100"
      >
        <span class="text-red-500">*</span> Campos obrigatórios
      </cite>
    </Form>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          size="small"
          variant="outlined"
          @click="emit('update:drawerState', false)"
        />
        <Button
          icon="pi pi-save"
          label="Salvar"
          severity="success"
          size="small"
          @click="confirmSaveAnamnese()"
          :disabled="!permissionsUserPage.editar && !permissionsUserPage.criar"
        />
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { inject, ref, watch, type Ref } from "vue";
//@ts-ignore
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import {
  Button,
  Drawer,
  FloatLabel,
  Message,
  Textarea,
  useToast,
} from "primevue";
import { useConfirm } from "primevue/useconfirm";
import { useRouter } from "vue-router";
import { z } from "zod";
import { AnamneseServices } from "../../../../services/anamnese/AnamneseServices";
import { DateUtils } from "../../../../utils/DateUtils";
import { PermissionsUtils } from "../../../../utils/PermissionsUtils";

export interface IAnamnese {
  id?: string;
  paciente_nome?: string;
  medico_id?: string;
  medico_nome?: string;
  clinic_id?: string;
  queixa_principal?: string;
  historia_doenca_atual?: string;
  historia_familiar?: string;
  historia_pessoal?: string;
  revisao_sistemas?: string;
  habitos_de_vida?: string;
  medicamentos_em_uso?: string;
  alergias?: string;
  created_at?: string;
  updated_at?: string;
}

const toast = useToast();
const confirm = useConfirm();
const globalLoading = inject<Ref<boolean>>("globalLoading");
const router = useRouter();
const permissionsUserPage = ref(
  PermissionsUtils.checkMethodPemission(router.currentRoute.value.fullPath)
);

const props = defineProps<{
  drawerState: boolean;
  inEdition: IAnamnese | null;
  permissionsUserPage?: any;
  patientId: string | null;
}>();

const emit = defineEmits<{
  (e: "update:drawerState", value: boolean): void;
  (e: "saveAnamnese", anamnese: IAnamnese): void;
}>();

const isEditing = ref(false);
const formAnamnese = ref(null);
const drawerTitle = ref("");

const emptyAnamnese: IAnamnese = {
  queixa_principal: "",
  historia_doenca_atual: "",
  historia_familiar: "",
  historia_pessoal: "",
  revisao_sistemas: "",
  habitos_de_vida: "",
  medicamentos_em_uso: "",
  alergias: "",
};

const initialValues = ref<IAnamnese>({ ...emptyAnamnese });

const getValidationSchema = () => {
  return z.object({
    queixa_principal: z
      .string()
      .min(1, { message: "Queixa principal é obrigatória." }),
    historia_doenca_atual: z
      .string()
      .min(1, { message: "História da doença atual é obrigatória." }),
    historia_familiar: z.string().optional(),
    historia_pessoal: z.string().optional(),
    revisao_sistemas: z.string().optional(),
    habitos_de_vida: z.string().optional(),
    medicamentos_em_uso: z.string().optional(),
    alergias: z.string().optional(),
  });
};

const resolver = ref(zodResolver(getValidationSchema()));

const confirmSaveAnamnese = () => {
  confirm.require({
    message: "Tem certeza que deseja salvar esta anamnese?",
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
      formAnamnese.value?.submit();
    },
    reject: () => {},
  });
};

async function saveAnamnese({ valid, values, states }) {
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
    globalLoading!.value = true;
    console.log(initialValues.value);

    if (initialValues.value.id) {
      const configuredData = { ...initialValues.value };
      delete configuredData.created_at;
      delete configuredData.updated_at;
      delete configuredData.clinic_id;
      const response = await AnamneseServices.putAnamnese(configuredData);
      if (response.status !== 200) {
        console.error("Erro ao salvar anamnese:", response);
        return;
      }
      emit("saveAnamnese", initialValues.value);
    } else {
      const configuredData = {
        ...initialValues.value,
        paciente_id: props.patientId,
      };
      delete configuredData.created_at;
      delete configuredData.updated_at;
      delete configuredData.clinic_id;
      delete configuredData.id;
      const response = await AnamneseServices.postAnamnese(configuredData);
      if (response.status !== 200) {
        console.error("Erro ao incluir anamnese:", response);
        return;
      }
      emit("saveAnamnese", initialValues.value);
    }
  } catch (error) {
    console.error("Erro ao salvar anamnese:", error);
  } finally {
    globalLoading!.value = false;
  }
}

watch(
  () => props.drawerState,
  (newValue) => {
    if (newValue) {
      isEditing.value = !!props.inEdition;

      if (props.inEdition) {
        initialValues.value = { ...props.inEdition };
        drawerTitle.value = "Editar Anamnese";
      } else {
        initialValues.value = { ...emptyAnamnese };
        drawerTitle.value = "Nova Anamnese";
      }
    } else {
      // Reset quando fechar
      isEditing.value = false;
      initialValues.value = { ...emptyAnamnese };
    }
  }
);
</script>
