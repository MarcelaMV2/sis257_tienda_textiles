<script setup lang="ts">
import { usarCarrito } from '@/funciones/UsarCarrito'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const {
  carrito,
  eliminarProducto,
  vaciarCarrito,
  totalCarrito,
  incrementarCantidad,
  disminuirCantidad,
} = usarCarrito()
const router = useRouter()

const subtotal = computed(() => totalCarrito().toFixed(2))
</script>

<template>
  <div class="contenedor-carrito container py-5">
    <div class="row g-4">
      <!-- 🛍️ Lista de productos -->
      <div class="col-lg-8">
        <h3 class="fw-bold mb-4 text-primary">Tu carrito de compras</h3>

        <div v-if="carrito.length === 0" class="alert alert-info">
          No tienes productos en tu carrito.
        </div>

        <div v-else class="lista-productos">
          <div
            v-for="item in carrito"
            :key="item.producto.id"
            class="tarjeta-producto d-flex align-items-center mb-3 shadow-sm p-3 bg-white rounded"
          >
            <img
              :src="item.producto.imagenUrl || '/assets/images/default.jpg'"
              alt="imagen"
              class="img-producto me-3"
            />
            <div class="flex-grow-1">
              <h6 class="fw-semibold mb-1">{{ item.producto.nombre }}</h6>
              <p class="text-muted small mb-1">{{ item.producto.descripcion }}</p>
              <span class="fw-bold text-primary">Bs. {{ item.producto.precio.toFixed(2) }}</span>
            </div>

            <div class="d-flex align-items-center me-3">
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="disminuirCantidad(item.producto.id)"
              >
                −
              </button>
              <span class="mx-2 fw-semibold">{{ item.cantidad }}</span>
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="incrementarCantidad(item.producto.id)"
              >
                +
              </button>
            </div>

            <div class="fw-bold me-4">
              Bs. {{ (item.producto.precio * item.cantidad).toFixed(2) }}
            </div>

            <button class="btn btn-sm btn-danger" @click="eliminarProducto(item.producto.id)">
              <i class="bi bi-trash"></i>
            </button>
          </div>

          <button class="btn btn-outline-danger mt-3" @click="vaciarCarrito">Vaciar carrito</button>
        </div>
      </div>

      <!-- 💳 Resumen de compra -->
      <div class="col-lg-4">
        <div class="resumen-compra shadow-sm bg-white p-4 rounded">
          <h5 class="fw-bold mb-3 text-dark">Resumen del pedido</h5>

          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Subtotal</span>
            <span class="fw-semibold">Bs. {{ subtotal }}</span>
          </div>

          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Envío</span>
            <span class="text-success">Gratis</span>
          </div>

          <hr />

          <div class="d-flex justify-content-between align-items-center mb-4">
            <h6 class="fw-bold mb-0">Total</h6>
            <h5 class="fw-bold text-primary mb-0">Bs. {{ subtotal }}</h5>
          </div>

          <button class="btn btn-success w-100 mb-3" @click="router.push('/checkout')">
            Proceder al pago
          </button>

          <button class="btn btn-outline-secondary w-100" @click="router.push('/')">
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contenedor-carrito {
  background-color: var(--color-bg);
}
.img-producto {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}
.tarjeta-producto:hover {
  transform: scale(1.01);
  transition: 0.2s ease;
}
.resumen-compra {
  border: 1px solid var(--color-gray-light);
}
button.btn-success {
  background-color: var(--color-accent);
  border: none;
}
button.btn-success:hover {
  background-color: var(--color-primary);
}
</style>
