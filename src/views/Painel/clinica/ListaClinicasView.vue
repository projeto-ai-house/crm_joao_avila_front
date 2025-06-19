<template>
  <!-- BEGIN: TopBar -->
  <div class="flex justify-between items-center pl-1 py-4 bg-white">
    <h2 class="font-semibold text-gray-500">Lista de Clínicas</h2>
    <Button
      label="Adicionar"
      icon="pi pi-plus"
      severity="primary"
      size="small"
      @click="$router.push({ name: 'clinica.create' })"
    ></Button>
  </div>
  <!-- END: TopBar -->

  <!-- BEGIN: Table -->
  <div class="border border-b-0 border-gray-200/70 rounded-lg overflow-hidden">
    <DataTable
      :value="products"
      stripedRows
      tableStyle="min-width: 50rem"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      v-model:selection="selectedProducts"
    >
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="Nome" sortable header="Nome"></Column>
      <Column field="CNPJ" sortable header="CNPJ"></Column>
      <Column field="category" sortable header="Category"></Column>
      <Column field="quantity" sortable header="Quantity"></Column>
    </DataTable>
  </div>
  <!-- END: Table -->
</template>

<script setup lang="ts">
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { Button } from "primevue";

const selectedProducts = ref([]);
const products = ref([
  {
    Nome: "Clinica A",
    CNPJ: "12.345.678/0001-90",
    category: "Category A",
    quantity: 10,
  },
  {
    Nome: "Clinica B",
    CNPJ: "98.765.432/0001-01",
    category: "Category B",
    quantity: 20,
  },
  {
    Nome: "Clinica C",
    CNPJ: "11.222.333/0001-44",
    category: "Category C",
    quantity: 30,
  },
  {
    Nome: "Clinica D",
    CNPJ: "55.666.777/0001-88",
    category: "Category D",
    quantity: 40,
  },
  {
    Nome: "Clinica E",
    CNPJ: "22.333.444/0001-55",
    category: "Category E",
    quantity: 50,
  },
  {
    Nome: "Clinica F",
    CNPJ: "44.555.666/0001-22",
    category: "Category F",
    quantity: 60,
  },
  {
    Nome: "Clinica G",
    CNPJ: "77.888.999/0001-33",
    category: "Category G",
    quantity: 70,
  },
  {
    Nome: "Clinica H",
    CNPJ: "00.111.222/0001-66",
    category: "Category H",
    quantity: 80,
  },
  {
    Nome: "Clinica I",
    CNPJ: "33.444.555/0001-99",
    category: "Category I",
    quantity: 90,
  },
  {
    Nome: "Clinica J",
    CNPJ: "66.777.888/0001-00",
    category: "Category J",
    quantity: 100,
  },
]);
</script>
