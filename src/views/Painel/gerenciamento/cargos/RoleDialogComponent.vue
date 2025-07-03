<template>
  <Dialog
    v-model:visible="props.dialogState"
    modal
    header="Edit Profile"
    :style="{ width: '40rem' }"
    @update:visible="emit('update:dialogState', $event)"
  >
    <template #header>
      <div class="flex flex-col items-start justify-start gap-0">
        <span class="font-bold whitespace-nowrap">Permissões - {{ props.inEdition?.Nome }}</span>
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
            <div
              class="flex items-center gap-2 mx-1"
              v-for="(value, i) in ['criar', 'editar', 'excluir', 'visualizar']"
              :key="i"
            >
              <Checkbox
                v-model="permissionsStates[permission.label][value]"
                :inputId="`${permission.label}-${value}`"
                :name="`${permission.label}-${value}`"
                :binary="true"
                @change="
                  editPermission({
                    permission: permission.label,
                    action: value,
                    state: permissionsStates[permission.label][value],
                  })
                "
              />
              <label :for="`${permission.label}-${value}`">
                {{ permissionLabels[value] }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <template #footer>
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
    </template> -->
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Dialog from "primevue/dialog";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import { usePermissionsStore } from "../../../../stores/permissions";
import { Checkbox, SelectButton } from "primevue";
import { RolesServices } from "../../../../services/roles/RolesServices";
import { MenuUtils } from "../../../../utils/MenuUtils";

const permissionsStore = usePermissionsStore();
const props = defineProps<{
  dialogState: boolean;
  inEdition: any;
  permissionsList?: any[];
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
  const permissionsRoleList = props.permissionsList || [];
  //@ts-ignore
  const masterPermission = import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1];
  // console.log("permissionsList", permissionsRoleList);

  const pemissionsMenuList = MenuUtils.getAllMenus();
  const uniquePermissions = new Set();
  pemissionsMenuList.forEach((menu) => {
    if (menu?.permissions) {
      menu.permissions.forEach((permission) => {
        if (
          !permission.includes(masterPermission) &&
          !permission.includes("free")
        ) {
          uniquePermissions.add(permission);
        }
      });
    }
  });
  const transformedPermissions = {};
  Array.from(uniquePermissions).forEach((perm: string) => {
    transformedPermissions[perm] = {};
  });
  permissionsList.value = Array.from(uniquePermissions).map((perm) => {
    return {
      label: perm,
      value: perm,
    };
  });

  permissionsRoleList.forEach((permission) => {
    const [perm, action] = permission.split("_");
    transformedPermissions[perm][action] = true;
  });
  permissionsStates.value = transformedPermissions;

  // console.log("pemissionsMenuList", pemissionsMenuList);
  // console.log("uniquePermissions", Array.from(uniquePermissions));
  // console.log("transformedPermissions", transformedPermissions);
}

async function editPermission(data: {
  permission: string;
  action: string;
  state: boolean;
}) {
  // console.log("Editing permissions", permissionsStates.value);
  // console.log("data", data);
  // console.log("permissionsProps", props.inEdition);

  try {
    const response = await RolesServices.putStateRole({
      role_id: props.inEdition.ID,
      ativo: data.state,
      Permissao: data.permission + "_" + data.action,
    });
    emit("saveUser", permissionsStates.value);
  } catch (error) {
    console.error("Error editing permission:", error);
  }
}

watch(
  () => props.dialogState,
  (state) => {
    if (state) {
      generatePermissions();
      console.log("inEdition", props.inEdition);
      
    }
  },
  { immediate: true }
);
</script>
