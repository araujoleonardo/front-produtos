import { createRouter, createWebHistory } from 'vue-router'
import {useAuthStore} from "@/stores/auth";
import HomeView from '../views/HomeView.vue'
import ProdutosView from "@/views/ProdutosView.vue";
import LoginView from "@/views/LoginView.vue";
import CategoriasView from "@/views/CategoriasView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: ProdutosView,
      meta: {
        auth: true
      }
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: CategoriasView,
      meta: {
        auth: true
      }
    }
  ]
})

router.beforeEach(async (to, from, next) =>{
  if(to.meta?.auth){
    const auth = useAuthStore();
    if (auth.token && auth.user){
      const isAutorization:Promise = await auth.checkToken();
      if (isAutorization) {
        next();
      }else{
        next({name: 'login'});
      }
    }else{
      next({name: 'login'});
    }
  }else{
    next();
  }
})

export default router
