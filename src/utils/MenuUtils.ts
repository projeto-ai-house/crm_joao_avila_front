export class MenuUtils {
  //   private static readonly permissions = [
  //     "agendamento_visualizar",
  //     "agendamento_criar",
  //     "agendamento_editar",
  //     "agendamento_excluir",
  //     "paciente_visualizar",
  //     "paciente_criar",
  //     "paciente_editar",
  //     "paciente_excluir",
  //     "usuario_visualizar",
  //     "usuario_criar",
  //     "usuario_editar",
  //     "usuario_excluir",
  //     "relatorio_visualizar",
  //     "relatorio_criar",
  //     "relatorio_editar",
  //     "relatorio_excluir",
  //   ];
  private static readonly items = [
    {
      placeholder: "Administração",
      permissions: [
        import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1] || "master_admin",
      ],
    },
    {
      label: "Dashboard",
      pageName: "DASHBOARD",
      icon: "pi pi-th-large",
      to: "/painel/dashboard",
      permissions: [
        import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1] || "master_admin",
      ],
    },
    {
      label: "Clinicas",
      pageName: "CLINICAS",
      icon: "pi pi-building",
      to: "/painel/clinicas",
      permissions: [
        import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1] || "master_admin",
      ],
    },
    {
      label: "Médicos",
      pageName: "MEDICOS",
      icon: "pi pi-user",
      to: "/painel/medicos",
      permissions: [
        import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1] || "master_admin",
      ],
    },
    {
      label: "Convênios",
      pageName: "CONVENIOS",
      icon: "pi pi-credit-card",
      to: "/painel/convenios",
      permissions: [
        import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1] || "master_admin",
      ],
    },
    {
      placeholder: "Clinica",
      permissions: ["agendamento", "paciente", "usuario", "relatorio"],
    },
    {
      label: "Usuários",
      pageName: "USUARIOS",
      icon: "pi pi-users",
      to: "/painel/usuarios",
      permissions: ["usuario"],
    },
    {
      label: "Relatórios",
      pageName: "RELATORIOS",
      icon: "pi pi-chart-bar",
      to: "/painel/relatorios",
      permissions: ["relatorio"],
    },
    {
      label: "Agenda",
      pageName: "AGENDA",
      icon: "pi pi-calendar",
      to: "/painel/agenda",
      permissions: ["agendamento"],
    },
    {
      label: "Pacientes",
      pageName: "PACIENTES",
      icon: "pi pi-users",
      to: "/painel/pacientes",
      permissions: ["paciente"],
    },
    // {
    //   label: "Consultas",
    //   pageName: "CONSULTAS",
    //   icon: "pi pi-clipboard",
    //   to: "/painel/clinica/consultas",
    // },
    // {
    //   placeholder: "Financeiro",
    // },
    // {
    //   label: "Faturamento",
    //   pageName: "FATURAMENTO",
    //   icon: "pi pi-dollar",
    //   to: "/painel/financeiro/faturamento",
    // },
    // {
    //   label: "Contas a Pagar",
    //   pageName: "CONTAS_A_PAGAR",
    //   icon: "pi pi-money-bill",
    //   to: "/painel/financeiro/contas-a-pagar",
    // },
    {
      placeholder: "Gerenciamento",
      permissions: ["free"],
    },
    {
      label: "Cargos",
      pageName: "CARGOS",
      icon: "pi pi-briefcase",
      to: "/painel/cargos",
      permissions: [import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1] || "master_admin", "free"], // LEMBRAR DE MUDAR PERMISSÃO DEPOIS
    },
  ];

  public static getAllMenus(): any[] {
    return this.items;
  }
  public static getPermissionedMenus(
    role: string,
    userPermissions: string[]
  ): any[] {
    return this.items.filter((item) => {
      if (item.permissions && item.permissions.length > 0) {
        return item.permissions.some((pagePermission: string) => {
          // Allow items with "free" permission for everyone
          if (pagePermission === "free") {
            return true;
          }
          return userPermissions.includes(pagePermission.split("_")[0]);
        });
      }
      return true; // Include items without specific permissions
    });
  }
}
