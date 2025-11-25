// ProductoDetalle.vue (tu archivo de producto detalle)
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/plugins/axios'
import type { Producto } from '@/models/producto'
import { usarCarrito } from '@/funciones/UsarCarrito'
import Dialog from 'primevue/dialog' // ⬅️ si usas PrimeVue
import Button from 'primevue/button'

const route = useRoute()
const router = useRouter()
const producto = ref<Producto | null>(null)
const relacionados = ref<Producto[]>([])
const cantidad = ref(1)
const cargando = ref(true)
const { agregarProducto } = usarCarrito()

// 🔐 control del modal de login
const mostrarModalLogin = ref(false)

// 👀 función auxiliar para saber si está logueado
function estaLogueado(): boolean {
  // Cambia 'token' por la clave que tú uses en localStorage
  return !!localStorage.getItem('token')
}

const obtenerProducto = async () => {
  cargando.value = true
  try {
    const res = await http.get(`productos/${route.params.id}`)
    producto.value = res.data

    if (producto.value?.idCategoria) {
      const rel = await http.get(`productos/categoria/${producto.value.idCategoria}`)
      relacionados.value = rel.data.filter((p: Producto) => p.id !== producto.value?.id)
    }
  } catch (err) {
    console.error('Error al obtener producto:', err)
  } finally {
    cargando.value = false
  }
}

// ⬇️ aquí metemos la validación
const añadirAlCarrito = (producto: Producto) => {
  if (!estaLogueado()) {
    mostrarModalLogin.value = true
    return
  }
  agregarProducto(producto, cantidad.value)
}

// ir al login desde el modal
const irALogin = () => {
  // opcional: mandar la ruta actual para que vuelva después de loguearse
  router.push({ name: 'login', query: { redirect: route.fullPath } })
}

onMounted(() => obtenerProducto())
watch(
  () => route.params.id,
  () => obtenerProducto(),
)

const aumentar = () => (cantidad.value += 1)
const disminuir = () => {
  if (cantidad.value > 1) cantidad.value -= 1
}
</script>

<template>
  <section class="producto-detalle container py-5" v-if="!cargando && producto">
    <div class="row g-5 align-items-start">
      <!-- 🖼 Imagen -->
      <div class="col-md-6 text-center">
        <img
          :src="producto.imagenUrl || '/assets/images/default.jpg'"
          class="img-fluid rounded shadow-sm main-img"
          :alt="producto.nombre"
        />
      </div>

      <!-- 🧾 Info -->
      <div class="col-md-6">
        <h2 class="fw-bold text-dark mb-2">{{ producto.nombre }}</h2>
        <p class="text-muted">Código: PROD-{{ producto.id }}</p>
        <h3 class="text-primary fw-semibold mb-4">Bs. {{ producto.precio }}</h3>

        <div class="d-flex align-items-center gap-3 mb-3">
          <label class="fw-semibold">Cantidad:</label>
          <div class="input-group cantidad-control">
            <button class="btn btn-outline-dark" @click="disminuir">−</button>
            <input type="number" v-model="cantidad" class="form-control text-center" min="1" />
            <button class="btn btn-outline-dark" @click="aumentar">+</button>
          </div>
        </div>

        <button
          class="btn btn-primary btn-lg w-100 mb-3 shadow-sm"
          @click="añadirAlCarrito(producto)"
        >
          <i class="pi pi-shopping-cart me-2"></i> Agregar al Carrito
        </button>

        <!-- <p class="text-success fw-semibold mb-3">
          <i class="pi pi-check-circle me-2"></i>
          Stock disponible: {{ producto.stock }} unidades
        </p> -->

        <h5 class="fw-bold">Descripción</h5>
        <p class="text-muted">{{ producto.descripcion }}</p>
      </div>
    </div>

    <!-- 🔗 Productos relacionados -->
    <div class="relacionados mt-5">
      <h4 class="fw-bold mb-4">Productos Relacionados</h4>

      <div class="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-3">
        <div
          class="col d-flex justify-content-center"
          v-for="rel in relacionados"
          :key="rel.id"
          @click="$router.push(`/productos/${rel.id}`)"
        >
          <div class="card card-relacionado border-0 shadow-sm">
            <div class="img-container">
              <img
                :src="rel.imagenUrl || '/assets/images/default.jpg'"
                class="card-img-top"
                :alt="rel.nombre"
              />
            </div>
            <div class="card-body p-2 text-center">
              <h6 class="fw-semibold text-dark small mb-1">{{ rel.nombre }}</h6>
              <p class="text-primary fw-bold mb-1">Bs. {{ rel.precio }}</p>
              <button class="btn btn-outline-primary btn-sm w-100">Ver detalles</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div v-else class="text-center py-5 text-muted">
    <div class="spinner-border text-primary mb-3"></div>
    <p>Cargando producto...</p>
  </div>

  <!-- 🔒 Modal para pedir login -->
  <Dialog
    v-model:visible="mostrarModalLogin"
    modal
    header="Inicia sesión para continuar"
    :style="{ width: '400px' }"
  >
    <p class="mb-4">Debes iniciar sesión para agregar productos al carrito.</p>
    <div class="d-flex justify-content-end gap-2">
      <Button label="Cerrar" class="p-button-text" @click="mostrarModalLogin = false" />
      <Button label="Ir al login" @click="irALogin" />
    </div>
  </Dialog>
</template>

<style scoped>
.cantidad-control {
  width: 130px; /* ancho compacto */
  flex: 0 0 auto; /* que NO se estire a todo el ancho */
}

.cantidad-control .form-control {
  text-align: center;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

/* Opcional: ocultar flechitas del number */
.cantidad-control input[type='number']::-webkit-outer-spin-button,
.cantidad-control input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.cantidad-control input[type='number'] {
  -moz-appearance: textfield;
}
/* Contenedor fijo para imágenes relacionadas */
.img-container {
  width: 100%;
  height: 150px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-relacionado {
  width: 160px; /* ajusta según tu diseño */
  margin-left: auto;
  margin-right: auto;
}
</style>
