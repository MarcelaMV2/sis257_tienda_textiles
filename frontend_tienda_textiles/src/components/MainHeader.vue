<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import http from '@/plugins/axios'
import { usarCarrito } from '@/funciones/UsarCarrito'
import CarritoPanel from './CarritoPanel.vue'
import { getTokenFromLocalStorage, parseJwt } from '@/helpers'
import { useRouter } from 'vue-router'

// Estados
const categorias = ref<{ id: number; nombre: string }[]>([])
const cargandoCategorias = ref(false)
const errorCategorias = ref<string | null>(null)

const { carrito } = usarCarrito()
const mostrarCarrito = ref(false)
const router = useRouter()
const mostrarMenuUsuario = ref(false)
const usuarioLogueado = ref(false)
const emailUsuario = ref('')
const mostrarMenuMovil = ref(false)

const carritoCount = computed(() => carrito.value.reduce((s, item) => s + item.cantidad, 0))

const obtenerCategorias = async () => {
  cargandoCategorias.value = true
  errorCategorias.value = null
  try {
    const res = await http.get('categorias')
    categorias.value = res.data
  } catch (error) {
    console.error('Error al cargar categorías:', error)
    errorCategorias.value = 'No se pudieron cargar las categorías.'
  } finally {
    cargandoCategorias.value = false
  }
}

const verificarSesion = () => {
  const token = getTokenFromLocalStorage()
  if (token) {
    usuarioLogueado.value = true
    const decoded = parseJwt(token)
    emailUsuario.value = decoded?.email || 'Usuario'
  } else {
    usuarioLogueado.value = false
  }
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  usuarioLogueado.value = false
  mostrarMenuUsuario.value = false
  router.push('/')
}

const irALogin = () => {
  router.push('/login')
}

const terminoBusqueda = ref('')

const buscar = (e?: Event) => {
  if (e) e.preventDefault()
  const termino = terminoBusqueda.value.trim()
  if (termino) {
    router.push({ path: '/productos', query: { q: termino } })
  } else {
    router.push('/productos')
  }
  terminoBusqueda.value = ''
}

const cerrarMenuUsuario = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu')) {
    mostrarMenuUsuario.value = false
  }
}

onMounted(() => {
  obtenerCategorias()
  verificarSesion()
  document.addEventListener('click', cerrarMenuUsuario)
})

onUnmounted(() => {
  document.removeEventListener('click', cerrarMenuUsuario)
})

const menuMovilAbierto = ref(false)

const abrirMenuMovil = () => {
  menuMovilAbierto.value = true
}

const cerrarMenuMovil = () => {
  menuMovilAbierto.value = false
}

const mostrarBuscadorMovil = ref(false)

</script>

