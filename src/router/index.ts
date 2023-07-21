import { useMainStore } from "@/stores/main"
import {createRouter, createWebHashHistory, createWebHistory} from "vue-router"

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('@/views/WelcomeView.vue')
    },
    {
      path: '/conversion-process',
      name: 'conversion-process',
      component: () => import('@/views/ProcessView.vue')
    },
    {
      path: '/jack-transformator',
      name: 'jack-transformator',
      component: () => import('@/views/JackWelcomeView.vue')
    },
    {
      path: '/jack3-transformation-process',
      name: 'jack3-transformation-process',
      component: () => import('@/views/JackProcessView.vue')
    },
    {
      path: '/select-diagrams',
      name: 'select-diagrams',
      component: () => import('@/views/SelectionView.vue'),
      beforeEnter: (to, from, next) => {
        const store = useMainStore();
        if (store.model === null) {
          next({name: 'conversion-process'});
          return;
        }

        next();
      }
    }
  ]
})

export default router