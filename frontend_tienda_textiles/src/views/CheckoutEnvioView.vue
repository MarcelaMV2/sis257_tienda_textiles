<script setup lang="ts">
import { usarCarrito } from '@/funciones/UsarCarrito'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/plugins/axios'

const { carrito, totalCarrito, vaciarCarrito } = usarCarrito()
const router = useRouter()

const ENDPOINT_PEDIDOS = 'pedidos'
const ENDPOINT_DETALLES = 'pedido-productos'

const usuario = ref<any>(null)
const datosEnvio = ref({
  direccion: '',
  ciudad: '',
  departamento: '',
  tipoEnvio: 'domicilio',
  metodoPago: 'efectivo',
})

const subtotal = computed(() => totalCarrito().toFixed(2))

// ✅ Verificar usuario logueado
onMounted(() => {
  const usuarioGuardado = localStorage.getItem('usuario')
  if (!usuarioGuardado) {
    alert('Debes iniciar sesión antes de continuar con el pago.')
    router.push('/checkout')
  } else {
    usuario.value = JSON.parse(usuarioGuardado)
  }
})

// ✅ Registrar el pedido en el backend y enviar correo
async function confirmarPedido() {
  try {
    if (!datosEnvio.value.direccion || !datosEnvio.value.ciudad) {
      alert('Por favor completa los datos de envío.')
      return
    }

    const bodyPedido = {
      idUsuario: usuario.value.id,
      total: totalCarrito(),
      estado: 'pendiente',
      direccion: datosEnvio.value.direccion,
      ciudad: datosEnvio.value.ciudad,
      departamento: datosEnvio.value.departamento,
      tipoEnvio: datosEnvio.value.tipoEnvio,
      metodoPago: datosEnvio.value.metodoPago,
    }

    console.log('📦 Pedido enviado:', bodyPedido)
    const { data: pedido } = await http.post(ENDPOINT_PEDIDOS, bodyPedido)

    // 🧾 Registrar los productos asociados
    for (const item of carrito.value) {
      const bodyDetalle = {
        idPedido: pedido.id,
        idProducto: item.producto.id,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio,
      }
      await http.post(ENDPOINT_DETALLES, bodyDetalle)
    }

    // 💌 Enviar correo de confirmación
    try {
      await http.post(`${ENDPOINT_PEDIDOS}/${pedido.id}/enviar-correo`)
      console.log('📨 Correo de confirmación enviado.')
    } catch (error) {
      console.warn('⚠️ Error al enviar correo:', error)
    }

    // 🎉 Mostrar alerta y redirigir
    alert('✅ ¡Pedido realizado con éxito!\nRevisa tu correo para ver el detalle de tu compra.')
    vaciarCarrito()
    router.push('/checkout/gracias')
  } catch (error: any) {
    console.error(error)
    alert(error?.response?.data?.message || 'No se pudo registrar el pedido.')
  }
}
</script>

<template>
  <section class="checkout-container">
    <div class="contenido">
      <!-- FORMULARIO DE ENVÍO -->
      <div class="formulario">
        <h3>2. Datos de envío</h3>

        <form @submit.prevent="confirmarPedido">
          <div class="campo">
            <label>Dirección de entrega</label>
            <input type="text" v-model="datosEnvio.direccion" required />
          </div>

          <div class="campos-doble">
            <div class="campo">
              <label>Ciudad</label>
              <input type="text" v-model="datosEnvio.ciudad" required />
            </div>
            <div class="campo">
              <label>Departamento</label>
              <input type="text" v-model="datosEnvio.departamento" />
            </div>
          </div>

          <div class="campo">
            <label>Tipo de envío</label>
            <select v-model="datosEnvio.tipoEnvio">
              <option value="domicilio">A domicilio</option>
              <option value="retiro">Retiro en tienda</option>
            </select>
          </div>

          <div class="campo">
            <label>Método de pago</label>
            <select v-model="datosEnvio.metodoPago">
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          <button class="btn-continuar" type="submit">Confirmar pedido</button>
        </form>
      </div>

      <!-- RESUMEN DEL PEDIDO -->
      <aside class="resumen">
        <h3>Resumen del pedido</h3>
        <div v-for="item in carrito" :key="item.producto.id" class="item-resumen">
          <img :src="item.producto.imagenUrl" />
          <div class="info">
            <p>{{ item.producto.nombre }}</p>
            <small>Cant: {{ item.cantidad }}</small>
          </div>
          <span class="precio"> Bs. {{ (item.producto.precio * item.cantidad).toFixed(2) }} </span>
        </div>

        <hr />
        <div class="totales">
          <p>
            Subtotal: <span>Bs. {{ subtotal }}</span>
          </p>
          <p>Envío: <span class="envio">Gratis</span></p>
          <h4>
            Total: <span>Bs. {{ subtotal }}</span>
          </h4>
        </div>

        <router-link to="/carrito" class="volver">Volver al carrito</router-link>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.checkout-container {
  padding: 2rem;
  background: var(--color-bg);
  min-height: 80vh;
}
.contenido {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}
.formulario {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
.campo {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.campos-doble {
  display: flex;
  gap: 1rem;
}
input,
select {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.btn-continuar {
  margin-top: 1rem;
  background-color: #38b2ac;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  width: 100%;
}
.resumen {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
.item-resumen {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.item-resumen img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
}
.precio {
  font-weight: 600;
}
.envio {
  color: green;
}
.volver {
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-primary);
  text-decoration: underline;
}
</style>
