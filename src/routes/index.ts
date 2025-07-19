import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import PainelLayout from "../layouts/PainelLayout.vue";
import { Authentication } from "../services/auth/Authentication";
import { useUserStore } from "../stores/user";
import { AuthenticationUtils } from "../utils/AuthenticationUtils";
import LoginView from "../views/LoginView.vue";
import ClinicsListView from "../views/Painel/administracao/clinica/ClinicsListView.vue";
import AgendaView from "../views/Painel/clinicas/agenda/AgendaView.vue";
import PatientsListView from "../views/Painel/clinicas/pacientes/PatientsListView.vue";
import UsersListView from "../views/Painel/clinicas/usuarios/UsersListView.vue";
import UserConfigView from "../views/Painel/configuracoes/UserConfigView.vue";
import RoleListView from "../views/Painel/gerenciamento/cargos/RoleListView.vue";
import HomeView from "../views/Painel/HomeView.vue";
import NotFoundView from "../views/Painel/NotFoundView.vue";
import { RouteAuth } from "./routeAuth";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/recuperar-senha/:code/:email",
    name: "ValidarTokenRecuperacao",
    redirect: { name: "Login" },
    beforeEnter: async (to, from, next) => {
      const { code, email } = to.params;
      if (!code || !email) {
        next({ name: "Login" });
        return;
      }

      try {
        const codeStr = Array.isArray(code) ? code[0] : code;
        const emailStr = Array.isArray(email) ? email[0] : email;

        const response = await Authentication.validateToken(emailStr, codeStr);
        const data = await response.data;
        console.log("Response data:", data);

        if (response.status === 200) {
          const store = useUserStore();
          new AuthenticationUtils().storageToken(data?.data?.Token);
          await store.initUser();

          next({ name: "Configurações", state: { inRecovery: true } });
        } else {
          next({ name: "Login" });
        }
      } catch (error) {
        console.error("Erro ao validar token de recuperação:", error);
        next({ name: "Login" });
        return;
      }
    },
  },
  {
    path: "/recuperar-senha",
    name: "RecuperarSenhaGuard",
    redirect: { name: "Login" },
  },
  {
    path: "/painel",
    component: PainelLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: { name: "Inicio" },
      },
      {
        path: "dashboard",
        name: "Inicio",
        component: HomeView,
      },
      {
        path: "clinicas",
        name: "Clinicas",
        component: ClinicsListView,
      },
      {
        path: "usuarios",
        name: "Usuarios",
        component: UsersListView,
      },
      {
        path: "agenda",
        name: "Agenda",
        component: AgendaView,
      },
      {
        path: "pacientes",
        name: "Pacientes",
        component: PatientsListView,
      },
      {
        path: "cargos",
        name: "Cargos",
        component: RoleListView,
      },
      ////////////////////////////////
      {
        path: "configuracoes",
        name: "Configuracoes",
        component: UserConfigView,
      },
      ////////////////////////////////
      {
        path: ":pathMatch(.*)*",
        name: "PainelNotFound",
        component: NotFoundView,
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const store = useUserStore();

  try {
    await store.initUser();
  } catch {
    next({ name: "Login" });
    return;
  }

  const routeAuth = RouteAuth.isAuthenticated(to);
  if (to.meta.requiresAuth && !routeAuth) {
    next({ name: "Login" });
  } else {
    next();
  }
});
