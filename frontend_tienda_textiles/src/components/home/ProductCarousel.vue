<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
// ⚠️ Opcional: solo si quieres agregar estos productos al carrito real
import { usarCarrito } from '@/funciones/UsarCarrito'

const router = useRouter()
const { agregarProducto } = usarCarrito() // puedes quitar esto si no quieres realmente agregar

const productos = ref([
  { nombre: 'Poncho andino', precio: 120, imagen: 'product-item1.jpg' },
  { nombre: 'Bufanda de alpaca', precio: 80, imagen: 'product-item2.jpg' },
  { nombre: 'Manta color tierra', precio: 150, imagen: 'product-item3.jpg' },
])

function getImageUrl(nombreArchivo: string) {
  return new URL(`@/assets/images/${nombreArchivo}`, import.meta.url).href
}

// 🔐 control del modal
const mostrarModalLogin = ref(false)

// helper de login
function estaLogueado(): boolean {
  return !!localStorage.getItem('token') // cambia 'token' si usas otro nombre
}

const onAddToCart = (p: any) => {
  if (!estaLogueado()) {
    mostrarModalLogin.value = true
    return
  }

  // ⚠️ OJO: estos objetos NO tienen id, stock, etc.
  // Si tu carrito los necesita, tendrás que adaptarlos.
  agregarProducto(
    {
      id: 0, // o algún valor dummy
      nombre: p.nombre,
      precio: p.precio,
      imagenUrl: getImageUrl(p.imagen),
      descripcion: '',
      stock: 1,
      idCategoria: 0,
    } as any,
    1,
  )
}

// ir al login desde el modal
const irALogin = () => {
  router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
}
</script>

<template>
  <section class="products py-5" style="display: none">
    <div class="container">
      <h2 class="text-center text-dark mb-4 text-uppercase">Productos destacados</h2>
      <div class="row">
        <div class="col-md-4 mb-4" v-for="(p, i) in productos" :key="i">
          <div class="card shadow-sm border-0 rounded-4 h-100">
            <img :src="getImageUrl(p.imagen)" class="card-img-top" alt="producto" />
            <div class="card-body text-center">
              <h5 class="card-title">{{ p.nombre }}</h5>
              <p class="text-primary fs-5 fw-bold">Bs. {{ p.precio }}</p>
              <button class="btn btn-outline-dark btn-sm" @click="onAddToCart(p)">
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 🔒 Modal de login -->
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
