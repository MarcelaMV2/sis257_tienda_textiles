<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { ref } from 'vue'

const slides = ref([
  {
    titulo: 'Colección Andina 2025',
    texto: 'Textiles hechos a mano con amor y tradición',
    imagen: new URL('@/assets/images/p1.png', import.meta.url).href,
  },
  {
    titulo: 'Diseños únicos pernalizados',
    texto: 'Cada prenda cuenta una historia artesanal',
    imagen: new URL('@/assets/images/p2.png', import.meta.url).href,
  },
])
</script>

<template>
  <section class="hero-banner">
    <Swiper
      :modules="[Navigation, Pagination, Autoplay]"
      navigation
      pagination
      loop
      autoplay
      class="hero-swiper"
    >
      <SwiperSlide v-for="(slide, i) in slides" :key="i">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6 text-section">
              <h1 class="display-4 text-white fw-bold" style="font-size: 70px">
                {{ slide.titulo }}
              </h1>
              <p class="lead mb-4" style="color: white; font-size: 36px">{{ slide.texto }}</p>
              <!--<RouterLink to="/shop" class="btn btn-primary text-uppercase rounded-pill">
                Comprar ahora
              </RouterLink>-->
            </div>
            <div class="col-md-6">
              <img :src="slide.imagen" alt="banner" class="img-fluid rounded-3 shadow" />
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<style scoped>
.hero-banner {
  background: var(--color-bg);
  padding: 4rem 0;
  background-color: #4b0082;
}
.hero-swiper {
  width: 100%;
}
</style>
