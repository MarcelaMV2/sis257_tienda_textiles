<script setup lang="ts">
import { usarCarrito } from '@/funciones/UsarCarrito'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/plugins/axios'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const {
  carrito,
  eliminarProducto,
  vaciarCarrito,
  totalCarrito,
  incrementarCantidad,
  disminuirCantidad,
  actualizarCantidad,
} = usarCarrito()
const router = useRouter()

const subtotal = computed(() => totalCarrito().toFixed(2))

// 🔴 Mapa de errores de stock por idProducto
const erroresStock = ref<Record<number, { solicitado: number; disponible: number }>>({})
const cargandoStock = ref(false)
const mostrarModalStock = ref(false)

// ✅ Verificar stock real en el backend
async function verificarStockCarrito(): Promise<boolean> {
  erroresStock.value = {}
  if (carrito.value.length === 0) return true

  cargandoStock.value = true
  try {
    const resultados = await Promise.all(
      carrito.value.map(async (item) => {
        const { data } = await http.get(`/productos/${item.producto.id}`)
        // Ajusta "stock" si tu campo en BD se llama diferente
        return { item, stock: data.stock as number }
      }),
    )

    for (const { item, stock } of resultados) {
      if (item.cantidad > stock) {
        erroresStock.value[item.producto.id] = {
          solicitado: item.cantidad,
          disponible: stock,
        }
      }
    }

    // true si NO hay errores
    return Object.keys(erroresStock.value).length === 0
  } finally {
    cargandoStock.value = false
  }
}

// 👉 Acción del botón "Proceder al pago"
async function procederAlPago() {
  if (carrito.value.length === 0) {
    alert('Tu carrito está vacío.')
    return
  }

  const stockOk = await verificarStockCarrito()

  if (!stockOk) {
    // Hay productos sin stock suficiente
    mostrarModalStock.value = true
    return
  }

  // Todo bien, continuar al checkout
  router.push('/checkout')
}

function mostrarAlertaStock(stock: number) {
  alert(`Solo hay ${stock} unidades disponibles`)
}
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
            :class="{ 'stock-error-card': erroresStock[item.producto.id] }"
          >
            <img
              :src="item.producto.imagenUrl || '/assets/images/default.jpg'"
              alt="imagen"
              class="img-producto me-3"
            />

            <div class="flex-grow-1 producto-info">
              <h6 class="fw-semibold mb-1">{{ item.producto.nombre }}</h6>
              <p class="text-muted small mb-1 descripcion-producto">{{ item.producto.descripcion }}</p>
              <span class="fw-bold text-primary"> Bs. {{ item.producto.precio.toFixed(2) }} </span>

              <!-- 🔴 Mensaje de stock insuficiente -->
              <p v-if="erroresStock[item.producto.id]" class="stock-error-text mt-1 mb-0">
                Stock insuficiente: pediste
                {{ erroresStock[item.producto.id]?.solicitado }}, disponibles
                {{ erroresStock[item.producto.id]?.disponible }}.
              </p>
            </div>

            <div class="controles-cantidad d-flex align-items-center me-3">
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="disminuirCantidad(item.producto.id)"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                :value="item.cantidad"
                @input="
                  async (e) => {
                    const input = e.target as HTMLInputElement
                    let valor = parseInt(input.value)

                    if (isNaN(valor) || valor < 1) {
                      input.value = item.cantidad.toString()
                      return
                    }

                    // Obtener stock real del backend
                    const { data } = await http.get(`/productos/${item.producto.id}`)
                    const stockReal = data.stock

                    // Si escribe más del stock ➜ no permitirlo
                    if (valor > stockReal) {
                      mostrarAlertaStock(stockReal)
                      valor = stockReal
                      input.value = stockReal.toString()
                    }

                    actualizarCantidad(item.producto.id, valor)
                  }
                "
                @blur="
                  (e) => {
                    const valor = parseInt((e.target as HTMLInputElement).value)
                    if (isNaN(valor) || valor < 1) {
                      ;(e.target as HTMLInputElement).value = item.cantidad.toString()
                    }
                  }
                "
                class="input-cantidad mx-2 fw-semibold text-center"
              />
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="incrementarCantidad(item.producto.id)"
              >
                +
              </button>
            </div>

            <div class="precio-total fw-bold me-3">
              Bs. {{ (item.producto.precio * item.cantidad).toFixed(2) }}
            </div>

            <button class="btn btn-sm btn-danger btn-eliminar" @click="eliminarProducto(item.producto.id)">
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

          <button
            class="btn btn-success w-100 mb-3"
            :disabled="cargandoStock"
            @click="procederAlPago"
          >
            {{ cargandoStock ? 'Verificando stock...' : 'Proceder al pago' }}
          </button>

          <button class="btn btn-outline-secondary w-100" @click="router.push('/')">
            Seguir comprando
          </button>
        </div>
      </div>
    </div>

    <!-- 🧾 Modal de stock insuficiente -->
    <Dialog
      v-model:visible="mostrarModalStock"
      modal
      header="Stock insuficiente"
      :style="{ width: '450px', background: '#FABF13', color: 'black'}"
      headerStyle="background:#FABF13; color:black;"
      contentStyle="background:#FABF13; color:black;"
    >
      <p class="mb-3" style="color: black">
        Algunos productos no tienen stock suficiente. Ajusta las cantidades en tu carrito:
      </p>

      <ul class="mb-3" style="color: black">
        <li v-for="(info, id) in erroresStock" :key="id">
          {{
            carrito.find((c) => c.producto.id === Number(id))?.producto.nombre || `Producto #${id}`
          }}: pediste {{ info.solicitado }}, disponibles {{ info.disponible }}.
        </li>
      </ul>

      <div class="text-end">
        <Button label="Entendido" @click="mostrarModalStock = false" class="btn-entendido" />
      </div>
    </Dialog>
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

