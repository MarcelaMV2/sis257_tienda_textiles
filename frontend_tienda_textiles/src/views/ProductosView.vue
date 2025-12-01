<script setup lang="ts">
import { ref, watch } from 'vue' // Elimina onMounted
import http from '@/plugins/axios'
import { useRouter, useRoute } from 'vue-router' // Importa useRoute
import { usarCarrito } from '@/funciones/UsarCarrito'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import type { Producto } from '@/models/producto' // Asegúrate de que esta importación esté solo una vez

const router = useRouter()
const route = useRoute() // 👈 Objeto de ruta
const productos = ref<Producto[]>([])
const cargando = ref(false)
const { agregarProducto } = usarCarrito()

// 🔐 modal de login
const mostrarModalLogin = ref(false)

function estaLogueado(): boolean {
  return !!localStorage.getItem('token') // cambia 'token' si usas otro nombre
}

// ❌ ELIMINA la función 'obtenerProductos' ya que 'cargarProductos' la reemplazará.
// ❌ ELIMINA la línea 'onMounted(obtenerProductos)'

const añadirAlCarrito = (producto: Producto) => {
  if (!estaLogueado()) {
    mostrarModalLogin.value = true
    return
  }
  agregarProducto(producto, 1)
}

const irADetalle = (producto: Producto) => {
  router.push({ name: 'detalle-producto', params: { id: producto.id } })
}

const irALogin = () => {
  router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
}

// ✅ Función ÚNICA para cargar productos, usando el término de búsqueda
const cargarProductos = async (terminoBusqueda: string = '') => {
  cargando.value = true // Construye la URL de la API: si hay término, lo añade como query parameter 'q'
  const url = terminoBusqueda
    ? `productos?q=${terminoBusqueda}` // Tu backend debe saber cómo filtrar con 'q'
    : 'productos'

  try {
    // 2. Llama a tu backend
    const res = await http.get(url)
    productos.value = res.data
  } catch (error) {
    console.error('Error al cargar productos:', error)
  } finally {
    cargando.value = false
  }
}

// ✅ 3. Observar cambios en el parámetro 'q' de la URL
// Esta función se ejecuta al inicio (por { immediate: true }) y cada vez que el
// MainHeader redirige con un nuevo término.
watch(
  () => route.query.q, // Observa el valor del query parameter 'q'
  (newQ) => {
    // newQ es el nuevo valor de 'q' o undefined si se eliminó
    cargarProductos((newQ as string) || '')
  },
  { immediate: true }, // Esto asegura que la función se ejecute al montar el componente.
)
</script>

<template>
  <section class="py-5 bg-light">
    <div class="container">
      <h3 class="fw-bold text-dark mb-4">Todos los productos</h3>

      <!-- Estado de carga -->
      <div v-if="cargando" class="text-center py-5 text-secondary">Cargando productos...</div>

      <div v-else-if="productos.length === 0" class="text-center py-5 text-muted">
        No hay productos disponibles.
      </div>

      <!-- ✅ Tarjetas de productos -->
      <div v-else class="productos-grid">
        <div
          v-for="producto in productos"
          :key="producto.id"
          class="card-oferta shadow-sm clickable-card"
        >
          <div class="imagen-wrapper">
            <img :src="producto.imagenUrl || '/assets/images/default.jpg'" :alt="producto.nombre" />
            <div class="overlay" @click="irADetalle(producto)">
              <i class="bi bi-eye-fill"></i>
            </div>
          </div>

          <div class="info-box">
            <h5>{{ producto.nombre }}</h5>
            <p class="descripcion">{{ producto.descripcion }}</p>

            <div class="precios">
              <span class="precio-oferta">Bs. {{ producto.precio }}</span>
            </div>

            <button class="btn-comprar w-100" @click="añadirAlCarrito(producto)">
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 🔒 Modal de login -->
  <Dialog
    v-model:visible="mostrarModalLogin"
    modal
    header="Inicia sesión para continuar"
    :style="{ width: '400px' }"
    class="modal-login-productos"
  >
    <p class="mb-4">Debes iniciar sesión para agregar productos al carrito.</p>
    <div class="d-flex justify-content-end gap-2">
      <Button label="Cerrar" class="p-button-text" @click="mostrarModalLogin = false" />
      <Button label="Iniciar sesión" @click="irALogin" />
    </div>
  </Dialog>
</template>

<style scoped>
/* ✅ GRID principal: 3 columnas en desktop, 2 en tablet, 1 en móvil */
.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

/* Tarjeta de producto */
.card-oferta {
  background-color: #faf0e6;
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-color: #1a202c;
  border: 1px solid;
}
.card-oferta:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  background-color: white;
}

/* Imagen y overlay */
.imagen-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
}
.imagen-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(43, 108, 176, 0.45);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}
.overlay i {
  font-size: 2rem;
  color: white;
}
.card-oferta:hover .overlay {
  opacity: 1;
}

/* Info y botones */
.info-box {
  padding: 1rem;
  text-align: center;
}
.info-box h5 {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #1a202c;
}
.descripcion {
  font-size: 0.9rem;
  color: #6b7280;
  height: 38px;
  overflow: hidden;
}
.precio-oferta {
  color: #2b6cb0;
  font-weight: 700;
  font-size: 1.1rem;
}
.btn-comprar {
  background-color: #2b6cb0;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  transition: background-color 0.2s ease;
}
.btn-comprar:hover {
  background-color: #1a365d;
}
</style>

<style>
/*  Modal de login para productos */
.modal-login-productos .p-dialog-header {
  background: linear-gradient(to right, #fceabb, #f8b500);
  color: #1a202c;
  font-weight: bold;
  font-size: 1.1rem;
  border-bottom: none;
  padding: 1rem 1.5rem;
  border-radius: 8px 8px 0 0;
}

.modal-login-productos .p-dialog-content {
  background-color: #fffaf3;
  color: #1d3e77;
  font-size: 0.95rem;
  text-align: center;
  padding: 1.5rem;
  border-radius: 0 0 8px 8px;
}

.modal-login-productos .p-dialog-footer {
  background-color: #fffaf3;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: none;
}

/* Botón Cerrar */
.modal-login-productos .p-button-text {
  color: #a0aec0 !important;
  border: 2px solid transparent !important;
  border-radius: 6px !important;
  transition: border-color 0.2s ease !important;
}
.modal-login-productos .p-button-text:hover,
.modal-login-productos .p-button-text:focus {
  border-color: #d97706 !important;
  color: #d97706 !important;
}

/* Botón Ir al login */
.modal-login-productos .p-button:not(.p-button-text) {
  background-color: #d97706 !important;
  border: none !important;
  color: white !important;
  border-radius: 6px !important;
  padding: 6px 14px !important;
  font-weight: 600 !important;
  transition: background-color 0.2s ease !important;
  transform: none !important;
}
.modal-login-productos .p-button:not(.p-button-text):hover,
.modal-login-productos .p-button:not(.p-button-text):focus {
  background-color: #b45309 !important;
  transform: none !important;
}

/* Animación */
.modal-login-productos {
  animation: fadeInScale 0.3s ease;
}
@keyframes fadeInScale {
  from {
    opacity: 0;
  }
}

/* stilos de la X para cerrar el modal */
.modal-login-productos .p-dialog-close-button {
  color: #d97706 !important;
  border-radius: 50% !important;
  padding: 6px !important;
}

.modal-login-productos .p-dialog-close-button:hover,
.modal-login-productos .p-dialog-close-button:focus {
  background-color: transparent !important;
  color: #b45309 !important;
  border-color: #b45309 !important;
}
</style>
