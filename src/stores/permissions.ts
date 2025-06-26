import { defineStore } from "pinia";
import { ref } from "vue";

interface IPermissions {
  [key: string]: {
    [key: string]: boolean;
  };
}

export const usePermissionsStore = defineStore("permissions", () => {
  const permissions = ref<IPermissions | null>(null);
  async function setPermissions(userPermissions: string[]) {
    if (!userPermissions || userPermissions.length === 0) {
      permissions.value = null;
      return;
    }

    const permissionsObject: IPermissions = {};
    const hasMasterAdmin = userPermissions.includes("master_admin");
    permissionsObject.master = {
      admin: hasMasterAdmin,
    };

    userPermissions.forEach((permission) => {
      const parts = permission.split("_");

      if (parts.length === 2) {
        const [module, action] = parts;

        if (!permissionsObject[module]) {
          permissionsObject[module] = {};
        }

        permissionsObject[module][action] = true;
      }
    });
    permissions.value = permissionsObject;
  }

  // Função auxiliar para verificar se o usuário tem uma permissão específica
  function hasPermission(module: string, action: string): boolean {
    if (!permissions.value) return false;
    return permissions.value[module]?.[action] === true;
  }

  // Função auxiliar para verificar se o usuário tem pelo menos uma permissão em um módulo
  function hasModuleAccess(module: string): boolean {
    if (!permissions.value) return false;
    return (
      permissions.value[module] &&
      Object.keys(permissions.value[module]).length > 0
    );
  }

  // Função auxiliar para verificar se o usuário é master admin
  function isMasterAdmin(): boolean {
    if (!permissions.value) return false;
    return permissions.value.master?.admin === true;
  }
  return {
    permissions,
    setPermissions,
    hasPermission,
    hasModuleAccess,
    isMasterAdmin,
  };
});
