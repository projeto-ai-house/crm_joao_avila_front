import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import LoginView from "../views/LoginView.vue";
import PainelLayout from "../layouts/PainelLayout.vue";
import HomeView from "../views/Painel/HomeView.vue";
import { AuthenticationUtils } from "../utils/AuthenticationUtils";
import NotFoundView from "../views/Painel/NotFoundView.vue";
import ListaClinicasView from "../views/Painel/clinica/ListaClinicasView.vue";

const isAuthenticated = () => {
  const is = new AuthenticationUtils().isAuthenticated();
  return is;
};

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/painel",
    component: PainelLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: HomeView,
      },
      {
        path: "clinicas",
        name: "Clinicas",
        component: ListaClinicasView,
      },

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

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: "Login" });
  } else {
    next();
  }
});
