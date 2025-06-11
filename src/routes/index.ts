import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import LoginView from "../views/LoginView.vue";
import PainelLayout from "../layouts/PainelLayout.vue";

const isAuthenticated = () => {
  // Exemplo: return !!localStorage.getItem('user-token');
  return true; // Mude para 'true' para simular um usuário logado
};

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Login", // É uma boa prática nomear as rotas
    component: LoginView,
  },
  {
    path: "/painel",
    component: PainelLayout, // Este componente terá um <router-view> para os filhos
    meta: { requiresAuth: true }, // Metadado para indicar que a rota precisa de autenticação
    children: [
      {
        path: "dashboard", // O caminho final será /painel/dashboard
        name: "Dashboard",
        component: LoginView,
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
