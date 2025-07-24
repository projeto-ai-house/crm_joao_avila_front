<template>
  <div class="flex justify-between items-center p-1 py-4 bg-white">
    <div>
      <h2 class="font-semibold text-gray-500">Paciente</h2>
      <p class="text-sm text-gray-400"></p>
    </div>
    <div class="flex gap-2">
      <Button
        icon="pi pi-save"
        label="Salvar"
        severity="primary"
        size="small"
        @click="salvarPaciente"
      />
      <Button
        label="Voltar"
        severity="secondary"
        size="small"
        variant="text"
        class="ml-2"
        @click="router.go(-1)"
      />
    </div>
  </div>
  <Form
    ref="formClinic"
    v-slot="$form"
    :initialValues="initialValues"
    class="grid grid-cols-12 p-1 gap-x-2 gap-y-4"
  >
    <div class="col-span-12 border-t border-gray-200 mt-2 pt-2">
      <h3 class="font-semibold text-gray-500">Informações do Paciente</h3>
    </div>
    <div class="col-span-3 row-span-3 flex flex-col gap-2 max-h-full relative">
      <img
        v-if="imageSrc"
        :src="imageSrc"
        alt="Image"
        class="shadow-md rounded-xl w-full h-full max-h-[100px]"
        style="filter: grayscale(100%)"
      />
      <span
        v-else
        class="text-gray-500 w-full flex justify-center items-center h-full bg-gray-200 rounded-xl"
      >
        <i class="pi pi-image"></i>
      </span>
      <span v-if="!!imageSrc" class="absolute top-2 right-2 shadow-lg">
        <Button
          icon="pi pi-trash"
          severity="danger"
          size="small"
          @click="imageSrc = ''"
        />
      </span>
      <FileUpload
        mode="basic"
        customUpload
        auto
        @select="onFileSelect"
        choose-label="Selecionar Imagem"
        class="p-button-outlined p-button-secondary w-full"
      />
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="nome_clinica"
          name="nome_clinica"
          type="text"
          fluid
          size="small"
          v-model="initialValues.nome_completo"
        />
        <label for="nome_clinica">
          Nome Completo
          <span class="text-red-500">*</span>
        </label>
      </FloatLabel>
      <Message
        v-if="$form.nome_completo?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.nome_completo.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <DatePicker
          id="DataNascimento"
          name="DataNascimento"
          fluid
          dateFormat="dd/mm/yy"
          v-model="initialValues.data_nascimento_datepicker"
          size="small"
        />
        <label for="DataNascimento"
          >Data de Nascimento
          <span class="text-red-500">*</span>
        </label>
      </FloatLabel>
      <Message
        v-if="$form.data_nascimento?.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $form.data_nascimento.error.message }}</Message
      >
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <Select
          v-model="initialValues.sexo"
          :options="[
            { label: 'Masculino', value: 'Masculino' },
            { label: 'Feminino', value: 'Feminino' },
            { label: 'Outro', value: 'Outro' },
          ]"
          optionValue="value"
          optionLabel="label"
          fluid
          size="small"
        />
        <label for="sexo">
          Sexo
          <span class="text-red-500">*</span>
        </label>
      </FloatLabel>
      <Message
        v-if="$form.sexo?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.sexo.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="cpf"
          name="cpf"
          type="text"
          fluid
          size="small"
          v-model="initialValues.cpf"
        />
        <label for="cpf">CPF</label>
      </FloatLabel>
      <Message
        v-if="$form.cpf?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.cpf.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="rg"
          name="rg"
          type="text"
          fluid
          size="small"
          v-model="initialValues.rg"
        />
        <label for="rg">RG</label>
      </FloatLabel>
      <Message
        v-if="$form.rg?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.rg.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="nacionalidade"
          name="nacionalidade"
          type="text"
          fluid
          size="small"
          v-model="initialValues.nacionalidade"
        />
        <label for="nacionalidade">Nacionalidade</label>
      </FloatLabel>
      <Message
        v-if="$form.nacionalidade?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.nacionalidade.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="profissao"
          name="profissao"
          type="text"
          fluid
          size="small"
          v-model="initialValues.profissao"
        />
        <label for="profissao">Profissão</label>
      </FloatLabel>
      <Message
        v-if="$form.profissao?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.profissao.error.message }}
      </Message>
    </div>

    <div class="col-span-12">
      <h3 class="font-semibold text-gray-500">Dados Físicos</h3>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputNumber
          id="altura_cm"
          name="altura_cm"
          fluid
          size="small"
          v-model="initialValues.altura_cm"
          :min="0"
          :max="300"
          suffix=" cm"
        />
        <label for="altura_cm">Altura (cm)</label>
      </FloatLabel>
      <Message
        v-if="$form.altura_cm?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.altura_cm.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputNumber
          id="peso_kg"
          name="peso_kg"
          fluid
          size="small"
          v-model="initialValues.peso_kg"
          :min="0"
          :max="1000"
          :minFractionDigits="1"
          :maxFractionDigits="2"
          suffix=" kg"
        />
        <label for="peso_kg">Peso (kg)</label>
      </FloatLabel>
      <Message
        v-if="$form.peso_kg?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.peso_kg.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputNumber
          id="imc"
          name="imc"
          fluid
          size="small"
          v-model="initialValues.imc"
          :min="0"
          :max="100"
          :minFractionDigits="1"
          :maxFractionDigits="2"
          readonly
        />
        <label for="imc">IMC</label>
      </FloatLabel>
      <Message
        v-if="$form.imc?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.imc.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <Select
          v-model="initialValues.prioridade"
          :options="[
            { label: 'Nenhuma', value: 'Nenhuma' },
            { label: 'Baixa', value: 'Baixa' },
            { label: 'Normal', value: 'Normal' },
            { label: 'Alta', value: 'Alta' },
            { label: 'Urgente', value: 'Urgente' },
          ]"
          optionValue="value"
          optionLabel="label"
          fluid
          size="small"
        />
        <label for="prioridade">Prioridade</label>
      </FloatLabel>
      <Message
        v-if="$form.prioridade?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.prioridade.error.message }}
      </Message>
    </div>

    <div class="col-span-12">
      <h3 class="font-semibold text-gray-500">Informações Pessoais</h3>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <Select
          v-model="initialValues.cor_pele"
          :options="[
            { label: 'Branca', value: 'Branca' },
            { label: 'Preta', value: 'Preta' },
            { label: 'Parda', value: 'Parda' },
            { label: 'Amarela', value: 'Amarela' },
            { label: 'Indígena', value: 'Indigena' },
          ]"
          optionValue="value"
          optionLabel="label"
          fluid
          size="small"
        />
        <label for="cor_pele">Cor da Pele</label>
      </FloatLabel>
      <Message
        v-if="$form.cor_pele?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.cor_pele.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <Select
          v-model="initialValues.estado_civil"
          :options="[
            { label: 'Solteiro(a)', value: 'Solteiro(a)' },
            { label: 'Casado(a)', value: 'Casado(a)' },
            { label: 'Divorciado(a)', value: 'Divorciado(a)' },
            { label: 'Viúvo(a)', value: 'Viúvo(a)' },
            { label: 'União Estável', value: 'UniaoEstavel' },
          ]"
          optionValue="value"
          optionLabel="label"
          fluid
          size="small"
        />
        <label for="estado_civil">Estado Civil</label>
      </FloatLabel>
      <Message
        v-if="$form.estado_civil?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.estado_civil.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <Select
          v-model="initialValues.escolaridade"
          :options="[
            {
              label: 'Ensino Fundamental Incompleto',
              value: 'Fundamental Incompleto',
            },
            {
              label: 'Ensino Fundamental Completo',
              value: 'Fundamental Completo',
            },
            { label: 'Ensino Médio Incompleto', value: 'Medio Incompleto' },
            { label: 'Ensino Médio Completo', value: 'Medio Completo' },
            {
              label: 'Ensino Superior Incompleto',
              value: 'Superior Incompleto',
            },
            { label: 'Ensino Superior Completo', value: 'Superior Completo' },
            { label: 'Pós-graduação', value: 'Pos-Graduacao' },
          ]"
          optionValue="value"
          optionLabel="label"
          fluid
          size="small"
        />
        <label for="escolaridade">Escolaridade</label>
      </FloatLabel>
      <Message
        v-if="$form.escolaridade?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.escolaridade.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="indicacao"
          name="indicacao"
          type="text"
          fluid
          size="small"
          v-model="initialValues.indicacao"
        />
        <label for="indicacao">Indicação</label>
      </FloatLabel>
      <Message
        v-if="$form.indicacao?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.indicacao.error.message }}
      </Message>
    </div>

    <div class="col-span-12">
      <h3 class="font-semibold text-gray-500">Contato</h3>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="telefone"
          name="telefone"
          type="text"
          fluid
          size="small"
          v-model="initialValues.telefone"
        />
        <label for="telefone">Telefone</label>
      </FloatLabel>
      <Message
        v-if="$form.telefone?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.telefone.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="celular"
          name="celular"
          type="text"
          fluid
          size="small"
          v-model="initialValues.celular"
        />
        <label for="celular">Celular</label>
      </FloatLabel>
      <Message
        v-if="$form.celular?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.celular.error.message }}
      </Message>
    </div>

    <div class="col-span-6 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="email"
          name="email"
          type="email"
          fluid
          size="small"
          v-model="initialValues.email"
        />
        <label for="email">E-mail</label>
      </FloatLabel>
      <Message
        v-if="$form.email?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.email.error.message }}
      </Message>
    </div>

    <div class="col-span-12">
      <h3 class="font-semibold text-gray-500">Endereço</h3>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="cep"
          name="cep"
          type="text"
          fluid
          size="small"
          v-model="initialValues.cep"
        />
        <label for="cep">CEP</label>
      </FloatLabel>
      <Message
        v-if="$form.cep?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.cep.error.message }}
      </Message>
    </div>

    <div class="col-span-6 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="endereco"
          name="endereco"
          type="text"
          fluid
          size="small"
          v-model="initialValues.endereco"
        />
        <label for="endereco">Endereço</label>
      </FloatLabel>
      <Message
        v-if="$form.endereco?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.endereco.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="numero_residencial"
          name="numero_residencial"
          type="text"
          fluid
          size="small"
          v-model="initialValues.numero_residencial"
        />
        <label for="numero_residencial">Número</label>
      </FloatLabel>
      <Message
        v-if="$form.numero_residencial?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.numero_residencial.error.message }}
      </Message>
    </div>

    <div class="col-span-6 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="complemento"
          name="complemento"
          type="text"
          fluid
          size="small"
          v-model="initialValues.complemento"
        />
        <label for="complemento">Complemento</label>
      </FloatLabel>
      <Message
        v-if="$form.complemento?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.complemento.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="cidade"
          name="cidade"
          type="text"
          fluid
          size="small"
          v-model="initialValues.cidade"
        />
        <label for="cidade">Cidade</label>
      </FloatLabel>
      <Message
        v-if="$form.cidade?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.cidade.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="estado"
          name="estado"
          type="text"
          fluid
          size="small"
          v-model="initialValues.estado"
        />
        <label for="estado">Estado</label>
      </FloatLabel>
      <Message
        v-if="$form.estado?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.estado.error.message }}
      </Message>
    </div>

    <div class="col-span-3 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <InputText
          id="pais"
          name="pais"
          type="text"
          fluid
          size="small"
          v-model="initialValues.pais"
        />
        <label for="pais">País</label>
      </FloatLabel>
      <Message
        v-if="$form.pais?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.pais.error.message }}
      </Message>
    </div>

    <div class="col-span-9 row-span-1 flex flex-col gap-1">
      <FloatLabel variant="on">
        <!-- <textarea
          id="observacoes"
          name="observacoes"
          class="p-inputtext p-component p-inputtext-sm"
          rows="1"
          v-model="initialValues.observacoes"
        /> -->
        <Textarea
          v-model="initialValues.observacoes"
          rows="1"
          cols=""
          size="small"
          fluid
        />
        <label for="observacoes">Observações</label>
      </FloatLabel>
      <Message
        v-if="$form.observacoes?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.observacoes.error.message }}
      </Message>
    </div>

    <div class="col-span-12 border-t border-gray-200 mt-2 pt-2">
      <h3 class="font-semibold text-gray-500">Convênios</h3>
    </div>

    <div
      class="col-span-12 row-span-1 grid grid-cols-12 gap-x-2 gap-y-4"
      v-for="(convenio, index) in [1, 2, 3]"
      :key="index"
    >
      <div class="col-span-3 row-span-1 flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputText
            :id="`convenio_${index + 1}_plano`"
            :name="`convenio_${index + 1}_plano`"
            type="text"
            fluid
            size="small"
            v-model="initialValues[`convenio_${index + 1}_plano`]"
          />
          <label for="convenio_1_plano">Plano</label>
        </FloatLabel>
      </div>
      <div class="col-span-2 row-span-1 flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputText
            :id="`convenio_${index + 1}_matricula`"
            :name="`convenio_${index + 1}_matricula`"
            type="text"
            fluid
            size="small"
            v-model="initialValues[`convenio_${index + 1}_matricula`]"
          />
          <label for="convenio_1_matricula">Matrícula</label>
        </FloatLabel>
      </div>
      <div class="col-span-2 row-span-1 flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputText
            :id="`convenio_${index + 1}_token`"
            :name="`convenio_${index + 1}_token`"
            type="text"
            fluid
            size="small"
            v-model="initialValues[`convenio_${index + 1}_token`]"
          />
          <label for="convenio_1_token">Token</label>
        </FloatLabel>
      </div>
      <div class="col-span-2 row-span-1 flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputText
            :id="`convenio_${index + 1}_validade`"
            :name="`convenio_${index + 1}_validade`"
            type="text"
            fluid
            size="small"
            v-model="initialValues[`convenio_${index + 1}_validade`]"
          />
          <label for="convenio_1_validade">Validade</label>
        </FloatLabel>
      </div>
      <div class="col-span-3 row-span-1 flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputText
            :id="`convenio_${index + 1}_titular`"
            :name="`convenio_${index + 1}_titular`"
            type="text"
            fluid
            size="small"
            v-model="initialValues[`convenio_${index + 1}_titular`]"
          />
          <label for="convenio_1_titular">Titular</label>
        </FloatLabel>
      </div>
    </div>
  </Form>
