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
      label: "Inicio",
      pageName: "INICIO",
      icon: "pi pi-th-large",
      to: "/painel/inicio",
      permissions: ["free"],
      hidden: true,
    },
    {
      label: "Dashboard",
      pageName: "DASHBOARD",
      icon: "pi pi-th-large",
      to: "/painel/admindash",
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
      label: "Indicações",
      pageName: "INDICACOES",
      icon: "pi pi-link",
      to: "/painel/indicacoes",
      permissions: [
        import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1] || "master_admin",
      ],
    },
    {
      label: "Conexões",
      pageName: "CONEXOES",
      icon: "pi pi-bolt",
      to: "/painel/conexoes",
      permissions: [
        import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1] || "master_admin",
      ],
    },
    // {
    //   label: "Médicos",
    //   pageName: "MEDICOS",
    //   icon: "pi pi-user",
    //   to: "/painel/medicos",
    //   permissions: [
    //     import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1] || "master_admin",
    //   ],
    // },
    // {
    //   label: "Convênios",
    //   pageName: "CONVENIOS",
    //   icon: "pi pi-credit-card",
    //   to: "/painel/convenios",
    //   permissions: [
    //     import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1] || "master_admin",
    //   ],
    // },
    {
      placeholder: "Clinica",
      permissions: ["agendamento", "paciente", "usuario"],
    },
    {
      label: "Inicio",
      pageName: "INICIO",
      icon: "pi pi-th-large",
      to: "/painel/inicio",
      permissions: ["free"],
      hidden: true,
    },
    {
      label: "Dashboard",
      pageName: "DASHBOARD",
      icon: "pi pi-th-large",
      to: "/painel/dashboard",
      permissions: ["dashboard"],
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
      to: "/painel/relatorios/*",
      permissions: ["anameneses"],
      hidden: true,
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
      permissions: ["procedimentos", "paciente"],
    },
    {
      label: "Pacientes",
      pageName: "PACIENTES-EDIT",
      icon: "pi pi-users",
      to: "/painel/pacientes/*",
      permissions: ["procedimentos", "paciente"],
      hidden: true,
    },

    {
      label: "Consultas",
      pageName: "CONSULTAS",
      icon: "pi pi-clipboard",
      to: "/painel/clinica/consultas",
      permissions: ["relatorio"],
      hidden: true,
    },
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
      permissions: [
        // import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1] || "master_admin",
        "cargo",
      ],
    },
    {
      label: "Cargos",
      pageName: "CARGOS",
      icon: "pi pi-briefcase",
      to: "/painel/cargos",
      permissions: [
        // import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1] || "master_admin",
        "cargo",
      ], // LEMBRAR DE MUDAR PERMISSÃO DEPOIS
    },

    {
      label: "Configurações",
      pageName: "CONFIGURACOES",
      icon: "pi pi-cog",
      to: "/painel/configuracoes",
      hidden: true,
      permissions: ["free"],
    },
    {
      placeholder: "Ajuda",
      permissions: [
        // import.meta.env.VITE_ADMIN_ROLENAMES?.split(",")[1] || "master_admin",
        "free",
      ],
    },
    {
      label: "Tutoriais",
      pageName: "TUTORIAIS",
      icon: "pi pi-video",
      to: "/painel/tutoriais",
      permissions: ["free"],
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
      if (item.hidden) {
        return false;
      }
      if (item.permissions && item.permissions.length > 0) {
        return item.permissions.some((pagePermission: string) => {
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