<template>
  <header class="header">

    <!-- 🔹 Top bar -->
    <div class="top-bar">
      <div class="container d-flex justify-content-between align-items-center">
        <span style="color: black">+ (591) 67399831</span>
        <div class="brand-logo">
          <img src="@/assets/images/sansa.png" alt="Nombre del Logo" />
        </div>
        <div class="social-icons">
          <i class="pi pi-instagram"></i>
          <i class="pi pi-facebook"></i>
          <i class="pi pi-envelope"></i>
          <i class="pi pi-youtube"></i>
        </div>
      </div>
    </div>

    <!-- 🔹 Middle bar -->
    <div class="middle-bar">
      <div class="container middle-bar-content">

        <!-- Botón hamburguesa móvil -->
        <button class="hamburger d-lg-none" @click="abrirMenuMovil">
          <i class="pi pi-bars"></i>
        </button>

        <!-- Logo -->
        <RouterLink to="/" class="logo">
          <img src="@/assets/images/logoSansa.png" alt="MiniStore" />
        </RouterLink>

        <!-- Buscador Desktop -->
        <form class="search-box desktop-search" @submit.prevent="buscar">
          <input
            v-model="terminoBusqueda"
            type="search"
            class="form-control"
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
          />
          <button type="submit" class="btn btn-search">Buscar</button>
        </form>

        <!-- Contenedor Móvil: Busqueda + Usuario + Carrito -->
        <div class="mobile-search-user-cart">
          <!-- Ícono de lupa -->
          <div class="mobile-search-icon" @click="mostrarBuscadorMovil = !mostrarBuscadorMovil">
            <i class="pi pi-search"></i>
          </div>

          <!-- Usuario / carrito -->
          <div class="user-cart d-flex align-items-center gap-2">
            <div class="user-menu position-relative">
              <div v-if="!usuarioLogueado" @click="irALogin" class="user-icon">
                <i class="pi pi-user"></i>
              </div>
              <div v-else @click="mostrarMenuUsuario = !mostrarMenuUsuario" class="user-icon">
                <i class="pi pi-user"></i>
              </div>

              <!-- Menu usuario -->
              <div v-if="usuarioLogueado && mostrarMenuUsuario" class="user-dropdown">
                <div class="user-email">{{ emailUsuario }}</div>
                <div class="dropdown-divider"></div>
                <RouterLink to="/perfil" class="dropdown-item"> <i class="pi pi-user"></i> Mi Perfil </RouterLink>
                <RouterLink to="/mis-pedidos" class="dropdown-item"><i class="pi pi-shopping-bag"></i> Mis Pedidos</RouterLink>
                <div class="dropdown-divider"></div>
                <a @click="cerrarSesion" class="dropdown-item logout"><i class="pi pi-sign-out"></i> Cerrar Sesión</a>
              </div>
            </div>

            <!-- Carrito -->
            <div class="cart-icon position-relative" @click="mostrarCarrito = true">
              <i class="pi pi-shopping-cart"></i>
              <span v-if="carritoCount > 0" class="badge bg-primary">{{ carritoCount }}</span>
            </div>
          </div>
        </div>

        <!-- Usuario / Carrito Desktop -->
        <div class="user-cart desktop-user-cart d-flex align-items-center gap-4">
          <div class="user-menu position-relative">
            <div v-if="!usuarioLogueado" @click="irALogin" class="user-icon">
              <i class="pi pi-user"></i>
            </div>
            <div v-else @click="mostrarMenuUsuario = !mostrarMenuUsuario" class="user-icon">
              <i class="pi pi-user"></i>
            </div>

            <!-- Menu usuario -->
            <div v-if="usuarioLogueado && mostrarMenuUsuario" class="user-dropdown">
              <div class="user-email">{{ emailUsuario }}</div>
              <div class="dropdown-divider"></div>
              <RouterLink to="/perfil" class="dropdown-item"> <i class="pi pi-user"></i> Mi Perfil </RouterLink>
              <RouterLink to="/mis-pedidos" class="dropdown-item"><i class="pi pi-shopping-bag"></i> Mis Pedidos</RouterLink>
              <div class="dropdown-divider"></div>
              <a @click="cerrarSesion" class="dropdown-item logout"><i class="pi pi-sign-out"></i> Cerrar Sesión</a>
            </div>
          </div>

          <!-- Carrito -->
          <div class="cart-icon position-relative" @click="mostrarCarrito = true">
            <i class="pi pi-shopping-cart"></i>
            <span v-if="carritoCount > 0" class="badge bg-primary">{{ carritoCount }}</span>
          </div>
        </div>

        <CarritoPanel v-if="mostrarCarrito" @cerrar="mostrarCarrito = false" />
      </div>

      <!-- 🔍 BUSCADOR MÓVIL EXPANDIBLE -->
      <div v-if="mostrarBuscadorMovil" class="mobile-search-box">
        <form @submit.prevent="buscar">
          <input
            v-model="terminoBusqueda"
            type="search"
            class="form-control"
            placeholder="Buscar productos..."
          />
          <button type="submit" class="btn btn-search w-100 mt-2">Buscar</button>
        </form>
      </div>

    </div>

    <!-- 🔹 Navbar Desktop -->
    <nav class="main-navbar d-none d-lg-block">
      <div class="container">
        <ul class="nav justify-content-center">
          <li class="nav-item"><RouterLink to="/" class="nav-link">Inicio</RouterLink></li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Categorías</a>
            <ul class="dropdown-menu">
              <li v-for="cat in categorias" :key="cat.id">
                <RouterLink class="dropdown-item" :to="`/categorias/${cat.id}`">{{ cat.nombre }}</RouterLink>
              </li>
            </ul>
          </li>

          <li class="nav-item"><RouterLink to="/productos" class="nav-link">Productos</RouterLink></li>
          <li class="nav-item"><RouterLink to="/carrito" class="nav-link">Carrito</RouterLink></li>
          <li class="nav-item"><RouterLink to="/perfil" class="nav-link">Mi cuenta</RouterLink></li>
        </ul>
      </div>
    </nav>

    <!-- 🔥 MENÚ MÓVIL FULLSCREEN -->
    <div class="menu-movil" v-if="menuMovilAbierto">
      <div class="menu-movil-header">
        <i class="pi pi-times close-btn" @click="cerrarMenuMovil"></i>
        <img src="@/assets/images/logoSansa.png" class="menu-logo" />
      </div>

      <ul class="menu-movil-list">
        <li @click="cerrarMenuMovil">
          <RouterLink to="/">Inicio</RouterLink>
        </li>

        <li class="submenu">
          <span>Categorías</span>
          <ul>
            <li v-for="cat in categorias" :key="cat.id" @click="cerrarMenuMovil">
              <RouterLink :to="`/categorias/${cat.id}`">{{ cat.nombre }}</RouterLink>
            </li>
          </ul>
        </li>

        <li @click="cerrarMenuMovil"><RouterLink to="/productos">Productos</RouterLink></li>
        <li @click="cerrarMenuMovil"><RouterLink to="/carrito">Carrito</RouterLink></li>
        <li @click="cerrarMenuMovil"><RouterLink to="/perfil">Mi cuenta</RouterLink></li>
      </ul>
    </div>

  </header>
</template>

<style scoped>
.top-bar {
  background-color: #fabf13;
  color: black;
  font-size: 0.9rem;
  padding: 0.5rem 0;
}