</template>

<script lang="ts" setup>
import { Form } from "@primevue/forms";
import {
  Button,
  DatePicker,
  FileUpload,
  FloatLabel,
  InputNumber,
  InputText,
  Message,
  Select,
  Textarea,
} from "primevue";
import { nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  PatientsServices,
  type IPatient,
} from "../../../../services/patients/PatientsServices";

const editing = ref(false);
const router = useRouter();
const imageSrc = ref<string | null>(null);
const initialValues = ref<IPatient>({
  id: "",
  nome_completo: "",
  data_nascimento: "",
  data_nascimento_datepicker: null,
  sexo: "",
  cpf: "",
  rg: "",
  nacionalidade: "",
  profissao: "",
  altura_cm: 0,
  peso_kg: 0,
  imc: 0,
  prioridade: "",
  cor_pele: "",
  estado_civil: "",
  escolaridade: "",
  indicacao: "",
  observacoes: "",
  telefone: "",
  celular: "",
  email: "",
  cep: "",
  endereco: "",
  numero_residencial: "",
  complemento: "",
  cidade: "",
  estado: "",
  pais: "",
  convenio_1_plano: "",
  convenio_1_matricula: "",
  convenio_1_token: "",
  convenio_1_validade: "",
  convenio_1_titular: "",
  convenio_2_plano: "",
  convenio_2_matricula: "",
  convenio_2_token: "",
  convenio_2_validade: "",
  convenio_2_titular: "",
  convenio_3_plano: "",
  convenio_3_matricula: "",
  convenio_3_token: "",
  convenio_3_validade: "",
  convenio_3_titular: "",
  procedimento_ids: [],
  parentes: [],
});
const patient = ref<IPatient | null>(null);

