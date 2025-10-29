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

const router = useRouter()

// ID de la categoría que deseas mostrar (ejemplo: 3 = "Bebidas naturales")
const ID_CATEGORIA = 3
const productos = ref<Producto[]>([])

const { agregarProducto } = usarCarrito()
// ✅ Nueva función que llama directamente al endpoint correcto
const obtenerProductosPorCategoria = async () => {
  try {
    const respuesta = await http.get(`productos/categoria/${ID_CATEGORIA}`)
    productos.value = respuesta.data
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error)
  }
}

const añadirAlCarrito = (producto: Producto) => {
  agregarProducto(producto, 1)
}

const irADetalle = (producto: Producto) => {
  router.push({ name: 'detalle-producto', params: { id: producto.id } })
}

onMounted(() => {
  obtenerProductosPorCategoria()
})
</script>

<template>
  <section class="py-5 bg-light">
    <div class="container">
      <h3 class="fw-bold text-center mb-4 text-dark">
        Productos de la categoría “Bebidas naturales”
      </h3>

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
              <button class="btn-comprar" @click="añadirAlCarrito(producto)">Añadir al carrito</button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>
