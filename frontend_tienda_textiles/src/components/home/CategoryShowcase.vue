<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation, Autoplay } from 'swiper/modules'

import http from '@/plugins/axios'
import type { Categoria } from '@/models/categoria'
import { useRouter } from 'vue-router'

const router = useRouter()
const ENDPOINT = 'categorias'
const categorias = ref<Categoria[]>([])

const imagenesCategorias: Record<string, string> = {
  'postres-sanos': new URL('@/assets/images/insta-item2.jpg', import.meta.url).href,
  'bebidas-naturales': new URL('@/assets/images/insta-item2.jpg', import.meta.url).href,
  'comidas': new URL('@/assets/images/comidas.jpg', import.meta.url).href,
}

const obtenerLista = async () => {
  try {
    const respuesta = await http.get(ENDPOINT)
    categorias.value = respuesta.data
  } catch (error) {
    console.error('Error al obtener categorías:', error)
  }
}

const categoriasConImagen = computed(() =>
  categorias.value.map((c) => {
    const slug = c.nombre.toLowerCase().replace(/\s+/g, '-')
    return {
      ...c,
      slug,
      imagen: imagenesCategorias[slug] || new URL('@/assets/images/default.jpg', import.meta.url).href,
    }
  }),
)

const irATienda = (slug: string) => {
  router.push({ name: 'shop', query: { categoria: slug } })
}

onMounted(() => {
  obtenerLista()
})
</script>

<template>
  <section class="py-5 bg-white">
    <div class="container">
      <h3 class="fw-bold text-center mb-4">Explora nuestras categorías</h3>

      <Swiper
        :modules="[Navigation, Autoplay]"
        :slides-per-view="3"
        :space-between="24"
        navigation
        :autoplay="{ delay: 3500, disableOnInteraction: false }"
        loop
        class="categorias-swiper"
      >
        <SwiperSlide
          v-for="categoria in categoriasConImagen"
          :key="categoria.id"
          @click="irATienda(categoria.slug)"
          class="tarjeta-categoria"
        >
          <div class="card-categoria shadow-sm">
            <div class="imagen-wrapper">
              <img :src="categoria.imagen" :alt="categoria.nombre" />
            </div>
            <div class="info-box">
              <h5>{{ categoria.nombre }}</h5>
              <p>{{ categoria.descripcion }}</p>
              <button class="btn-ver" @click.stop="irATienda(categoria.slug)">
                Ver productos
              </button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<style scoped>
.categorias-swiper {
  padding-bottom: 1.5rem;
}

.tarjeta-categoria {
  cursor: pointer;
}

.card-categoria {
  background-color: var(--color-white, #fff);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  height: 100%;
}

.card-categoria:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

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

.info-box {
  background-color: #f5f5f5;
  padding: 1rem;
  text-align: center;
}

.info-box h5 {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #1a202c;
}

.info-box p {
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
}

.btn-ver {
  background-color: #2b6cb0;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}
.btn-ver:hover {
  background-color: #1a365d;
}
</style>

