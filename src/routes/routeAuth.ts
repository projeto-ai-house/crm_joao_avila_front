import { useUserStore } from "../stores/user";
import { AuthenticationUtils } from "../utils/AuthenticationUtils";
import { MenuUtils } from "../utils/MenuUtils";

export class RouteAuth {
  public static isAuthenticated(to: any): boolean {
    const is = new AuthenticationUtils().isAuthenticated();
    if (!is) return false;
    return this.checkRoutes(to.fullPath);
  }

  private static checkRoutes(to: string): boolean {
    const { user } = useUserStore();
    // Verifica se o usuário é um administrador
    if (!user?.Permissoes) {
      if (
        user.Permissoes &&
        user.Permissoes.includes(
          import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1] || ""
        )
      ) {
        return true;
      } else {
        localStorage.clear();
        return false;
      }
    }

    // Verifica se o usuário está autenticado e se o ID do usuário existe
    // if (!user || !user.ID) {
    //   console.error("Usuário não autenticado ou ID não encontrado.");
    //   return false;
    // }

    // Verifica se a rota solicitada está na lista de menus
    const menuList = MenuUtils.getAllMenus();
    const route = menuList.find((item) => item.to === to);
    if (!route) {
      console.error(`Rota não encontrada: ${to}`);
      return false;
    }

    // Verifica se o usuário tem permissão para acessar a rota
    if (route.permissions && route.permissions.length > 0) {
      const userPermissions = user.Permissoes || [];
      const hasPermission = route.permissions.some((permission: string) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        console.error(`Usuário não tem permissão para acessar a rota: ${to}`);
        return false;
      }
    }

    return true;
  }
}
