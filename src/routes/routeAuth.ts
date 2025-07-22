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
    // if (!user) {
    //   console.error("Usuário não encontrado no store.");
    //   return false;
    // }
    // Verifica se o usuário é um administrador
    // console.log(`Verificando permissões para a rota: ${to}`);
    // console.log(`Usuário atual:`, user);

    if (
      !user?.Permissoes?.length &&
      user!.Permissoes.includes(
        import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1]
      )
    ) {
      return true;
    }

    // Verifica se a rota solicitada está na lista de menus
    const menuList = MenuUtils.getAllMenus();

    const route = menuList.find((item) => {
      if (item.to?.includes("*")) {
        const trueRoute = item.to.slice(0, -2);

        return to.includes(trueRoute);
      }
      return item.to === to;
    });
    if (!route) {
      console.error(`Rota não encontrada: ${to}`);
      return false;
    }

    // Verifica se o usuário tem permissão para acessar a rota
    // if (route.permissions && route.permissions.length > 0) {
    //   const userPermissions =
    //     user!.Permissoes?.map((it) => it.split("_")[0]) || [];
    //   console.log("userPermissions:", userPermissions);
    //   console.log("route:", route);

    //   // const permissionMatched = route.permissions.some((permission: string) =>
    //   //   userPermissions.includes(permission)
    //   // );

    //   // const destination = route.to;

    //   // if (permissionMatched) {
    //   //   return { isAuthenticated: false, destination };
    //   // } else {
    //   let accessibleRoutes: any[] = [];
    //   menuList.forEach((menuItem) => {
    //     menuItem.permissions?.forEach((menuPermission: string) => {
    //       if (userPermissions.includes(menuPermission)) {
    //         accessibleRoutes.push(menuItem);
    //       }
    //     });
    //   });

    //   accessibleRoutes = accessibleRoutes.filter((route) => !!route?.to);

    //   console.log("Accessible Routes:", accessibleRoutes);

    //   if (
    //     accessibleRoutes.length > 0 &&
    //     accessibleRoutes.some((route) => route.to === to)
    //   ) {
    //     // Se o usuário tem permissão, retorna true
    //     console.log(
    //       `Usuário tem permissão, mas não está na rota: ${to}. Redirecionando para a primeira rota acessível.`
    //     );
    //     return { isAuthenticated: true, destination: to };
    //   } else {
    //     // Se o usuário não tem permissão, redireciona para a primeira rota acessível
    //     const firstAccessibleRoute = accessibleRoutes[0]?.to || "/painel";
    //     console.log(
    //       `Usuário sem permissão para a rota: ${to}. Redirecionando para: ${firstAccessibleRoute}`
    //     );
    //     return { isAuthenticated: false, destination: firstAccessibleRoute };
    //   }

    //   // return { isAuthenticated: false, destination: "/painel" };
    //   // }
    // }

    // Se todas as verificações passarem, o usuário está autenticado
    return true;
  }
}
