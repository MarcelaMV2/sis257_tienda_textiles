<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import http from '@/plugins/axios' // 👈 usa tu instancia axios configurada (como usas en tus otros componentes)
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

// contador dinámico
const carritoCount = computed(() => carrito.value.reduce((s, item) => s + item.cantidad, 0))

// 🟩 Obtener las categorías del backend
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

const cerrarMenuUsuario = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu')) {
    mostrarMenuUsuario.value = false
  }
}

// Cargar automáticamente
onMounted(() => {
  obtenerCategorias()
  verificarSesion()
  document.addEventListener('click', cerrarMenuUsuario)  // ← Agregar
})

onUnmounted(() => {
  document.removeEventListener('click', cerrarMenuUsuario)
})
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
          <i class="pi pi-instagram" style="color: #1a365d"></i>
          <i class="pi pi-facebook" style="color: #1a365d"></i>
          <i class="pi pi-envelope" style="color: #1a365d"></i>
          <i class="pi pi-youtube" style="color: #1a365d"></i>
        </div>
      </div>
    </div>

    <!-- 🔹 Middle bar -->
    <div class="middle-bar">
      <div class="container d-flex justify-content-between align-items-center flex-wrap">
        <!-- Logo -->
        <RouterLink to="/" class="logo">
          <img src="@/assets/images/logoSansa.png" alt="MiniStore" />
        </RouterLink>

        <!-- Buscador -->
        <form class="search-box d-flex">
          <input type="search" class="form-control" placeholder="Buscar productos..." />
          <button class="btn btn-search">Buscar</button>
        </form>

        <!-- Usuario / Carrito -->
        <div class="user-cart d-flex align-items-center gap-4">
          <!-- Usuario con dropdown -->
          <div class="user-menu position-relative">
            <!-- Si NO está logueado -->
            <div v-if="!usuarioLogueado" @click="irALogin" class="user-icon">
              <i class="pi pi-user"></i>
            </div>

            <!-- Si SÍ está logueado -->
            <div v-else @click="mostrarMenuUsuario = !mostrarMenuUsuario" class="user-icon">
              <i class="pi pi-user"></i>
            </div>

            <!-- Dropdown menu -->
            <div v-if="usuarioLogueado && mostrarMenuUsuario" class="user-dropdown">
              <div class="user-email">{{ emailUsuario }}</div>
              <div class="dropdown-divider"></div>
              <RouterLink to="/perfil" class="dropdown-item" @click="mostrarMenuUsuario = false">
                <i class="pi pi-user"></i> Mi Perfil
              </RouterLink>
              <RouterLink
                to="/mis-pedidos"
                class="dropdown-item"
                @click="mostrarMenuUsuario = false"
              >
                <i class="pi pi-shopping-bag"></i> Mis Pedidos
              </RouterLink>
              <div class="dropdown-divider"></div>
              <a @click="cerrarSesion" class="dropdown-item logout">
                <i class="pi pi-sign-out"></i> Cerrar Sesión
              </a>
            </div>
          </div>

          <!-- 🟢 Ícono de carrito que abre el panel lateral -->
          <div class="cart-icon position-relative" @click="mostrarCarrito = true">
            <i class="pi pi-shopping-cart"></i>
            <span v-if="carritoCount > 0" class="badge bg-primary">{{ carritoCount }}</span>
          </div>
        </div>

        <!-- 🧾 Panel lateral del carrito -->
        <CarritoPanel v-if="mostrarCarrito" @cerrar="mostrarCarrito = false" />
      </div>
    </div>

    <!-- 🔹 Navbar principal -->
    <nav class="main-navbar">
      <div class="container">
        <ul class="nav justify-content-center">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Inicio</RouterLink>
          </li>

          <!-- Categorías dinámicas -->
          <li class="nav-item dropdown" v-if="!errorCategorias">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Categorías
            </a>

            <ul class="dropdown-menu">
              <li v-if="cargandoCategorias" class="text-center text-muted px-3 py-1">
                Cargando...
              </li>
              <li v-else-if="categorias.length === 0" class="text-center text-muted px-3 py-1">
                No hay categorías
              </li>
              <li v-else v-for="cat in categorias" :key="cat.id">
                <RouterLink class="dropdown-item" :to="`/categorias/${cat.id}`">
                  {{ cat.nombre }}
                </RouterLink>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <RouterLink to="/productos" class="nav-link">Productos</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/carrito" class="nav-link">Carrito</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/perfil" class="nav-link">Mi cuenta</RouterLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* (mismo CSS que antes) */
.top-bar {
  background-color: #fabf13;
  color: white;
  font-size: 0.9rem;
  padding: 0.5rem 0;
}

.brand-logo img {
  /* Define un tamaño máximo para que el logo no sea demasiado grande */
  max-height: 25px;
  /* El width automático mantiene la proporción de la imagen */
  width: auto;
  /* Puedes agregar un poco de margen si fuera necesario */
  /* margin: 0 20px; */
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
.logo img {
  height: 100px;
}
.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
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
  opacity: 0.7;
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
</style>
