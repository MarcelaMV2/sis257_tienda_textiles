<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/plugins/axios'
import { usarCarrito } from '@/funciones/UsarCarrito'
import { getTokenFromLocalStorage, parseJwt } from '@/helpers'

const router = useRouter()
const { carrito, totalCarrito, vaciarCarrito } = usarCarrito()

// Endpoints (tu axios ya tiene baseURL /api/v1)
const EP_PEDIDOS = '/pedidos'
const EP_DETALLES = '/pedido-productos'
const EP_PAGOS = '/pagos'
const EP_UPLOADS = '/uploads' // si subes comprobantes (ya tienes UploadsController)

const subtotal = computed(() => totalCarrito().toFixed(2))

// === Estado de envío + pago ===
const usuarioId = ref<number | null>(null)

const envio = ref({
  pais: '',
  departamento: '',
  provincia: '',
  direccion: '',
  referencia: '',
  tipoEnvio: 'domicilio', // 'domicilio' | 'retiro'
})

const pago = ref({
  metodo: 'efectivo', // 'efectivo' | 'transferencia' | 'qr' | 'tarjeta'
  comprobanteFile: null as File | null, // transferencia/qr
  cardNumber: '', // tarjeta (mock)
  cardHolder: '',
  cardExp: '',
  cardCvv: '',
})

// Prevenir acceso si no hay token; tomar id de usuario del JWT
onMounted(() => {
  const token = getTokenFromLocalStorage()
  if (!token) {
    router.replace('/checkout')
    return
  }
  const payload = parseJwt(token) // { sub, iat, exp, ... }
  usuarioId.value = payload?.sub ?? null
  if (!usuarioId.value) router.replace('/checkout')
})

// ==== Helpers ====

function last4(num: string) {
  const onlyDigits = (num || '').replace(/\D/g, '')
  return onlyDigits.slice(-4) || ''
}

async function uploadComprobante(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file) // tu UploadsController recibe 'file'
  const { data } = await http.post(EP_UPLOADS, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  // adapta según respuesta de tu backend: url, path, filename, etc.
  return data?.url || data?.path || ''
}

// ==== Submit principal ====

async function confirmarPedido() {
  try {
    if (!usuarioId.value) {
      router.replace('/checkout')
      return
    }

    if (!envio.value.pais || !envio.value.departamento || !envio.value.direccion) {
      alert('Completa país, departamento y dirección.')
      return
    }
    if (carrito.value.length === 0) {
      alert('Tu carrito está vacío.')
      router.push('/carrito')
      return
    }

    // 1) Crear Pedido
    const bodyPedido = {
      idUsuario: usuarioId.value,
      total: Number(totalCarrito()),
      estado: 'pendiente',
      pais: envio.value.pais,
      departamento: envio.value.departamento,
      provincia: envio.value.provincia, // opcional si tu DTO lo marcó opcional
      direccion: envio.value.direccion,
      referencia: envio.value.referencia, // opcional
      tipoEnvio: envio.value.tipoEnvio,
      metodoPago: pago.value.metodo,
    }
    const { data: pedido } = await http.post(EP_PEDIDOS, bodyPedido)

    // 2) Crear Detalles
    for (const item of carrito.value) {
      await http.post(EP_DETALLES, {
        idPedido: pedido.id,
        idProducto: item.producto.id,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio,
      })
    }

    // 3) Crear Pago (pendiente) si corresponde
    //    - efectivo: puedes omitir crear pago o crearlo con metodo 'efectivo' y estado 'pendiente'
    /* let comprobanteUrl = ''
    let masked = '' */

    if (pago.value.metodo === 'tarjeta') {
      const masked = `**** **** **** ${last4(pago.value.cardNumber)}`
      await http.post(EP_PAGOS, {
        idPedido: pedido.id,
        metodo: 'tarjeta',
        monto: Number(totalCarrito()),
        comprobante: '',
        maskedCard: masked, // 👈 camelCase
        estado: 'pendiente',
      })
    } else {
      // efectivo (si quieres registrar el intento de pago)
      await http.post(EP_PAGOS, {
        idPedido: pedido.id,
        metodo: 'efectivo',
        monto: Number(totalCarrito()),
        comprobante: '',
        estado: 'pendiente',
      })
    }

    // 4) (Opcional) enviar correo
    try {
      await http.post(`${EP_PEDIDOS}/${pedido.id}/enviar-correo`)
    } catch {}

    // después de crear pedido y pagos, ANTES de vaciarCarrito()
    localStorage.setItem(
      'ultimoPedido',
      JSON.stringify({
        id: pedido.id,
        total: Number(totalCarrito()),
        metodoPago: pago.value.metodo,
        estado: 'pendiente', // o el que te devuelva el backend si lo retornas
        fecha: new Date().toISOString(), // o pedido.fechaCreacion si viene en la respuesta
      }),
    )

    // 5) Fin
    vaciarCarrito()
    router.push('/checkout/gracias')
  } catch (e: any) {
    console.error(e)
    alert(e?.response?.data?.message || 'No se pudo registrar el pedido.')
  }
}
</script>

