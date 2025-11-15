<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import { useRouter } from 'vue-router'
import { usarCarrito } from '@/funciones/UsarCarrito'
import type { Producto } from '@/models/producto'

const router = useRouter()
const productos = ref<Producto[]>([])
const cargando = ref(false)
const { agregarProducto } = usarCarrito()

const obtenerProductos = async () => {
  cargando.value = true
  try {
    const res = await http.get('productos')
    productos.value = res.data
  } catch (error) {
    console.error('Error al obtener productos:', error)
  } finally {
    cargando.value = false
  }
}

const añadirAlCarrito = (producto: Producto) => {
  agregarProducto(producto, 1)
}

const irADetalle = (producto: Producto) => {
  router.push({ name: 'detalle-producto', params: { id: producto.id } })
}

onMounted(obtenerProductos)
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
