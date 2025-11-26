import { createRouter, createWebHistory } from 'vue-router'

// públicas
import HomeView from '@/views/HomeView.vue'

// layout admin
import { getTokenFromLocalStorage, parseJwt } from '@/helpers'
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

    // Rutas viejas redirigidas
    {
      path: '/categorias',
      name: 'categorias',
      redirect: '/admin/categorias',
    },
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
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
    // .

    // ADMIN (layout + children) - Solo accesible para usuarios con rol admin
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
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
        {
          path: 'pagos',
          name: 'admin-pagos',
          component: () => import('@/views/admin/PagosAdminView.vue'),
        },
        {
          path: 'departamentos',
          name: 'admin-departamentos',
          component: () => import('@/views/admin/DepartamentoView.vue'),
        },
        {
          path: 'proveedores',
          name: 'admin-proveedores',
          component: () => import('@/views/admin/ProveedorView.vue'),
        },
        {
          path: 'compras',
          name: 'admin-compras',
          component: () => import('@/views/admin/CompraView.vue'),
        },
        {
          path: 'usuarios',
          name: 'admin-usuarios',
          component: () => import('@/views/admin/UsuarioView.vue'),
        },
      ],
    },

    // Ruta de acceso denegado
    {
      path: '/acceso-denegado',
      name: 'acceso-denegado',
      component: () => import('@/views/AccesoDenegadoView.vue'),
    },
  ],
})

// Guard de navegación para verificar autenticación y rol de admin
router.beforeEach((to, from, next) => {
  const token = getTokenFromLocalStorage()

  // Verificar si la ruta requiere rol de admin
  if (to.meta?.requiresAdmin) {
    // Primero verificar si está autenticado
    if (!token) {
      // Si no hay token, redirigir al login con la URL de retorno
      return next({
        name: 'login',
        query: { returnUrl: to.fullPath },
      })
    }

    // Si tiene token, verificar el rol
    try {
      // Decodificar el token para obtener el rol del usuario
      const decoded = parseJwt(token)
      const userRole = decoded?.rol || decoded?.role || decoded?.tipo // Ajusta según tu estructura de JWT

      // Verificar si el usuario es admin
      if (userRole !== 'admin') {
        // Si está logueado pero NO es admin, mostrar acceso denegado
        return next({ name: 'acceso-denegado' })
      }

      // Si es admin, permitir acceso
      return next()
    } catch (error) {
      console.error('Error al decodificar el token:', error)
      // Si hay error al decodificar, cerrar sesión y redirigir al login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return next({
        name: 'login',
        query: { returnUrl: to.fullPath },
      })
    }
  }

  // Verificar si la ruta requiere solo autenticación (sin ser admin)
  if (to.meta?.requiresAuth && !to.meta?.requiresAdmin) {
    if (!token) {
      // Si no hay token, redirigir al login
      return next({
        name: 'login',
        query: { returnUrl: to.fullPath },
      })
    }
  }

  // Si todo está bien, continuar con la navegación
  next()
})

export default router