function onFileSelect(event: any) {
  const file = event.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageSrc.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

async function salvarPaciente() {
  try {
    if (patient.value) {
      if (editing.value) {
        initialValues.value.id = patient.value.id;
        initialValues.value.data_nascimento = initialValues.value
          .data_nascimento_datepicker
          ? initialValues.value.data_nascimento_datepicker.toISOString()
          : "";
        await PatientsServices.putPatient(
          initialValues.value.id,
          initialValues.value
        );
      } else {
        initialValues.value.data_nascimento = initialValues.value
          .data_nascimento_datepicker
          ? initialValues.value.data_nascimento_datepicker.toISOString()
          : "";
        await PatientsServices.postPatient(initialValues.value);
      }
    }
  } catch (error) {
    console.error("Erro ao salvar paciente:", error);
  }
}

async function fetchPatientDetails() {
  const patientId = router.currentRoute.value.params.id;
  if (patientId && patientId !== "novo") {
    try {
      const response = await PatientsServices.getPatient(patientId as string);
      initialValues.value = response.data?.data;
      patient.value = initialValues.value;
      await nextTick();
      initialValues.value.data_nascimento_datepicker = new Date(
        initialValues.value.data_nascimento
      );
    } catch (error) {
      console.error("Erro ao buscar detalhes do paciente:", error);
    }
  } else {
    patient.value = null;
  }
}

onMounted(async () => {
  editing.value = router.currentRoute.value.params.id !== "novo";
  fetchPatientDetails();
});
</script>
