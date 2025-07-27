<template>
  <div class="flex justify-between items-center p-1 py-4 bg-white pb-4">
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
      <div
        class="!shadow-md !rounded-xl overflow-hidden"
        v-if="imageSrcLink || initialValues.foto_path"
      >
        <Image
          alt="Image"
          preview
          :src="imageSrcLink || initialValues.foto_path"
          class="w-full h-full max-h-[100px]"
          style="filter: grayscale(100%)"
          image-style="object-fit: cover; object-position: top;"
        />
      </div>
      <span
        v-else
        class="text-gray-500 w-full flex justify-center items-center h-full bg-gray-200 rounded-xl"
      >
        <i class="pi pi-image"></i>
      </span>
      <span v-if="!!imageFile" class="absolute top-2 right-2 shadow-lg">
        <Button
          icon="pi pi-trash"
          severity="danger"
          size="small"
          @click="
            imageFile = null;
            imageSrcLink = null;
          "
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
        <InputMask
          id="cpf"
          name="cpf"
          mask="***.***.***-**"
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
        <InputMask
          id="rg"
          name="rg"
          mask="99.999.999-9"
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
            // Cardiaco
            // Criança de colo
            // Lactante
            // Portador de deficiencia
            // Obeso
            // Idoso com idade ou superior a 60 anos
            // Gestante
            // Diabetico
            // Autista
            // Mobilidade reduzida
            // Deficiente auditivo
            // Deficiente visual
            // Nenhuma
            { label: 'Nenhuma', value: 'Nenhuma' },
            { label: 'Cardíaco', value: 'Cardiaco' },
            { label: 'Criança de colo', value: 'Criança de colo' },
            { label: 'Lactante', value: 'Lactante' },
            {
              label: 'Portador de deficiência',
              value: 'Portador de deficiencia',
            },
            { label: 'Obeso', value: 'Obeso' },
            {
              label: 'Idoso (60+ anos)',
              value: 'Idoso com idade ou superior a 60 anos',
            },
            { label: 'Gestante', value: 'Gestante' },
            { label: 'Diabético', value: 'Diabetico' },
            { label: 'Autista', value: 'Autista' },
            { label: 'Mobilidade reduzida', value: 'Mobilidade reduzida' },
            { label: 'Deficiente auditivo', value: 'Deficiente auditivo' },
            { label: 'Deficiente visual', value: 'Deficiente visual' },
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
            { label: 'Indígena', value: 'Indígena' },
            { label: 'Não Declarada', value: 'Não Declarada' },
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
            { label: 'União Estável', value: 'Uniao Estavel' },
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
            { label: 'Não Alfabetizado', value: 'Não alfabetizado' },
            { label: 'Educação Infantil', value: 'Educação infantil' },
            { label: 'Ensino Fundamental', value: 'Ensino fundamental' },
            { label: 'Ensino Médio', value: 'Ensino médio' },
            {
              label: 'Ensino Profissionalizante',
              value: 'Ensino profissionalizante',
            },
            { label: 'Graduação Incompleta', value: 'Graduação incompleta' },
            { label: 'Graduação Completa', value: 'Graduação completa' },
            { label: 'Mestrado', value: 'Mestrado' },
            { label: 'Pós-doutorado', value: 'Pós-doutorado' },
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
        <InputMask
          id="telefone"
          name="telefone"
          mask="(99) 9999-9999"
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
        <InputMask
          id="celular"
          name="celular"
          mask="(99) 99999-9999"
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
        <!-- <InputText
          id="cep"
          name="cep"
          type="text"
          fluid
          size="small"
          v-model="initialValues.cep"
        /> -->
        <InputMask
          id="cep"
          name="cep"
          mask="99999-999"
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
          <DatePicker
            :id="`convenio_${index + 1}_validade`"
            :name="`convenio_${index + 1}_validade`"
            fluid
            dateFormat="dd/mm/yy"
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

    <!-- Form Programação de Agendamentos -->
    <div
      class="col-span-5 p-4 border border-gray-200 rounded-lg grid grid-cols-12 gap-x-2 gap-y-4 h-fit"
      v-if="userStore.user.Role?.toUpperCase() === 'MEDICO'"
    >
      <div class="col-span-12">
        <h3 class="font-semibold text-gray-500">Programação de Agendamentos</h3>
      </div>

      <InputGroup class="col-span-12 max-h-[35px]">
        <FloatLabel variant="on">
          <AutoComplete
            v-model="preScheduleInput"
            :suggestions="proceduresListFiltred"
            optionLabel="nome"
            @complete="searchProcedures"
            @item-select="(selected) => addProcedure(selected?.value)"
          />
          <label for="sub1procedimento">Procedimento</label>
        </FloatLabel>
        <InputGroupAddon>
          <Button
            icon="pi pi-search"
            severity="secondary"
            variant="text"
            size="small"
            @click="procedureModal.open()"
          />
        </InputGroupAddon>
      </InputGroup>

      <!-- Lista Programação de Agendamentos -->
      <div
        class="col-span-12 border-b border-gray-200 last:border-0 pl-2 pr-1 flex justify-between items-center -mt-2"
        v-for="(item, index) in preScheduleList"
        :key="index"
      >
        {{
          proceduresList.find((p) => p.id === item)?.nome ||
          "Procedimento Desconhecido"
        }}

        <Button
          icon="pi pi-trash"
          severity="danger"
          size="small"
          variant="text"
          class="col-span-1 row-span-1"
          @click="preScheduleList.splice(index, 1)"
        />
      </div>
      <cite
        v-show="!preScheduleList?.length"
        class="col-span-12 text-sm text-gray-500"
      >
        Nenhum procedimento agendado.
      </cite>
    </div>

    <!-- Relacionamentos e Familiares -->
    <div
      class="p-4 border border-gray-200 rounded-lg grid grid-cols-13 gap-x-2 gap-y-4 h-fit"
      :class="{
        'col-span-12': userStore.user.Role?.toUpperCase() !== 'MEDICO',
        'col-span-7': userStore.user.Role?.toUpperCase() === 'MEDICO',
      }"
    >
      <div class="col-span-13">
        <h3 class="font-semibold text-gray-500">
          Relacionamentos e Familiares
        </h3>
      </div>

      <div class="col-span-3">
        <FloatLabel variant="on">
          <InputText
            id="sub1procedimento"
            size="small"
            v-model="parent.nome"
            fluid
          />
          <label for="sub1procedimento">Nome</label>
        </FloatLabel>
      </div>
      <div class="col-span-3">
        <FloatLabel variant="on">
          <InputMask
            id="Cpf"
            name="Cpf"
            mask="***.***.***-**"
            type="text"
            fluid
            v-model="parent.cpf"
            size="small"
          />
          <label for="Cpf">CPF</label>
        </FloatLabel>
      </div>
      <div class="col-span-3">
        <FloatLabel variant="on">
          <InputMask
            id="Telefone"
            name="Telefone"
            mask="(99) 99999-9999"
            type="text"
            fluid
            v-model="parent.telefone"
            size="small"
          />
          <label for="Telefone">Telefone</label>
        </FloatLabel>
      </div>

      <div class="col-span-3">
        <FloatLabel variant="on">
          <DatePicker
            fluid
            dateFormat="dd/mm/yy"
            v-model="parent.data_nascimento"
            size="small"
            :max-date="new Date()"
          />
          <label for="DataNascimento">
            Nascimento
            <span class="text-red-500">*</span>
          </label>
        </FloatLabel>
      </div>

      <div class="col-span-1">
        <Button
          icon="pi pi-plus"
          severity="primary"
          size="small"
          fluid
          @click="addParent"
          class="!w-full"
        />
      </div>

      <!-- Lista Relacionamentos e Familiares -->
      <div
        class="col-span-13 border-b border-gray-200 last:border-0 pl-2 pr-1 grid grid-cols-13 gap-x-2 gap-y-2 items-center -mt-2"
        v-for="(item, index) in parentsList"
        :key="index"
      >
        <span class="font-semibold col-span-3">{{ item.nome }}</span>
        <span class="col-span-3">{{ item.cpf }}</span>
        <span class="col-span-3">{{ item.telefone }}</span>
        <span class="col-span-3">
          {{ DateUtils.formatDateBRtoISO(item.data_nascimento) }}
        </span>

        <div class="col-span-1 !w-full flex justify-center">
          <Button
            icon="pi pi-trash"
            severity="danger"
            variant="text"
            size="small"
            @click="parentsList.splice(index, 1)"
          />
        </div>
      </div>
      <cite
        v-show="!initialValues.parentes.length || !parentsList.length"
        class="col-span-13 text-sm text-gray-500"
      >
        Nenhum parente cadastrado.
      </cite>
    </div>

    <!-- Data criação -->
    <cite
      class="col-span-12 text-sm text-gray-500 text-right pb-2"
      v-if="editing"
    >
      Criado em
      {{ DateUtils.separateDateAndTime(initialValues.created_at)[0] }} às
      {{ DateUtils.separateDateAndTime(initialValues.created_at)[1] }}
    </cite>
  </Form>

  <ProcedureModalComponent
    ref="procedureModal"
    :selectable="true"
    @send:procedure="addProcedure"
  />
