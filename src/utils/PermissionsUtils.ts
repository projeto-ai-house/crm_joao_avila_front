// import { useUserStore } from "../stores/user";

import { usePermissionsStore } from "../stores/permissions";
import { useUserStore } from "../stores/user";
import { MenuUtils } from "./MenuUtils";

export class PermissionsUtils {
  public static handleUser(): [string, string[], boolean] {
    // recupera dados do usuario logado
    const { user } = useUserStore();

    if (!user || !user.ID) {
      return ["", [], true];
    }

    // verificar se usuario é admin
    const [ADMIN_ROLE, ADMIN_PERMISSION] =
      import.meta.env.VITE_ADMIN_ROLENAMES?.split(",");

    if (
      user.Permissoes === ADMIN_ROLE &&
      user.Permissoes.includes(ADMIN_PERMISSION)
    ) {
      return [ADMIN_ROLE, [ADMIN_PERMISSION], false];
    } else {
      return [
        user.Role || "",
        user.Permissoes || [],
        user.Permissoes.length === 0,
      ];
    }
  }
  public static checkMethodPemission(pageRoute: string): {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
    excluir: boolean;
  } {
    const allFalse = {
      visualizar: false,
      criar: false,
      editar: false,
      excluir: false,
    };
    const allTrue = {
      visualizar: true,
      criar: true,
      editar: true,
      excluir: true,
    };
    const permissionsStore = usePermissionsStore();
    const isAdmin = permissionsStore.isMasterAdmin();
    if (isAdmin) return allTrue;

    const menuList = MenuUtils.getAllMenus();
    const currentRoute = menuList.find((item) => {
      const realItemTo = item.to?.includes("*")
        ? item.to?.replace("*", "")
        : item.to;
      // console.log("realItemTo", realItemTo);
      // console.log("pageRoute", pageRoute);

      return pageRoute?.includes(realItemTo) || item.to === pageRoute;
    });
    if (!currentRoute) return allFalse;

    const requiresdRoutePermissions: string[] = currentRoute.permissions || [];
    // console.log("requiresdRoutePermissions", requiresdRoutePermissions);
    if (requiresdRoutePermissions.length === 0) {
      return allFalse;
    }
    return {
      visualizar: requiresdRoutePermissions.some((permission) => {
        return permissionsStore.hasPermission(permission, "visualizar");
      }),
      criar: requiresdRoutePermissions.some((permission) => {
        return permissionsStore.hasPermission(permission, "criar");
      }),
      editar: requiresdRoutePermissions.some((permission) => {
        return permissionsStore.hasPermission(permission, "editar");
      }),
      excluir: requiresdRoutePermissions.some((permission) => {
        return permissionsStore.hasPermission(permission, "excluir");
      }),
    };
  }
}