.brand-logo img {
  max-height: 25px;
  width: auto;
}

.social-icons i {
  margin-left: 1rem;
  cursor: pointer;
  transition: opacity 0.3s;
}

.social-icons i:hover {
  opacity: 0.8;
}

.middle-bar {
  background: #faf0e6;
  padding: 0.3rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.middle-bar-content {
  display: flex !important;
  justify-content: space-between;
  align-items: center !important;
  flex-wrap: nowrap;
  gap: 1rem;
}

.logo img {
  height: 100px;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}

.logo .slogan {
  color: #2b6cb0;
  font-weight: 600;
  font-size: 0.95rem;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.search-box input {
  border-radius: 30px 0 0 30px;
  border: 1px solid #ccc;
}

.search-box .btn-search {
  border-radius: 0 30px 30px 0;
  background-color: #2b6cb0;
  color: white;
  border: none;
  padding: 0 1rem;
}

.search-box .btn-search:hover {
  background-color: #1a365d;
}

.user-cart i {
  font-size: 1.4rem;
  color: #1a202c;
}

.badge {
  position: absolute;
  top: -6px;
  right: -10px;
  font-size: 0.75rem;
}

.cart-total {
  margin-left: 8px;
  font-weight: 600;
  color: #2b6cb0;
}

.main-navbar {
  padding: 5px;
  background-color: #fabf13;
}

.main-navbar .nav-link {
  color: #1a202c !important;
  font-weight: 600;
  margin: 0 1rem;
  transition: color 0.2s;
}

.main-navbar .nav-link:hover,
.main-navbar .nav-link.router-link-active {
  color: white !important;
}

.dropdown-menu {
  border-radius: 0.5rem;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-item:hover {
  background-color: #7fc3c0;
  color: white;
}

.user-menu {
  position: relative;
}

.user-icon {
  cursor: pointer;
  transition: opacity 0.3s;
}

.user-icon:hover {
  opacity: 0.5;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 220px;
  z-index: 1000;
  padding: 8px 0;
}

.user-email {
  padding: 12px 16px;
  font-weight: 600;
  color: #2b6cb0;
  font-size: 0.9rem;
}

.user-dropdown .dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: #1a202c;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
}

.user-dropdown .dropdown-item:hover {
  background: #f7fafc;
}

.user-dropdown .dropdown-item.logout {
  color: #e53e3e;
}

.user-dropdown .dropdown-item.logout:hover {
  background: #fff5f5;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

.cart-icon {
  cursor: pointer;
}

.cart-icon i {
  font-size: 1.4rem;
  color: #353535;
}

.cart-icon:hover i {
  opacity: 0.5;
}

.hamburger {
  background: none;
  border: none;
  font-size: 2rem;
  color: #1a202c;
  flex-shrink: 0;
}

/* =========== MENÚ MÓVIL FULLSCREEN =========== */

.menu-movil {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to   { transform: translateX(0); }
}

.menu-movil-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  font-size: 2rem;
  cursor: pointer;
}

.menu-logo {
  height: 50px;
}

.menu-movil-list {
  margin-top: 20px;
  list-style: none;
  padding: 0;
}

.menu-movil-list li {
  font-size: 1.3rem;
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
}

.menu-movil-list li a {
  text-decoration: none;
  color: #333;
}

.menu-movil-list .submenu > span {
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}

.submenu ul {
  margin-left: 20px;
}

/* ============================
   🔵 ESTILOS PARA PC/LAPTOP
   ============================ */
.desktop-search {
  display: flex;
}

.mobile-search-icon {
  display: none;
}

.mobile-search-box {
  display: none;
  width: 100%;
  padding: 0.7rem 1rem;
  background: #faf0e6;
  border-top: 1px solid #ddd;
  grid-column: 1 / -1;
}

.mobile-search-user-cart {
  display: none;
  align-items: center;
  gap: 1rem;
}

.desktop-user-cart {
  display: flex;
}

.mobile-search-box input {
  border-radius: 10px;
}

.mobile-search-box .btn-search {
  background-color: #2b6cb0 !important;
  color: white !important;
  border: none !important;
}

.mobile-search-box .btn-search:hover {
  background-color: #1a365d !important;
  color: white !important;
}

/* ============================
   🔵 RESPONSIVE PARA CELULAR
   ============================ */
@media (max-width: 768px) {
  .middle-bar-content {
    display: grid !important;
    grid-template-columns: auto 1fr auto;
    gap: 0.8rem;
  }

  .hamburger {
    grid-column: 1;
  }

  .logo {
    grid-column: 2;
    justify-self: center;
  }

  .logo img {
    height: 60px !important;
  }

  .desktop-search {
    display: none !important;
  }

  .desktop-user-cart {
    display: none !important;
  }

  .mobile-search-user-cart {
    display: flex !important;
    grid-column: 3;
    gap: 0.5rem;
  }

  .mobile-search-icon {
    display: block;
    font-size: 1.6rem;
    cursor: pointer;
    color: #1a202c;
  }

  .mobile-search-box {
    display: block;
  }

  .user-cart {
    gap: 0.5rem;
  }
}
</style>