</template>

<script lang="ts" setup>
import { Form } from "@primevue/forms";
import imageCompression from "browser-image-compression";
import {
  AutoComplete,
  Button,
  DatePicker,
  FileUpload,
  FloatLabel,
  Image,
  InputGroup,
  InputGroupAddon,
  InputMask,
  InputNumber,
  InputText,
  Message,
  Select,
  Textarea,
} from "primevue";
import { inject, nextTick, onMounted, ref, type Ref } from "vue";
import { useRouter } from "vue-router";
import ProcedureModalComponent from "../../../../components/ProcedureModal/ProcedureModalComponent.vue";
import {
  PatientsServices,
  type IPatient,
} from "../../../../services/patients/PatientsServices";
import { ProceduresServices } from "../../../../services/procedures/ProceduresServices";
import { useUserStore } from "../../../../stores/user";
import { DateUtils } from "../../../../utils/DateUtils";
import { PermissionsUtils } from "../../../../utils/PermissionsUtils";

const globalLoading = inject<Ref<boolean>>("globalLoading");
const editing = ref(false);
const router = useRouter();
const permissionsUserPage = ref(
  PermissionsUtils.checkMethodPemission(router.currentRoute.value.fullPath)
);
const userStore = useUserStore();
const procedureModal = ref(null);

