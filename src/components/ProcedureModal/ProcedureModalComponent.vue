<template>
  <Dialog
    v-model:visible="dialogState"
    modal
    header="Edit Profile"
    :style="{ width: '40rem' }"
  >
    <template #header> Procedimentos </template>
    <div class="flex flex-col items-center justify-center gap-4">
      <Form
        ref="formProcedure"
        v-slot="$formProcedure"
        :initialValues="initialValues"
        class="grid grid-cols-12 pt-1 gap-x-2 gap-y-1"
        @submit="saveProcedure"
      >
        <div class="col-span-8 row-span-1 flex flex-col gap-1">
          <FloatLabel variant="on" style="font-size: 0.775rem">
            <InputText
              id="nome_clinica"
              name="nome_clinica"
              type="text"
              fluid
              size="small"
              v-model="initialValues.nome"
              ref="inputProcedureNome"
              autofocus
              @input="filterProceduresList"
            />
            <label for="nome_clinica">
              Nome
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$formProcedure.nome?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $formProcedure.nome.error.message }}
          </Message>
        </div>

        <div class="col-span-3 row-span-1 flex flex-col gap-1">
          <FloatLabel variant="on" style="font-size: 0.775rem">
            <InputNumber
              id="duracao_min"
              name="duracao_min"
              type="number"
              fluid
              size="small"
              v-model="initialValues.duracao_min"
            />
            <label for="duracao_min">
              Duração (min)
              <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <Message
            v-if="$formProcedure.duracao_min?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $formProcedure.duracao_min.error.message }}
          </Message>
        </div>

        <Button
          icon="pi pi-plus"
          severity="success"
          size="small"
          fluid
          variant="contained"
          class="col-span-1 row-span-1"
          type="submit"
          v-tooltip.bottom="'Adicionar'"
        />
        <cite class="col-span-12 text-xs text-gray-400 w-full text-left px-1">
          Use o campo de nome para pesquisar procedimentos já cadastrados.
        </cite>
      </Form>
      <!-- Lista Programação de Agendamentos -->
      <div
        class="border rounded-md border-gray-200 pl-2 pr-1 flex justify-between items-center w-full"
        :class="{
          'hover:bg-gray-50 cursor-pointer': props.selectable,
        }"
        v-for="(item, index) in proceduresListFiltred"
        :key="index"
        @click="
          props.selectable
            ? emit('send:procedure', { id: item.id, nome: item.nome })
            : null
        "
      >
        <div class="flex flex-col gap-1 py-1">
          <span class="text-sm font-semibold">{{ item.nome }}</span>
          <span class="text-xs text-gray-500"
            >Duração: {{ item.duracao_min }} min</span
          >
        </div>
        <div class="flex items-center justify-end gap-2">
          <div class="flex flex-col gap-1 py-1 text-end">
            <span class="text-xs text-gray-500" v-show="item.created_at">
              Criado em: {{ new Date(item.created_at).toLocaleDateString() }}
            </span>
          </div>

          <Button
            icon="pi pi-trash"
            severity="danger"
            variant="text"
            class="col-span-1 row-span-1 my-1"
            v-tooltip.top="'Excluir'"
            @click="confirmDeleteProcedure(item.id)"
          />
        </div>
      </div>
      <cite
        v-show="!proceduresList?.length"
        class="col-span-12 text-sm text-gray-500"
      >
        Nenhum procedimento salvo.
      </cite>
    </div>
    <template #footer>
      <cite
        class="text-xs text-gray-400 w-full text-left px-1 flex items-center gap-1"
        v-show="props.selectable"
      >
        <i class="pi pi-info-circle"></i>
        Clique no procedimento para incluir.
      </cite>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Form } from "@primevue/forms";
import {
  Button,
  Dialog,
  FloatLabel,
  InputNumber,
  InputText,
  useConfirm,
} from "primevue";
import { inject, ref, watch, type Ref } from "vue";
import { ProceduresServices } from "../../services/procedures/ProceduresServices";

const props = defineProps<{
  selectable?: boolean;
}>();
const dialogState = ref(false);
const emit = defineEmits<{
  (e: "send:procedure", value: { id: string; nome: string }): void;
}>();
defineExpose({
  open: () => {
    dialogState.value = true;
  },
  close: () => {
    dialogState.value = false;
  },
});
const confirm = useConfirm();

const inputProcedureNome = ref(null);
const globalLoading = inject<Ref<boolean>>("globalLoading");
const proceduresList = ref<any[]>([]);
const proceduresListFiltred = ref<any[]>([]);
const initialValues = ref({
  nome: "",
  duracao_min: null,
});

function filterProceduresList() {
  const searchTerm = initialValues.value.nome.toLowerCase();
  proceduresListFiltred.value = proceduresList.value.filter((item) =>
    item.nome.toLowerCase().includes(searchTerm)
  );
}

const confirmDeleteProcedure = (id: string) => {
  try {
    confirm.require({
      message: "Você tem certeza que deseja excluir este procedimento?",
      header: "Confirmação",
      icon: "pi pi-exclamation-triangle",
      rejectProps: {
        label: "Cancelar",
        severity: "secondary",
        outlined: true,
        size: "small",
      },
      acceptProps: {
        label: "Confirmar",
        severity: "danger",
        size: "small",
      },
      accept: () => {
        deleteProcedure(id);
      },
      reject: () => {},
    });
  } catch (error) {
    console.error("Erro na validação:", error);
  }
};

async function saveProcedure() {
  if (!initialValues.value.nome || !initialValues.value.duracao_min) {
    console.error("Nome e duração são obrigatórios.");
    return;
  }
  globalLoading.value = true;
  try {
    const response = await ProceduresServices.postProcedure(
      initialValues.value
    );
    if (response.data) {
      proceduresList.value.push(response.data?.data);
      initialValues.value = {
        nome: "",
        duracao_min: null,
      };
      proceduresListFiltred.value = [...proceduresList.value];
    }
  } catch (error) {
    console.error("Error saving procedure:", error);
  } finally {
    globalLoading.value = false;
    if (inputProcedureNome.value) {
      inputProcedureNome.value.$el.focus();
    }
  }
}

async function deleteProcedure(id: string) {
  globalLoading.value = true;
  try {
    await ProceduresServices.deleteProcedure(id);
    proceduresList.value = proceduresList.value.filter(
      (item) => item.id !== id
    );
    proceduresListFiltred.value = [...proceduresList.value];
  } catch (error) {
    console.error("Error deleting procedure:", error);
  } finally {
    globalLoading.value = false;
  }
}

async function fetchProcedures() {
  globalLoading.value = true;
  try {
    const response = await ProceduresServices.getProcedures();
    if (response.data) {
      proceduresList.value = response.data?.data;
      proceduresListFiltred.value = [...proceduresList.value];
    }
  } catch (error) {
    console.error("Error fetching procedures:", error);
  } finally {
    globalLoading.value = false;
  }
}

watch(dialogState, (newValue) => {
  if (newValue) {
    fetchProcedures();
  }
});
</script>