/* 🟥 estilos para cuando falta stock */
.stock-error-card {
  border: 1px solid #fca5a5;
  background-color: #fef2f2;
}

.stock-error-text {
  font-size: 0.8rem;
  color: #b91c1c;
}

/* Botón estilo personalizado */
.btn-entendido {
  background: red !important;
  border: 1px solid red !important;
  color: white !important;
}

.btn-entendido:hover {
  background: gray !important;
  border-color: gray !important;
  color: black !important;
}

/* 📱 ESTILOS RESPONSIVE PARA MÓVIL */
@media (max-width: 768px) {
  /* Título principal más pequeño */
  h3.fw-bold {
    font-size: 1.5rem;
  }

  /* Tarjeta de producto en columna */
  .tarjeta-producto {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 15px;
  }

  /* Imagen del producto */
  .img-producto {
    width: 100%;
    height: 150px;
    margin: 0 !important;
  }

  /* Info del producto ocupa todo el ancho */
  .producto-info {
    width: 100%;
  }

  .descripcion-producto {
    display: none; /* Ocultar descripción en móvil para ahorrar espacio */
  }

  /* Controles de cantidad centrados */
  .controles-cantidad {
    width: 100%;
    justify-content: center;
    margin: 0 !important;
  }

  .input-cantidad {
    width: 60px;
  }

  /* Precio total y botón eliminar en una fila */
  .precio-total {
    margin: 0 !important;
    flex: 1;
    text-align: left;
  }

  .btn-eliminar {
    margin-left: auto;
  }

  /* Contenedor de precio y eliminar */
  .tarjeta-producto > div:last-child,
  .tarjeta-producto > button:last-child {
    display: inline-block;
  }

  /* Crear un contenedor flex para precio y botón */
  .tarjeta-producto {
    position: relative;
  }

  .precio-total {
    display: inline-block;
  }

  .btn-eliminar {
    position: absolute;
    top: 15px;
    right: 15px;
  }

  /* Resumen del pedido sticky en móvil */
  .resumen-compra {
    position: sticky;
    bottom: 0;
    z-index: 10;
    margin-top: 20px;
  }

  /* Ajustar padding del contenedor */
  .contenedor-carrito {
    padding: 1rem !important;
  }

  /* Modal más pequeño en móvil */
  :deep(.p-dialog) {
    width: 90% !important;
    max-width: 400px !important;
  }
}

@media (max-width: 576px) {
  /* Títulos aún más pequeños en pantallas muy pequeñas */
  h3.fw-bold {
    font-size: 1.3rem;
  }

  h5.fw-bold {
    font-size: 1.1rem;
  }

  /* Imagen más pequeña */
  .img-producto {
    height: 120px;
  }

  /* Botones más compactos */
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
  }

  .input-cantidad {
    width: 50px;
    font-size: 0.9rem;
  }

  /* Padding reducido en tarjetas */
  .tarjeta-producto {
    padding: 1rem !important;
  }

  .resumen-compra {
    padding: 1rem !important;
  }
}
</style>