const imageSrcLink = ref<string | null>(null);
const imageFile = ref<File | null>(null);
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
  convenio_1_validade: null,
  convenio_1_titular: "",
  convenio_2_plano: "",
  convenio_2_matricula: "",
  convenio_2_token: "",
  convenio_2_validade: null,
  convenio_2_titular: "",
  convenio_3_plano: "",
  convenio_3_matricula: "",
  convenio_3_token: "",
  convenio_3_validade: null,
  convenio_3_titular: "",
  procedimento_ids: [],
  procedimentos: [],
  parentes: [],
});
const patient = ref<IPatient | null>(null);

const proceduresList = ref<any[]>([]);
const proceduresListFiltred = ref<any[]>([]);
const preScheduleInput = ref<string>("");
const preScheduleList = ref<string[]>([]);

const parent = ref({
  cpf: "",
  nome: "",
  telefone: "",
  data_nascimento: null,
  tipo_parentesco: "",
});
const parentsList = ref([]);

function onFileSelect(event: any) {
  const file = event.files[0];
  if (file) {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imageSrcLink.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function searchProcedures(event: any) {
  if (event.query) {
    proceduresListFiltred.value = proceduresList.value.filter((procedure) =>
      procedure.nome.toLowerCase().includes(event.query.toLowerCase())
    );
  } else {
    proceduresListFiltred.value = [];
  }
}

function addProcedure(procedure: any) {
  if (procedure) {
    preScheduleList.value.push(procedure.id);
    preScheduleInput.value = "";
  } else {
    console.error("Procedimento não encontrado.");
  }
}

function addParent() {
  if (parent.value.nome && parent.value.cpf) {
    const newParent = {
      nome: parent.value.nome,
      cpf: parent.value.cpf,
      telefone: parent.value.telefone,
      data_nascimento: parent.value.data_nascimento
        ? DateUtils.formatDateBRtoISO(parent.value.data_nascimento)
        : "",
      tipo_parentesco: "Parente", // Default value, can be changed later
    };
    parentsList.value = [newParent, ...parentsList.value];

    parent.value = {
      cpf: "",
      nome: "",
      telefone: "",
      data_nascimento: null,
      tipo_parentesco: "",
    };
  } else {
    console.log("Preencha todos os campos do parente.");
  }
}

async function uploadImage(patientId: string) {
  if (!patientId) {
    console.error("ID do paciente não fornecido.");
    return;
  }
  if (imageFile.value) {
    try {
      globalLoading.value = true;
      const formData = new FormData();

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(imageFile.value, options);

      if (compressedFile) {
        formData.append("foto", compressedFile, compressedFile.name);
      }

      const response = await PatientsServices.postPatientImage(
        patientId,
        formData
      );
      if (response.data?.data) {
        imageFile.value = null;
      } else {
        console.error("Erro ao fazer upload da imagem.");
      }
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
    } finally {
      globalLoading.value = false;
    }
  } else {
    console.warn("Nenhuma imagem selecionada para upload.");
  }
}

async function salvarPaciente() {
  try {
    globalLoading.value = true;
    // Save patient data
    initialValues.value.data_nascimento = initialValues.value
      .data_nascimento_datepicker
      ? initialValues.value.data_nascimento_datepicker.toISOString()
      : "";

    // Convert convenio validade dates to ISO strings for API
    const convenioValidadeFields = [
      "convenio_1_validade",
      "convenio_2_validade",
      "convenio_3_validade",
    ];
    const originalValidadeDates = {};

    convenioValidadeFields.forEach((field) => {
      if (initialValues.value[field]) {
        originalValidadeDates[field] = initialValues.value[field];
        initialValues.value[field] = initialValues.value[field].toISOString();
      }
    });

    if (editing.value) {
      initialValues.value.id = patient.value.id;
      await PatientsServices.putPatient(
        initialValues.value.id,
        initialValues.value
      );
    } else {
      const configuredValues: { [key: string]: any } = {};
      Object.keys(initialValues.value).forEach((key) => {
        if (key === "data_nascimento_datepicker") return;
        if (
          initialValues.value[key] !== null &&
          initialValues.value[key] !== ""
        ) {
          configuredValues[key] = initialValues.value[key];
        }
      });
      await PatientsServices.postPatient(configuredValues as IPatient);
    }

    // Restore original Date objects
    convenioValidadeFields.forEach((field) => {
      if (originalValidadeDates[field]) {
        initialValues.value[field] = originalValidadeDates[field];
      }
    });

    // Delete existing parents
    if (initialValues.value.parentes.length) {
      for await (const parent of initialValues.value.parentes) {
        await PatientsServices.deletePatientParent(initialValues.value.id, {
          cpf: parent.cpf,
        });
      }
    }
    // Save parents
    if (parentsList.value.length) {
      for await (const parent of parentsList.value) {
        await PatientsServices.postPatientParent(initialValues.value.id, {
          ...parent,
          data_nascimento:
            new Date(
              DateUtils.formatDateBRtoISO(parent.data_nascimento)
            ).toISOString() || "",
        });
      }
    }

    // Delete existing procedures
    if (initialValues.value.procedimentos?.length) {
      for await (const procedure of initialValues.value.procedimentos) {
        await PatientsServices.deletePatientProcedure(initialValues.value.id, {
          procedimento_id: procedure.id,
        });
      }
    }
    // Save procedures
    if (preScheduleList.value?.length) {
      await PatientsServices.postPatientProcedure(initialValues.value.id, {
        procedimento_ids: preScheduleList.value,
      });
    }

    // Upload image if exists
    if (imageFile.value) {
      await uploadImage(initialValues.value.id);
    }

    await fetchPatientDetails();
  } catch (error) {
    console.error("Erro ao salvar paciente:", error);
  } finally {
    globalLoading.value = false;
  }
}

async function fetchProcedures() {
  try {
    globalLoading.value = true;
    const response = await ProceduresServices.getProcedures();
    if (response.data?.data) {
      proceduresList.value = response.data?.data;
    } else {
      console.error("Nenhum procedimento encontrado.");
    }
  } catch (error) {
    console.error("Erro ao buscar procedimentos:", error);
  } finally {
    globalLoading.value = false;
  }
}

async function fetchPatientDetails() {
  const patientId = router.currentRoute.value.params.id;
  if (patientId && patientId !== "novo") {
    try {
      globalLoading.value = true;
      const response = await PatientsServices.getPatient(patientId as string);
      Object.assign(initialValues.value, response.data?.data);
      patient.value = initialValues.value;
      await nextTick();
      initialValues.value.data_nascimento_datepicker = new Date(
        initialValues.value.data_nascimento
      );

      // Convert convenio validade strings to Date objects
      const convenioValidadeFields = [
        "convenio_1_validade",
        "convenio_2_validade",
        "convenio_3_validade",
      ];
      convenioValidadeFields.forEach((field) => {
        if (
          initialValues.value[field] &&
          typeof initialValues.value[field] === "string"
        ) {
          initialValues.value[field] = new Date(initialValues.value[field]);
        }
      });

      parentsList.value = initialValues.value.parentes.length
        ? [...initialValues.value.parentes]
        : [];
      preScheduleList.value =
        initialValues.value.procedimentos?.map(
          (procedure: any) => procedure.id
        ) || [];

      initialValues.value.foto_path = initialValues.value.foto_path
        ? import.meta.env.VITE_API_URL + initialValues.value.foto_path
        : null;
    } catch (error) {
      console.error("Erro ao buscar detalhes do paciente:", error);
    } finally {
      globalLoading.value = false;
    }
  } else {
    patient.value = null;
  }
}

onMounted(async () => {
  editing.value = router.currentRoute.value.params.id !== "novo";
  await fetchPatientDetails();
  await fetchProcedures();
});
</script>

<style>
::v-deep(.p-image-toolbar) {
  background: #fff !important;
  background-color: #000 !important;
}
</style>
