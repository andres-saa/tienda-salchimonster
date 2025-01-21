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
              meta: {  title:'Domicilios' },

            },
            {
              path: '/cart',
              name: 'cart',
              component: () => import('@/views/Cart.vue'),
              meta: {  title:'Carrito de compras' },

            },
            {
              path: '/sedes',
              name: 'sedes',
              component: () => import('@/views/Sedes.vue'),
              meta: {  title:'Sedes' },

            },
            {
              path: '/menu',
              name: 'Carta',
              component: () => import('@/views/Carta.vue'),
              meta: {  title:'Carta menu' },

            },

            {
              path: '/colaboraciones',
              name: 'colaboraciones',
              component: () => import('@/views/Colaboraciones.vue'),
              meta: {  title:'Colaboraciones' },

            },
            {
              path: '/rastrear-pedido',
              name: 'rastrear-pedido',
              component: () => import('@/views/Rastrear.vue'),
              meta: {  title:'Rastrear pedido' },

            },
          
            {
              path: '/sonando',
              name: 'sonando',
              component: () => import('@/views/Sonando.vue'),
              meta: {  title:'Sonando SM' },

            },
          

            {
              path: '/franquicias',
              name: 'franquicias',
              component: () => import('@/views/Franquicias.vue'),
              meta: {  title:'Franquicias' },

            },
                        

            {
              path: '/pqrs-user',
              name: 'pqrs-user',
              component: () => import('@/views/Pqr.vue'),
              meta: {  title:'PQRS' },

            },
            {
              path: '/pay',
              name: 'pay',
              component: () => import('@/views/Pay.vue'),
              meta: {  title:'Finalizar pedido' },

            },
            {
              path: '/gracias',
              name: 'gracias',
              component: () => import('@/views/Gracias.vue'),
              meta: {  title:'Muchas gracias' },

            },
          ],
        },
      ],
    },
  ],
})

router.beforeEach(async(to, from, next) => {
  

  if (to.params.menu_name) {
    // Configurar el título de la página usando el 'menu_name'
    document.title = `${to.meta.title} - ${to.params.menu_name}`;
  } else {
    // Configurar un título por defecto si no hay 'menu_name'
    document.title = to.meta.title || 'Salchimonster';
  }
  next()
})

export default router
