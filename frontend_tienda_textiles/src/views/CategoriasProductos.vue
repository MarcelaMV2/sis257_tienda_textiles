<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import type { Producto } from '@/models/producto'
import type { Categoria } from '@/models/categoria'
import { useRoute, useRouter } from 'vue-router'
import { usarCarrito } from '@/funciones/UsarCarrito' // ✅ Importar función del carrito

const route = useRoute()
const router = useRouter()
const { agregarProducto } = usarCarrito() // ✅ Instancia del carrito

const categorias = ref<Categoria[]>([])
const productos = ref<Producto[]>([])
const categoriaSeleccionada = ref<number | null>(null)
const cargando = ref(false)

// 🟦 Obtener todas las categorías
const obtenerCategorias = async () => {
  try {
    const res = await http.get('categorias')
    categorias.value = res.data
  } catch (err) {
    console.error('Error al cargar categorías:', err)
  }
}

// 🟦 Obtener productos por categoría
const obtenerProductosPorCategoria = async (id: number) => {
  cargando.value = true
  try {
    const res = await http.get(`productos/categoria/${id}`)
    productos.value = res.data
    categoriaSeleccionada.value = id
  } catch (err) {
    console.error('Error al obtener productos:', err)
  } finally {
    cargando.value = false
  }
}

// 🟦 Seleccionar categoría
const seleccionarCategoria = (cat: Categoria) => {
  router.push({ name: 'categoria-productos', params: { id: cat.id } })
  obtenerProductosPorCategoria(cat.id)
}

// 🟦 Agregar producto al carrito
const añadirAlCarrito = (producto: Producto) => {
  agregarProducto(producto, 1)
}

// 🟦 Ir al detalle del producto
const irADetalle = (producto: Producto) => {
  router.push({ name: 'detalle-producto', params: { id: producto.id } })
}

onMounted(async () => {
  await obtenerCategorias()

  const id = Number(route.params.id)
  if (id) obtenerProductosPorCategoria(id)
})
</script>

<template>
  <div class="catalogo-container">
    <!-- 🧭 Sidebar de categorías -->
    <aside class="sidebar">
      <h5 class="titulo-sidebar">Categorías</h5>
      <ul class="lista-categorias">
        <li
          v-for="cat in categorias"
          :key="cat.id"
          :class="{ activa: cat.id === categoriaSeleccionada }"
          @click="seleccionarCategoria(cat)"
        >
          {{ cat.nombre }}
        </li>
      </ul>
    </aside>

    <!-- 🛍️ Contenido principal -->
    <main class="contenido">
      <h3 v-if="categoriaSeleccionada" class="titulo-categoria">
        {{
          categorias.find((c) => c.id === categoriaSeleccionada)?.nombre ||
          'Selecciona una categoría'
        }}
      </h3>

      <div v-if="cargando" class="mensaje-carga">Cargando productos...</div>

      <div v-else class="grid-productos">
        <div v-for="producto in productos" :key="producto.id" class="card-producto">
          <div class="imagen-wrapper" @click="irADetalle(producto)">
            <img :src="producto.imagenUrl || '/assets/images/default.jpg'" :alt="producto.nombre" />
            <div class="overlay">
              <i class="bi bi-eye-fill"></i>
            </div>
          </div>

          <div class="info">
            <h5>{{ producto.nombre }}</h5>
            <p>{{ producto.descripcion }}</p>
            <span class="precio">Bs. {{ producto.precio }}</span>
            <button class="btn-agregar" @click="añadirAlCarrito(producto)">
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>

      <div v-if="!cargando && productos.length === 0" class="mensaje-vacio">
        No hay productos en esta categoría.
      </div>
    </main>
  </div>
</template>

<style scoped>
.catalogo-container {
  display: flex;
  gap: 2rem;
  padding: 2rem 4rem;
  background-color: var(--color-bg, #f7f9fc);
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #FABF13;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 80px;
}

.titulo-sidebar {
  font-weight: 700;
  color: var(--color-dark, #1a202c);
  margin-bottom: 1rem;
}

.lista-categorias {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lista-categorias li {
  padding: 0.6rem 0.8rem;
  margin-bottom: 0.4rem;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.lista-categorias li:hover {
  background-color: var(--color-primary-light, #90cdf4);
  color: #1a365d;
}

.lista-categorias li.activa {
  background-color: var(--color-primary, #2b6cb0);
  color: white;
}

/* Contenido */
.contenido {
  flex: 1;
}

.titulo-categoria {
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--color-dark, #1a202c);
}

/* Productos */
.grid-productos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

.card-producto {
  background-color: #FAF0E6;
  border-radius: 10px;
  overflow: hidden;
  transition: 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border-color: #1a202c;
  border: 1px solid;
}

.card-producto:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  background-color: white;
}

.imagen-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.imagen-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.imagen-wrapper:hover img {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(43, 108, 176, 0.4);
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

.imagen-wrapper:hover .overlay {
  opacity: 1;
}

.info {
  padding: 1rem;
  text-align: center;
}

.info h5 {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.4rem;
}

.info p {
  font-size: 0.9rem;
  color: #718096;
  height: 36px;
  overflow: hidden;
}

.precio {
  display: block;
  color: #2b6cb0;
  font-weight: bold;
  margin: 0.5rem 0;
}

.btn-agregar {
  background-color: #2b6cb0;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.2s;
}

.btn-agregar:hover {
  background-color: #1a365d;
}

.mensaje-carga,
.mensaje-vacio {
  text-align: center;
  color: #4a5568;
  margin-top: 2rem;
}
</style>
