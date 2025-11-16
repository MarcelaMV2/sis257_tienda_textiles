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
  >
    <p class="mb-4">
      Debes iniciar sesión para agregar productos al carrito.
    </p>
    <div class="d-flex justify-content-end gap-2">
      <Button
        label="Cerrar"
        class="p-button-text"
        @click="mostrarModalLogin = false"
      />
      <Button
        label="Ir al login"
        @click="irALogin"
      />
    </div>
  </Dialog>
</template>
