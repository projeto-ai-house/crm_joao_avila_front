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
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </p>
    <template #footer>
      <div class="flex items-center gap-2">
        <Button
          label="Salvar"
          icon="pi pi-save"
          severity="success"
          class="flex-auto"
          size="small"
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
import { ref } from "vue";
import Drawer from "primevue/drawer";
import Button from "primevue/button";
import { ClinicsServices } from "../../../services/clinics/ClinicsServices";

const props = defineProps<{
  drawerState: boolean;
}>();

const emit = defineEmits<{
  (e: "update:drawerState", value: boolean): void;
  (e: "saveClinic", clinic: any): void;
}>();
</script>
