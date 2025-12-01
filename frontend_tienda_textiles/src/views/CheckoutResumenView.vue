<script setup lang="ts">
import { usarCarrito } from '@/funciones/UsarCarrito'
import { pedidosService } from '@/servicios/pedidosService'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { carrito, totalCarrito, vaciarCarrito } = usarCarrito()
const router = useRouter()
const procesando = ref(false)

// Cargar datos guardados
const usuario = JSON.parse(localStorage.getItem('checkoutUsuario') || '{}')
const envio = JSON.parse(localStorage.getItem('datosEnvio') || '{}')

const confirmarPedido = async () => {
  if (procesando.value) return
  procesando.value = true
  try {
    // 1️⃣ Crear el pedido principal
    const nuevoPedido = await pedidosService.crearPedido({
      id_usuario: usuario?.id || null, // si todavía no hay login
      total: totalCarrito(),
      estado: 'pendiente',
    })

    // 2️⃣ Agregar los productos del carrito al pedido
    await pedidosService.agregarProductos(
      nuevoPedido.id,
      carrito.value.map((item) => ({
        id_producto: item.producto.id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio,
      })),
    )

    // 3️⃣ Registrar el pago simulado (por ahora)
    await pedidosService.registrarPago(nuevoPedido.id, envio.metodoPago, totalCarrito())

    // 4️⃣ Guardar la información local y limpiar el carrito
    localStorage.setItem('pedidoConfirmado', JSON.stringify(nuevoPedido))
    vaciarCarrito()

    // 5️⃣ Redirigir al usuario
    router.push('/checkout/gracias')
  } catch (error) {
    console.error('Error al confirmar pedido:', error)
    alert('❌ Ocurrió un error al procesar tu pedido.')
  } finally {
    procesando.value = false
  }
}
</script>

<template>
  <div class="container py-4">
    <div class="row">
      <div class="col-md-8">
        <div class="card mb-3">
          <div class="card-body">
            <h4 class="mb-3">Revisión del pedido</h4>

            <h6 class="text-secondary">Datos del cliente</h6>
            <p>
              <b>{{ usuario.nombre }} {{ usuario.apellidos }}</b
              ><br />
              {{ usuario.email }} — {{ usuario.telefono }}
            </p>

            <h6 class="text-secondary mt-4">Dirección de envío</h6>
            <p>{{ envio.direccion }} — {{ envio.ciudad }}, {{ envio.departamento }}</p>

            <h6 class="text-secondary mt-4">Método de pago</h6>
            <p v-if="envio.metodoPago === 'efectivo'">💵 Pago en efectivo al recibir</p>
            <p v-else-if="envio.metodoPago === 'transferencia'">
              🏦 Transferencia bancaria — comprobante cargado
            </p>
            <p v-else>
              💳 Tarjeta — terminación
              {{ envio.tarjeta?.numero?.slice(-4) || '****' }}
            </p>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h6>Productos del pedido</h6>
            <ul class="list-group list-group-flush">
              <li
                v-for="item in carrito"
                :key="item.producto.id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <img
                    :src="item.producto.imagenUrl"
                    class="me-2"
                    style="width: 50px; height: 50px; border-radius: 8px"
                  />
                  {{ item.producto.nombre }}
                  <small class="text-muted">x{{ item.cantidad }}</small>
                </div>
                <span>Bs. {{ (item.producto.precio * item.cantidad).toFixed(2) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card p-3">
          <h5>Resumen</h5>
          <p class="mb-1">Subtotal: Bs. {{ totalCarrito().toFixed(2) }}</p>
          <p class="mb-1">
            Envío: Bs.
            {{
              envio.tipoEnvio === 'gratis'
                ? '0.00'
                : envio.tipoEnvio === 'estandar'
                  ? '8.00'
                  : '15.00'
            }}
          </p>
          <h4 class="mt-3">
            Total: Bs.
            {{
              (
                totalCarrito() +
                (envio.tipoEnvio === 'gratis' ? 0 : envio.tipoEnvio === 'estandar' ? 8 : 15)
              ).toFixed(2)
            }}
          </h4>
          <button
            class="btn btn-success w-100 mt-3"
            :disabled="procesando"
            @click="confirmarPedido"
          >
            {{ procesando ? 'Procesando...' : 'Confirmar pedido' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