<template>
  <section class="checkout-container">
    <div class="contenido">
      <!-- FORMULARIO: Envío + Pago -->
      <div class="formulario">
        <h3>2. Datos de envío y pago</h3>

        <form @submit.prevent="confirmarPedido">
          <!-- Envío -->
          <div class="campos-doble">
            <div class="campo">
              <label>País</label>
              <input v-model="envio.pais" type="text" required />
            </div>
            <div class="campo">
              <label>Departamento</label>
              <input v-model="envio.departamento" type="text" required />
            </div>
          </div>

          <div class="campos-doble">
            <div class="campo">
              <label>Provincia</label>
              <input v-model="envio.provincia" type="text" />
            </div>
            <div class="campo">
              <label>Referencia</label>
              <input
                v-model="envio.referencia"
                type="text"
                placeholder="Casa verde, 2do piso, timbre azul…"
              />
            </div>
          </div>

          <div class="campo">
            <label>Dirección de entrega</label>
            <input v-model="envio.direccion" type="text" required />
          </div>

          <div class="campo">
            <label>Tipo de envío</label>
            <select v-model="envio.tipoEnvio">
              <option value="domicilio">A domicilio</option>
              <option value="retiro">Retiro en tienda</option>
            </select>
          </div>

          <!-- Pago -->
          <div class="campo">
            <label>Método de pago</label>
            <select v-model="pago.metodo">
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="qr">QR</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          <!-- Transferencia -->
          <div v-if="pago.metodo === 'transferencia'" class="box-metodo">
            <p><strong>Nro de cuenta:</strong> 123-456789-00 (Banco X)</p>
            <p>Sube tu comprobante:</p>
            <input
              type="file"
              accept="image/*,.pdf"
              @change="
                (e) => (pago.comprobanteFile = (e.target as HTMLInputElement).files?.[0] || null)
              "
            />
          </div>

          <!-- QR -->
          <div v-if="pago.metodo === 'qr'" class="box-metodo">
            <p>Escanea el QR y sube tu comprobante:</p>
            <!-- <img src="/qr.png" alt="QR" style="max-width: 200px" /> -->
            <input
              type="file"
              accept="image/*,.pdf"
              @change="
                (e) => (pago.comprobanteFile = (e.target as HTMLInputElement).files?.[0] || null)
              "
            />
          </div>

          <!-- Tarjeta (mock) -->
          <div v-if="pago.metodo === 'tarjeta'" class="grid-tarjeta">
            <div class="campo">
              <label>Número de tarjeta</label>
              <input
                v-model="pago.cardNumber"
                inputmode="numeric"
                maxlength="19"
                placeholder="XXXX XXXX XXXX XXXX"
              />
            </div>
            <div class="campo">
              <label>Nombre (como figura en la tarjeta)</label>
              <input v-model="pago.cardHolder" type="text" />
            </div>
            <div class="campo">
              <label>Expiración (MM/AA)</label>
              <input v-model="pago.cardExp" placeholder="MM/AA" />
            </div>
            <div class="campo">
              <label>CVV</label>
              <input v-model="pago.cardCvv" inputmode="numeric" maxlength="4" />
            </div>
            <small
              >Este pago es simulado. El estado quedará <b>pendiente</b> hasta verificación.</small
            >
          </div>

          <button class="btn-continuar" type="submit">Confirmar pedido</button>
        </form>
      </div>

      <!-- RESUMEN -->
      <aside class="resumen">
        <h3>Resumen del pedido</h3>
        <div v-for="item in carrito" :key="item.producto.id" class="item-resumen">
          <img :src="item.producto.imagenUrl" />
          <div class="info">
            <p>{{ item.producto.nombre }}</p>
            <small>Cant: {{ item.cantidad }}</small>
          </div>
          <span class="precio">Bs. {{ (item.producto.precio * item.cantidad).toFixed(2) }}</span>
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
.box-metodo {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  padding: 12px;
  border-radius: 8px;
  margin: 8px 0 12px;
}
.grid-tarjeta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.grid-tarjeta .campo {
  margin-bottom: 0;
}
@media (max-width: 900px) {
  .contenido {
    grid-template-columns: 1fr;
  }
  .grid-tarjeta {
    grid-template-columns: 1fr;
  }
}
</style>
