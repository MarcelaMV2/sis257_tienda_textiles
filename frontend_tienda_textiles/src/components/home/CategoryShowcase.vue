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
  comidas: new URL('@/assets/images/comidas.jpg', import.meta.url).href,
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
      imagen:
        imagenesCategorias[slug] || new URL('@/assets/images/default.jpg', import.meta.url).href,
    }
  }),
)

// 🚨 CAMBIO CLAVE: Usar el ID para navegar a la ruta de categoría
const irACategoria = (idCategoria: number) => {
  // Usamos la ruta dinámica que típicamente maneja las categorías por ID
  router.push(`/categorias/${idCategoria}`)
}

onMounted(() => {
  obtenerLista()
})
</script>

<template>
  <section class="py-5 bg-light">
    <div class="container">
      <h3 class="fw-bold text-center mb-4 titulo-categorias">Explora nuestras categorías</h3>

      <Swiper
        :modules="[Navigation, Autoplay]"
        :slides-per-view="3"
        :space-between="24"
        :breakpoints="{
          320: { slidesPerView: 1, spaceBetween: 16 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 }
        }"
        navigation
        :autoplay="{ delay: 3500, disableOnInteraction: false }"
        loop
        class="categorias-swiper"
      >
        <SwiperSlide
          v-for="categoria in categoriasConImagen"
          :key="categoria.id"
          @click="irACategoria(categoria.id)"
          class="tarjeta-categoria"
        >
          <div class="card-categoria shadow-sm">
            <div class="imagen-wrapper">
              <img :src="categoria.imagenUrl" :alt="categoria.nombre" />
              <div class="overlay-gradient"></div>
            </div>
            <div class="info-box">
              <h5>{{ categoria.nombre }}</h5>
              <p>{{ categoria.descripcion }}</p>
              <button class="btn-ver" @click.stop="irACategoria(categoria.id)">
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
/* Sección general */
section {
  background: #f8f9fa;
}

.titulo-categorias {
  color: #1a202c;
  font-size: 2rem;
}

.categorias-swiper {
  padding-bottom: 2rem;
  padding-top: 0.5rem;
}

.tarjeta-categoria {
  cursor: pointer;
  height: auto;
}

/* Card con nuevo color: Beige/Crema elegante */
.card-categoria {
  background: linear-gradient(135deg, #faf8f5 0%, #f5f1ea 100%);
  border-radius: 16px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #e8e3db;
}

.card-categoria:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

/* Imagen ajustada para verse completa */
.imagen-wrapper {
  position: relative;
  height: 280px;
  overflow: hidden;
  background: #f0ebe3;
}

.imagen-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.4s ease;
}

.card-categoria:hover .imagen-wrapper img {
  transform: scale(1.08);
}

/* Overlay sutil en hover */
.overlay-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.15) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-categoria:hover .overlay-gradient {
  opacity: 1;
}

/* Info box con el mismo tono beige */
.info-box {
  background: linear-gradient(180deg, #f5f1ea 0%, #faf8f5 100%);
  padding: 1.25rem;
  text-align: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info-box h5 {
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #2d3748;
  font-size: 1.15rem;
}

.info-box p {
  color: #5a5a5a;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.4;
  flex-grow: 1;
}

/* Botón con acento de color cálido */
.btn-ver {
  background: linear-gradient(135deg, #d4a574 0%, #b8885f 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(180, 136, 95, 0.3);
}

.btn-ver:hover {
  background: linear-gradient(135deg, #b8885f 0%, #9d7350 100%);
  box-shadow: 0 4px 12px rgba(180, 136, 95, 0.4);
  transform: translateY(-2px);
}

/* Flechas de navegación del Swiper */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #b8885f;
  background: rgba(255, 255, 255, 0.9);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  font-size: 18px;
  font-weight: 700;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: rgba(212, 165, 116, 0.2);
}

/* 📱 RESPONSIVE PARA MÓVIL */
@media (max-width: 1024px) {
  .imagen-wrapper {
    height: 240px;
  }

  .titulo-categorias {
    font-size: 1.75rem;
  }
}

@media (max-width: 768px) {
  .titulo-categorias {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .categorias-swiper {
    padding-bottom: 1.5rem;
  }

  .imagen-wrapper {
    height: 220px;
  }

  .info-box {
    padding: 1rem;
  }

  .info-box h5 {
    font-size: 1.05rem;
  }

  .info-box p {
    font-size: 0.85rem;
    margin-bottom: 0.8rem;
  }

  .btn-ver {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  /* Flechas más pequeñas en móvil */
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    width: 35px;
    height: 35px;
  }

  :deep(.swiper-button-next:after),
  :deep(.swiper-button-prev:after) {
    font-size: 16px;
  }
}

@media (max-width: 576px) {
  .titulo-categorias {
    font-size: 1.3rem;
  }

  .imagen-wrapper {
    height: 200px;
  }

  .info-box {
    padding: 0.9rem;
  }

  .info-box h5 {
    font-size: 1rem;
    margin-bottom: 0.4rem;
  }

  .info-box p {
    font-size: 0.8rem;
    margin-bottom: 0.7rem;
  }

  .btn-ver {
    padding: 7px 14px;
    font-size: 0.85rem;
  }

  /* Flechas aún más pequeñas */
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    width: 30px;
    height: 30px;
  }

  :deep(.swiper-button-next:after),
  :deep(.swiper-button-prev:after) {
    font-size: 14px;
  }
}

/* Ajuste para pantallas muy pequeñas */
@media (max-width: 360px) {
  .imagen-wrapper {
    height: 180px;
  }

  .info-box {
    padding: 0.8rem;
  }

  .info-box h5 {
    font-size: 0.95rem;
  }

  .info-box p {
    font-size: 0.75rem;
  }

  /* Ocultar flechas en pantallas muy pequeñas */
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none;
  }
}
</style>