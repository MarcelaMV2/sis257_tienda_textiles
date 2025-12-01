<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/plugins/axios'
import { usarCarrito } from '@/funciones/UsarCarrito'
import { getTokenFromLocalStorage, parseJwt } from '@/helpers'
import qrImage from '@/assets/images/qr-sansa.png'

const router = useRouter()
const { carrito, totalCarrito, vaciarCarrito } = usarCarrito()

const EP_PEDIDOS = '/pedidos'
const EP_DETALLES = '/pedido-productos'
const EP_PAGOS = '/pagos'
const EP_UPLOADS = '/uploads'

const subtotal = computed(() => totalCarrito().toFixed(2))

const usuarioId = ref<number | null>(null)

// Lista de departamentos de Bolivia
interface Departamento {
  id: number
  nombre: string
}

const departamentos = ref<Departamento[]>([])

const envio = ref({
  pais: 'Bolivia', // Valor fijo
  idDepartamento: null as number | null, // 👈 antes 'departamento'
  ciudad: '',
  direccion: '',
  referencia: '',
  tipoEnvio: 'domicilio', // 'domicilio' | 'bus'
})

const pago = ref({
  metodo: 'transferencia', // 'transferencia' | 'qr' | 'tarjeta'
  comprobanteFile: null as File | null,
  cardNumber: '',
  cardHolder: '',
  cardExp: '',
  cardCvv: '',
})

async function cargarDepartamentos() {
  const { data } = await http.get<Departamento[]>('/departamentos') // o '/departamentos/activos'
  departamentos.value = data
}

onMounted(async () => {
  const token = getTokenFromLocalStorage()
  if (!token) {
    router.replace('/checkout')
    return
  }
  const payload = parseJwt(token)
  usuarioId.value = payload?.sub ?? null
  if (!usuarioId.value) {
    router.replace('/checkout')
    return
  }

  await cargarDepartamentos()
})

function last4(num: string) {
  const onlyDigits = (num || '').replace(/\D/g, '')
  return onlyDigits.slice(-4) || ''
}

