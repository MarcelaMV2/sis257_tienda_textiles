<script setup lang="ts">
import { usarCarrito } from '@/funciones/UsarCarrito'

const { carrito, totalCarrito, eliminarProducto } = usarCarrito()

const emit = defineEmits(['cerrar'])
</script>

<template>
  <div class="drawer-overlay" @click.self="emit('cerrar')">
    <div class="drawer">
      <header>
        <h5>Carrito</h5>
        <button @click="emit('cerrar')">✕</button>
      </header>

      <div v-if="carrito.length === 0" class="vacio">Tu carrito está vacío</div>

      <div v-else class="contenido">
        <div v-for="item in carrito" :key="item.producto.id" class="item">
          <img :src="item.producto.imagenUrl || '/assets/images/default.jpg'" />
          <div class="info">
            <h6>{{ item.producto.nombre }}</h6>
            <p>Bs. {{ item.producto.precio }} × {{ item.cantidad }}</p>
          </div>
          <button class="eliminar" @click="eliminarProducto(item.producto.id)">
            <i class="bi bi-trash"></i>
          </button>
        </div>

        <div class="total">
          <p><strong>Total:</strong> Bs. {{ totalCarrito().toFixed(2) }}</p>
          <button class="btn-finalizar">
            <RouterLink to="/carrito" class="nav-link">Finaliar Compra</RouterLink>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: flex-end;
  z-index: 999;
}

.drawer {
  background: #fff;
  width: 360px;
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
}
.cerrar {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
}

.item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border-bottom: 1px solid #edf2f7;
  padding: 0.6rem 0;
}
.item img {
  width: 55px;
  height: 55px;
  border-radius: 8px;
  object-fit: cover;
}
.item .info h6 {
  margin: 0;
  font-size: 0.9rem;
}
.eliminar {
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
}

.total {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}
.btn-finalizar {
  width: 100%;
  background: #2b6cb0;
  color: white;
  border: none;
  padding: 0.6rem;
  border-radius: 6px;
  margin-top: 0.6rem;
  cursor: pointer;
}
.btn-finalizar:hover {
  background: #1a365d;
}
.vacio {
  text-align: center;
  color: #718096;
  margin-top: 2rem;
}
</style>
