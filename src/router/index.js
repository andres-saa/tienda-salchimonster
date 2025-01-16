import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'app',
      component: () => import('@/App.vue'),
      children: [
        {
          path: '/',
          name: 'layout',
          component: () => import('@/Layout/Layout.vue'),
          children: [
            {
              path: '/',
              name: 'home',
              component: () => import('@/views/Home.vue'),
            },
            {
              path: '/cart',
              name: 'cart',
              component: () => import('@/views/Cart.vue'),
            },
            {
              path: '/sedes',
              name: 'sedes',
              component: () => import('@/views/Sedes.vue'),
            },
            {
              path: '/menu',
              name: 'Carta',
              component: () => import('@/views/Carta.vue'),
            },

            {
              path: '/colaboraciones',
              name: 'colaboraciones',
              component: () => import('@/views/Colaboraciones.vue'),
            },
            {
              path: '/rastrear-pedido',
              name: 'rastrear-pedido',
              component: () => import('@/views/Rastrear.vue'),
            },
          
            {
              path: '/sonando',
              name: 'sonando',
              component: () => import('@/views/Sonando.vue'),
            },
            {
              path: '/sonando2',
              name: 'sonando2',
              component: () => import('@/views/Sonando2.vue'),
            },

            {
              path: '/franquicias',
              name: 'franquicias',
              component: () => import('@/views/Franquicias.vue'),
            },
            {
              path: '/pqrs-user',
              name: 'pqrs-user',
              component: () => import('@/views/Pqr.vue'),
            },
            {
              path: '/pay',
              name: 'pay',
              component: () => import('@/views/Pay.vue'),
            },
            {
              path: '/gracias',
              name: 'gracias',
              component: () => import('@/views/Gracias.vue'),
            },
          ],
        },
      ],
    },
  ],
})

export default router