async function uploadComprobante(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const { data } = await http.post(EP_UPLOADS, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data?.url || data?.path || ''
}

async function confirmarPedido() {
  try {
    if (!usuarioId.value) {
      router.replace('/checkout')
      return
    }

    if (!envio.value.idDepartamento || !envio.value.direccion) {
      alert('Completa departamento y dirección.')
      return
    }

    if (carrito.value.length === 0) {
      alert('Tu carrito está vacío.')
      router.push('/carrito')
      return
    }

    if (
      (pago.value.metodo === 'transferencia' || pago.value.metodo === 'qr') &&
      !pago.value.comprobanteFile
    ) {
      alert('Debes subir el comprobante de pago.')
      return
    }

    // 1) Crear Pedido
    const bodyPedido = {
      idUsuario: usuarioId.value,
      total: Number(totalCarrito()),
      estado: 'pendiente',
      pais: 'Bolivia', // Siempre Bolivia
      idDepartamento: envio.value.idDepartamento,
      provincia: envio.value.ciudad, // Se envía como provincia
      direccion: envio.value.direccion,
      referencia: envio.value.referencia,
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

    // 3) Crear Pago
    let comprobanteUrl = ''

    if (
      (pago.value.metodo === 'transferencia' || pago.value.metodo === 'qr') &&
      pago.value.comprobanteFile
    ) {
      comprobanteUrl = await uploadComprobante(pago.value.comprobanteFile)
    }

    if (pago.value.metodo === 'tarjeta') {
      const masked = `**** **** **** ${last4(pago.value.cardNumber)}`
      await http.post(EP_PAGOS, {
        idPedido: pedido.id,
        metodo: 'tarjeta',
        monto: Number(totalCarrito()),
        comprobante: '',
        maskedCard: masked,
        estado: 'pendiente',
      })
    } else {
      await http.post(EP_PAGOS, {
        idPedido: pedido.id,
        metodo: pago.value.metodo,
        monto: Number(totalCarrito()),
        comprobante: comprobanteUrl,
        estado: 'pendiente',
      })
    }

    // 4) Correo
    try {
      await http.post(`${EP_PEDIDOS}/${pedido.id}/enviar-correo`)
    } catch {}

    // 5) Guardar último pedido
    localStorage.setItem(
      'ultimoPedido',
      JSON.stringify({
        id: pedido.id,
        total: Number(totalCarrito()),
        metodoPago: pago.value.metodo,
        estado: 'pendiente',
        fecha: new Date().toISOString(),
      }),
    )

    // 6) Fin
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
      <!-- FORMULARIO -->
      <div class="formulario">
        <h2>Datos de envío y pago</h2>

        <form @submit.prevent="confirmarPedido">
          <!-- País (fijo) -->
          <div class="campo">
            <label>País</label>
            <input type="text" value="Bolivia" disabled />
          </div>

          <!-- Departamento -->
          <div class="campo">
            <label>Departamento <span class="required">*</span></label>
            <select v-model.number="envio.idDepartamento" required>
              <option value="" disabled>Selecciona un departamento</option>
              <option v-for="dept in departamentos" :key="dept.id" :value="dept.id">
                {{ dept.nombre }}
              </option>
            </select>
          </div>

          <!-- Ciudad -->
          <div class="campo">
            <label>Ciudad</label>
            <input v-model="envio.ciudad" type="text" placeholder="Ej: Sucre, Cochabamba..." />
          </div>

          <!-- Dirección y Referencia -->
          <div class="campos-doble">
            <div class="campo">
              <label>Dirección de entrega <span class="required">*</span></label>
              <input
                v-model="envio.direccion"
                type="text"
                placeholder="Calle, número, zona..."
                required
              />
            </div>
            <div class="campo">
              <label>Referencia</label>
              <input v-model="envio.referencia" type="text" placeholder="Casa verde, 2do piso..." />
            </div>
          </div>

          <!-- Tipo de envío -->
          <div class="campo">
            <label>Tipo de entrega <span class="required">*</span></label>
            <select v-model="envio.tipoEnvio" required>
              <option value="domicilio">A domicilio</option>
              <option value="bus">Envío por bus</option>
            </select>
          </div>

          <hr class="separador" />

          <!-- Método de pago -->
          <div class="campo">
            <label>Método de pago <span class="required">*</span></label>
            <select v-model="pago.metodo" required>
              <option value="transferencia">Transferencia bancaria</option>
              <option value="qr">QR</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          <!-- Transferencia -->
          <div v-if="pago.metodo === 'transferencia'" class="box-metodo">
            <p><strong>Propietario de la cuenta:</strong> Ramiro David Cuiza Murana</p>
            <p><strong>Número de cuenta:</strong> 123-456789-00 (Banco Union)</p>
            <p class="info-pago">Sube tu comprobante de pago:</p>
            <input
              type="file"
              accept="image/*,.pdf"
              required
              @change="
                (e) => (pago.comprobanteFile = (e.target as HTMLInputElement).files?.[0] || null)
              "
            />
          </div>

          <!-- QR -->
          <div v-if="pago.metodo === 'qr'" class="box-metodo">
            <div class="qr-wrapper">
              <img :src="qrImage" alt="QR de pago SANSA" class="qr-image" />
            </div>
            <p class="info-pago">Escanea el QR y sube tu comprobante:</p>
            <img src="" alt="" />
            <input
              type="file"
              accept="image/*,.pdf"
              required
              @change="
                (e) => (pago.comprobanteFile = (e.target as HTMLInputElement).files?.[0] || null)
              "
            />
          </div>

          <!-- Tarjeta -->
          <div v-if="pago.metodo === 'tarjeta'" class="grid-tarjeta">
            <div class="campo">
              <label>Número de tarjeta</label>
              <input
                v-model="pago.cardNumber"
                inputmode="numeric"
                maxlength="19"
                placeholder="XXXX XXXX XXXX XXXX"
                required
              />
            </div>
            <div class="campo">
              <label>Nombre en la tarjeta</label>
              <input v-model="pago.cardHolder" type="text" required />
            </div>
            <div class="campo">
              <label>Expiración (MM/AA)</label>
              <input v-model="pago.cardExp" placeholder="MM/AA" required />
            </div>
            <div class="campo">
              <label>CVV</label>
              <input v-model="pago.cardCvv" inputmode="numeric" maxlength="4" required />
            </div>
            <small class="nota-tarjeta"
              >Este pago es simulado. El estado quedará pendiente hasta verificación.</small
            >
          </div>

          <button class="btn-confirmar" type="submit">Confirmar pedido</button>
        </form>
      </div>

      <!-- RESUMEN -->
      <aside class="resumen">
        <h3>Resumen del pedido</h3>

        <div class="lista-productos">
          <div v-for="item in carrito" :key="item.producto.id" class="item-resumen">
            <img :src="item.producto.imagenUrl" alt="Producto" />
            <div class="info">
              <p class="nombre">{{ item.producto.nombre }}</p>
              <span class="cantidad">Cantidad: {{ item.cantidad }}</span>
            </div>
            <span class="precio">Bs. {{ (item.producto.precio * item.cantidad).toFixed(2) }}</span>
          </div>
        </div>

        <div class="totales">
          <div class="linea-total">
            <span>Subtotal:</span>
            <span>Bs. {{ subtotal }}</span>
          </div>
          <div class="linea-total">
            <span>Envío:</span>
            <span class="gratis">Gratis</span>
          </div>
          <div class="linea-total total">
            <strong>Total:</strong>
            <strong>Bs. {{ subtotal }}</strong>
          </div>
        </div>

        <router-link to="/carrito" class="volver">← Volver al carrito</router-link>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.checkout-container {
  padding: 2rem;
  background: #f9fafb;
  min-height: 80vh;
}

.contenido {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
}

/* Formulario */
.formulario {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.formulario h2 {
  margin: 0 0 1.5rem 0;
  color: #111;
  font-size: 24px;
}

.campo {
  margin-bottom: 1.2rem;
}

.campo label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.required {
  color: #ef4444;
}

input,
select {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus,
select:focus {
  outline: none;
  border-color: #fbbf24;
}

input:disabled {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.campos-doble {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.separador {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5rem 0;
}

/* Método de pago */
.box-metodo {
  background: #fef3c7;
  border: 1px solid #fbbf24;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 0.8rem;
}

.box-metodo p {
  margin: 0 0 0.5rem 0;
  font-size: 14px;
}

.info-pago {
  font-weight: 500;
  color: #374151;
}

.box-metodo input[type='file'] {
  margin-top: 0.5rem;
  font-size: 13px;
}

.grid-tarjeta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.8rem;
}

.nota-tarjeta {
  grid-column: 1 / -1;
  color: #6b7280;
  font-size: 12px;
  display: block;
  margin-top: 0.5rem;
}

/* Botón */
.btn-confirmar {
  width: 100%;
  padding: 0.9rem;
  background: #fbbf24;
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1.5rem;
}

.btn-confirmar:hover {
  background: #f59e0b;
}

/* Resumen */
.resumen {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.resumen h3 {
  margin: 0 0 1rem 0;
  font-size: 20px;
  color: #111;
}

.lista-productos {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.item-resumen {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 10px;
}

.item-resumen img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.item-resumen .info {
  flex: 1;
}

.item-resumen .nombre {
  margin: 0 0 4px 0;
  font-weight: 500;
  color: #111;
  font-size: 14px;
}

.item-resumen .cantidad {
  font-size: 12px;
  color: #6b7280;
}

.item-resumen .precio {
  font-weight: 600;
  color: #111;
  font-size: 14px;
}

.totales {
  border-top: 2px solid #f3f4f6;
  padding-top: 1rem;
  margin-top: 1rem;
}

.linea-total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.6rem;
  font-size: 14px;
  color: #374151;
}

.linea-total.total {
  font-size: 18px;
  color: #111;
  margin-top: 0.8rem;
  padding-top: 0.8rem;
  border-top: 1px solid #e5e7eb;
}

.gratis {
  color: #10b981;
  font-weight: 500;
}

.volver {
  display: inline-block;
  margin-top: 1rem;
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.volver:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 900px) {
  .contenido {
    grid-template-columns: 1fr;
  }

  .campos-doble {
    grid-template-columns: 1fr;
  }

  .grid-tarjeta {
    grid-template-columns: 1fr;
  }

  .resumen {
    position: static;
  }
}

.qr-wrapper {
  display: flex;
  justify-content: center;
  margin: 0.5rem 0 1rem;
}

.qr-image {
  max-width: 180px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
