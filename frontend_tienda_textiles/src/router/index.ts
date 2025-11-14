/* import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/admin/CategoriaView.vue'),
    },
    {
      path: '/productos',
      name: 'productos',
      component: () => import('../views/admin/ProductoView.vue'),
    },
  ],
})

export default router
 */

import { createRouter, createWebHistory } from 'vue-router'

// públicas (como ya las tenías)
import HomeView from '@/views/HomeView.vue'

// layout admin
import { getTokenFromLocalStorage } from '@/helpers'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // público
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('@/views/ShopView.vue'),
    },

    // ⚠️ Mantén tus rutas viejas pero redirige al admin (no rompe tu menú actual)
    {
      path: '/categorias',
      name: 'categorias',
      redirect: '/admin/categorias',
    },
    /* {
      path: '/productos',
      name: 'productos',
      redirect: '/admin/productos',
    }, */
    {
      path: '/productos',
      name: 'productos',
      component: () => import('@/views/ProductosView.vue'),
    },
    {
      path: '/categorias/:id?',
      name: 'categoria-productos',
      component: () => import('@/views/CategoriasProductos.vue'),
    },
    {
      path: '/productos/:id',
      name: 'detalle-producto',
      component: () => import('@/views/ProductoDetalle.vue'),
    },
    {
      path: '/carrito',
      name: 'carrito',
      component: () => import('@/views/CarritoView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue'),
    },
    {
      path: '/checkout/envio',
      name: 'checkout-envio',
      component: () => import('@/views/CheckoutEnvioView.vue'),
    },
    {
      path: '/checkout/resumen',
      name: 'checkout-resumen',
      component: () => import('@/views/CheckoutResumenView.vue'),
    },
    {
      path: '/checkout/gracias',
      name: 'checkout-gracias',
      component: () => import('@/views/CheckoutGraciasView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/mis-pedidos',
      name: 'mis-pedidos',
      component: () => import('@/views/MisPedidosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('@/views/PerfilView.vue'),
      meta: { requiresAuth: true },
    },
    // ADMIN (layout + children)
    {
      path: '/admin',
      component: AdminLayout,
      // meta: { requiresAdmin: true }, // ← cuando quieras activar guard
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/admin/productos' },

        {
          path: 'productos',
          name: 'admin-productos',
          component: () => import('@/views/admin/ProductoView.vue'),
        },
        {
          path: 'categorias',
          name: 'admin-categorias',
          component: () => import('@/views/admin/CategoriaView.vue'),
        },
        {
          path: 'pedidos',
          name: 'admin-pedidos',
          component: () => import('@/views/admin/PedidosAdminView.vue'),
        },

        // Si ya creaste estas vistas, habilítalas.
        // {
        //   path: 'pedidos',
        //   name: 'admin-pedidos',
        //   component: () => import('@/views/admin/PedidoView.vue'),
        // },
        // {
        //   path: 'pagos',
        //   name: 'admin-pagos',
        //   component: () => import('@/views/admin/PagoView.vue'),
        // },
      ],
    },

    // 404 opcional
    // { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFound.vue') },
  ],
})

/* Guard opcional para cuando agregues roles
router.beforeEach((to, _from, next) => {
  if (to.meta?.requiresAdmin) {
    const raw = localStorage.getItem('user')
    const user = raw ? JSON.parse(raw) : null
    if (!user || user.rol !== 'admin') return next('/') // o /login
  }
  next()
})
*/

/* router.beforeEach(async (to) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()

  if (authRequired && !getTokenFromLocalStorage()) {
    if (authStore) authStore.logout()
    authStore.returnUrl = to.fullPath
    return '/login'
  }
}) */
router.beforeEach((to) => {
  if (to.meta?.requiresAuth) {
    const token = getTokenFromLocalStorage()
    if (!token) {
      // opcional: si quieres recordar a dónde iba
      return { name: 'login', query: { returnUrl: to.fullPath } }
    }
  }
})

export default router
