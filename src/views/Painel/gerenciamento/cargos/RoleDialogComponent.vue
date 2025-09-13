<template>
  <Dialog
    v-model:visible="props.dialogState"
    modal
    :closable="true"
    :style="{ width: '100%', maxWidth: '480px', padding: 0 }"
    contentClass="p-0"
    class="rounded-xl shadow-2xl m-2"
    @update:visible="emit('update:dialogState', $event)"
  >
    <template #header>
      <div
        class="flex flex-col items-start gap-0 px-1 pt-4 pb-1 sm:px-2 sm:pt-6 sm:pb-2"
      >
        <span class="font-bold text-lg text-gray-800 whitespace-nowrap">
          Permissões - {{ props.inEdition?.Nome }}
        </span>
        <span class="text-sm text-gray-500">
          Edite as permissões do usuário selecionado.
        </span>
      </div>
    </template>
    <div
      class="flex flex-col gap-2 px-1 sm:px-2 pb-1 pt-1 w-full sm:gap-4 sm:pb-2 sm:pt-2"
    >
      <div
        v-for="(permission, index) in permissionsList"
        :key="index"
        class="w-full border-b last:border-b-0 border-gray-100 py-1 sm:py-2"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2"
        >
          <span class="font-semibold text-gray-700">
            {{
              permission.label[0]?.toUpperCase() + permission.label?.slice(1)
            }}
          </span>
          <div class="grid grid-cols-2 sm:flex sm:items-center gap-1 sm:gap-2">
            <div
              class="flex items-center gap-1"
              v-for="(value, i) in ['criar', 'editar', 'excluir', 'visualizar']"
              :key="i"
            >
              <Checkbox
                v-model="permissionsStates[permission.label][value]"
                :inputId="`${permission.label}-${value}`"
                :name="`${permission.label}-${value}`"
                :binary="true"
                class="accent-primary"
                @change="
                  editPermission({
                    permission: permission.label,
                    action: value,
                    state: permissionsStates[permission.label][value],
                  })
                "
              />
              <label
                :for="`${permission.label}-${value}`"
                class="text-xs sm:text-sm text-gray-600 cursor-pointer"
              >
                {{ permissionLabels[value] }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Rodapé removido conforme solicitado -->
  </Dialog>
</template>

<script setup lang="ts">
import { Checkbox } from "primevue";
import Dialog from "primevue/dialog";
import { ref, watch } from "vue";
import { RolesServices } from "../../../../services/roles/RolesServices";
import { usePermissionsStore } from "../../../../stores/permissions";
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
  const filteredUniquePermissions = Array.from(uniquePermissions).filter(
    (perm) => perm !== "procedimentos"
  );
  console.log("filteredUniquePermissions", filteredUniquePermissions);

  const transformedPermissions = {};
  filteredUniquePermissions.forEach((perm: string) => {
    transformedPermissions[perm] = {};
  });
  permissionsList.value = filteredUniquePermissions.map((perm) => {
    return {
      label: perm,
      value: perm,
    };
  });
  // console.log("uniquePermissions", Array.from(uniquePermissions));

  // console.log("permissionsList", permissionsRoleList);

  permissionsRoleList.forEach((permission) => {
    const [perm, action] = permission.split("_");
    // console.log(perm, action);

    if (perm && action) transformedPermissions[perm][action] = true;
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
