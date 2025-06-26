<template>
  <Dialog
    v-model:visible="props.dialogState"
    modal
    header="Edit Profile"
    :style="{ width: '40rem' }"
    @update:visible="emit('update:dialogState', $event)"
  >
    <template #header>
      <div class="flex flex-col items-start justify-start gap-2">
        <span class="font-bold whitespace-nowrap">Permissões</span>
        <span class="text-sm text-gray-500">
          Edite as permissões do usuário selecionado.
        </span>
      </div>
    </template>
    <div class="flex flex-col items-center justify-center gap-4">
      <div
        v-for="(permission, index) in permissionsList"
        :key="index"
        class="w-full"
      >
        <div class="flex items-center justify-between">
          <span class="font-semibold">{{
            permission.label[0]?.toUpperCase() + permission.label?.slice(1)
          }}</span>
          <div class="flex items-center gap-2">
            <SelectButton
              :options="
                permission.values.map((value) => ({
                  label: permissionLabels[value],
                  value: value,
                }))
              "
              optionLabel="name"
              multiple
              aria-labelledby="multiple"
            />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        label="Cancelar"
        text
        severity="secondary"
        @click="emit('update:dialogState', false)"
        autofocus
      />
      <Button
        label="Salvar"
        severity="primary"
        @click="emit('update:dialogState', false)"
        autofocus
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Dialog from "primevue/dialog";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import { usePermissionsStore } from "../../../../stores/permissions";
import { SelectButton } from "primevue";

const permissionsStore = usePermissionsStore();
const props = defineProps<{
  dialogState: boolean;
  inEdition: any;
}>();
const emit = defineEmits<{
  (e: "update:dialogState", value: boolean): void;
  (e: "saveUser", value: any): void;
}>();

const permissionsStates = ref({});
const permissionsList = ref([]);
const permissionLabels = ref({
  criar: "Criar",
  editar: "Editar",
  excluir: "Excluir",
  visualizar: "Visualizar",
});
function generatePermissions() {
  const storePermissions = { ...permissionsStore.permissions };
  delete storePermissions["master"];

  const transformedPermissions = [];

  for (const [key, value] of Object.entries(storePermissions)) {
    const availableActions = Object.keys(value).filter(
      (action) => value[action] === true
    );

    transformedPermissions.push({
      label: key,
      values: availableActions,
    });
  }

  permissionsList.value = transformedPermissions;
  permissionsStates.value = storePermissions;
}

onMounted(() => {
  generatePermissions();
});
</script>
