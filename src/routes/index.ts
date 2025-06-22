import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import LoginView from "../views/LoginView.vue";
import PainelLayout from "../layouts/PainelLayout.vue";
import HomeView from "../views/Painel/HomeView.vue";
import NotFoundView from "../views/Painel/NotFoundView.vue";
import { RouteAuth } from "./routeAuth";
import ClinicsListView from "../views/Painel/clinica/ClinicsListView.vue";

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
        path: "",
        redirect: { name: "Dashboard" },
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: HomeView,
      },
      {
        path: "clinicas",
        name: "Clinicas",
        component: ClinicsListView,
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
  const isAuthenticated = RouteAuth.isAuthenticated(to);
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login" });
  } else {
    next();
  }
});
