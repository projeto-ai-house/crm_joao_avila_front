// import { useUserStore } from "../stores/user";

import { useUserStore } from "../stores/user";

export class PermissionsUtils {
  public static handle(): [string, string[], boolean] {
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
}
