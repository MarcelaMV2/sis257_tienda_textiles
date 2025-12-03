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
  <section class="seccion-destacados py-5">
    <div class="container">
      <div class="titulo-destacados-wrapper">
        <h3 class="titulo-destacados">
          <span class="titulo-icon">✨</span>
          Productos Destacados
          <span class="titulo-icon">✨</span>
        </h3>
        <div class="titulo-underline"></div>
      </div>

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
                <i class="bi bi-cart-plus-fill me-2"></i>
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

<style scoped>
/* Sección con gradiente moderno */
.seccion-destacados {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.seccion-destacados::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

/* Título hermoso con efectos */
.titulo-destacados-wrapper {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
}

.titulo-destacados {
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(255, 255, 255, 0.3);
  animation: titleGlow 2s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  from {
    text-shadow: 
      2px 2px 4px rgba(0, 0, 0, 0.2),
      0 0 20px rgba(255, 255, 255, 0.3);
  }
  to {
    text-shadow: 
      2px 2px 4px rgba(0, 0, 0, 0.2),
      0 0 30px rgba(255, 255, 255, 0.5);
  }
}

.titulo-icon {
  display: inline-block;
  animation: iconBounce 1.5s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.titulo-underline {
  width: 120px;
  height: 5px;
  background: linear-gradient(90deg, transparent, #ffd700, transparent);
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(255, 215, 0, 0.5);
}

/* Swiper container */
.ofertas-swiper {
  padding-bottom: 2rem;
  padding-top: 0.5rem;
  position: relative;
  z-index: 1;
}

.tarjeta-producto {
  cursor: pointer;
  height: auto;
}

/* Card con nuevo color: Blanco elegante con bordes suaves */
.card-oferta {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s ease;
  border: 3px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-oferta:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 215, 0, 0.6);
}

/* Imagen ajustada */
.imagen-wrapper {
  position: relative;
  height: 260px;
  overflow: hidden;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.imagen-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  padding: 15px;
  transition: transform 0.4s ease;
}

.card-oferta:hover .imagen-wrapper img {
  transform: scale(1.1) rotate(2deg);
}

/* Overlay mejorado */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.overlay i {
  font-size: 2.5rem;
  color: white;
  animation: iconPulse 1.5s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.card-oferta:hover .overlay {
  opacity: 1;
}

/* Info box mejorada */
.info-box {
  padding: 1.5rem;
  text-align: center;
  background: white;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info-box h5 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.descripcion {
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 0.75rem;
  line-height: 1.5;
  height: 42px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.precio-oferta {
  font-size: 1.6rem;
  font-weight: 900;
  color: #667eea;
  display: block;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Botón hermoso con gradiente y efectos */
.btn-comprar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(245, 87, 108, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-comprar:hover {
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
  box-shadow: 0 8px 25px rgba(245, 87, 108, 0.6);
  transform: translateY(-3px);
}

.btn-comprar:active {
  transform: translateY(-1px);
}

.btn-comprar i {
  font-size: 1.1rem;
}

/* Flechas de navegación del Swiper */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  font-size: 20px;
  font-weight: 900;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

/* 📱 RESPONSIVE PARA MÓVIL */
@media (max-width: 1024px) {
  .titulo-destacados {
    font-size: 2rem;
  }

  .imagen-wrapper {
    height: 240px;
  }

  .info-box h5 {
    font-size: 1.1rem;
  }

  .precio-oferta {
    font-size: 1.4rem;
  }
}

@media (max-width: 768px) {
  .seccion-destacados {
    padding: 3rem 0 !important;
  }

  .titulo-destacados-wrapper {
    margin-bottom: 2rem;
  }

  .titulo-destacados {
    font-size: 1.6rem;
    letter-spacing: 1px;
  }

  .titulo-underline {
    width: 80px;
    height: 4px;
  }

  .ofertas-swiper {
    padding-bottom: 1.5rem;
  }

  .imagen-wrapper {
    height: 200px;
  }

  .imagen-wrapper img {
    padding: 12px;
  }

  .info-box {
    padding: 1.2rem;
  }

  .info-box h5 {
    font-size: 1rem;
  }

  .descripcion {
    font-size: 0.85rem;
    height: 38px;
  }

  .precio-oferta {
    font-size: 1.3rem;
    margin-bottom: 0.75rem;
  }

  .btn-comprar {
    padding: 12px 20px;
    font-size: 0.9rem;
  }

  .btn-comprar i {
    font-size: 1rem;
  }

  /* Flechas más pequeñas */
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    width: 38px;
    height: 38px;
  }

  :deep(.swiper-button-next:after),
  :deep(.swiper-button-prev:after) {
    font-size: 16px;
  }
}

@media (max-width: 576px) {
  .seccion-destacados {
    padding: 2.5rem 0 !important;
  }

  .titulo-destacados {
    font-size: 1.4rem;
  }

  .titulo-icon {
    font-size: 1.2rem;
  }

  .titulo-underline {
    width: 60px;
    height: 3px;
  }

  .card-oferta {
    border-radius: 16px;
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

  .descripcion {
    font-size: 0.8rem;
  }

  .precio-oferta {
    font-size: 1.4rem;
  }

  .btn-comprar {
    padding: 11px 18px;
    font-size: 0.85rem;
    border-radius: 10px;
  }

  /* Ocultar flechas en móviles pequeños */
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none;
  }
}

@media (max-width: 360px) {
  .titulo-destacados {
    font-size: 1.2rem;
  }

  .imagen-wrapper {
    height: 200px;
  }

  .info-box h5 {
    font-size: 1rem;
  }

  .btn-comprar {
    padding: 10px 16px;
    font-size: 0.8rem;
  }
}
</style>

<style>
/*  Modal de login para productos */
.modal-login-productos .p-dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  border-bottom: none;
  padding: 1rem 1.5rem;
  border-radius: 8px 8px 0 0;
}

.modal-login-productos .p-dialog-content {
  background-color: #f8f9fa;
  color: #2d3748;
  font-size: 0.95rem;
  text-align: center;
  padding: 1.5rem;
  border-radius: 0 0 8px 8px;
}

.modal-login-productos .p-dialog-footer {
  background-color: #f8f9fa;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: none;
}

/* Botón Cerrar */
.modal-login-productos .p-button-text {
  color: #718096 !important;
  border: 2px solid transparent !important;
  border-radius: 6px !important;
  transition: border-color 0.2s ease !important;
}
.modal-login-productos .p-button-text:hover,
.modal-login-productos .p-button-text:focus {
  border-color: #667eea !important;
  color: #667eea !important;
}

/* Botón Ir al login */
.modal-login-productos .p-button:not(.p-button-text) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
  border: none !important;
  color: white !important;
  border-radius: 6px !important;
  padding: 8px 16px !important;
  font-weight: 600 !important;
  transition: background-color 0.2s ease !important;
  transform: none !important;
}
.modal-login-productos .p-button:not(.p-button-text):hover,
.modal-login-productos .p-button:not(.p-button-text):focus {
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%) !important;
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
  color: white !important;
  border-radius: 50% !important;
  padding: 6px !important;
}

.modal-login-productos .p-dialog-close-button:hover,
.modal-login-productos .p-dialog-close-button:focus {
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

/* Modal responsive */
@media (max-width: 576px) {
  .modal-login-productos {
    width: 90% !important;
    max-width: 350px !important;
  }

  .modal-login-productos .p-dialog-header {
    font-size: 1rem;
    padding: 0.75rem 1rem;
  }

  .modal-login-productos .p-dialog-content {
    font-size: 0.85rem;
    padding: 1rem;
  }

  .modal-login-productos .p-dialog-footer {
    padding: 0.75rem 1rem;
    gap: 0.4rem;
  }

  .modal-login-productos .p-button {
    padding: 6px 12px !important;
    font-size: 0.85rem !important;
  }
}
</style>