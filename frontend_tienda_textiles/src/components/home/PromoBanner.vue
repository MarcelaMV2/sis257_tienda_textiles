<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation, Autoplay } from 'swiper/modules'

import http from '@/plugins/axios'
import type { Producto } from '@/models/producto'
import { useRouter } from 'vue-router'
import { usarCarrito } from '@/funciones/UsarCarrito'

// ⬇️ NUEVO: imports para el modal
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const router = useRouter()

// ID de la categoría que deseas mostrar (ejemplo: 3 = "Bebidas naturales")
const ID_CATEGORIA = 3
const productos = ref<Producto[]>([])

const { agregarProducto } = usarCarrito()

// ⬇️ NUEVO: estado para mostrar el modal
const mostrarModalLogin = ref(false)

// ⬇️ NUEVO: helper para saber si está logueado
function estaLogueado(): boolean {
  // cambia 'token' si tu clave en localStorage se llama diferente
  return !!localStorage.getItem('token')
}

// ✅ Llamada al endpoint de productos por categoría
const obtenerProductosPorCategoria = async () => {
  try {
    const respuesta = await http.get(`productos/categoria/${ID_CATEGORIA}`)
    productos.value = respuesta.data
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error)
  }
}

// ⬇️ MODIFICADO: ahora valida login antes de agregar
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

// ⬇️ NUEVO: ir al login desde el modal
const irALogin = () => {
  router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
}

onMounted(() => {
  obtenerProductosPorCategoria()
})
</script>

<template>
  <section class="py-5" style="background-color: #84e6fc">
    <div class="container">
      <h3 class="fw-bold text-center mb-4 text-dark">PRODUCTOS DESTACADOS</h3>

      <Swiper
        :modules="[Navigation, Autoplay]"
        :slides-per-view="3"
        :space-between="24"
        navigation
        :autoplay="{ delay: 4000, disableOnInteraction: false }"
        loop
        class="ofertas-swiper"
      >
        <SwiperSlide v-for="producto in productos" :key="producto.id" class="tarjeta-producto">
          <div class="card-oferta shadow-sm">
            <div class="imagen-wrapper">
              <img
                :src="producto.imagenUrl || '/assets/images/default.jpg'"
                :alt="producto.nombre"
              />

              <!-- 👁️ Ícono de vista previa -->
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
              <button class="btn-comprar" @click="añadirAlCarrito(producto)">
                Añadir al carrito
              </button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
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
      <Button label="Ir al login" @click="irALogin" />
    </div>
  </Dialog>
</template>
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
