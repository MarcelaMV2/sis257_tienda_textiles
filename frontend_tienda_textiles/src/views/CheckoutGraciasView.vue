<script setup lang="ts">
import { onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const cargando = ref(true)
const pedido = ref<any>(null)
const items = ref<any[]>([]) // productos del pedido
const pago = ref<any>(null)

onMounted(async () => {
  const raw = localStorage.getItem('ultimoPedido')
  if (!raw) {
    // si no hay ticket, vuelve a home
    router.replace('/')
    return
  }

  const ticket = JSON.parse(raw)

  // 1) Muestra algo inmediato con el ticket (sin parpadear)
  pedido.value = {
    id: ticket.id,
    total: ticket.total,
    estado: ticket.estado,
    metodoPago: ticket.metodoPago,
    fecha: ticket.fecha,
  }

  // 2) (Opcional) Refresca desde API para mostrar productos y estado real
  try {
    const { data } = await http.get(`/pedidos/${ticket.id}`) // asegúrate que incluya relations
    // adapta a tu shape real:
    pedido.value = {
      id: data.id,
      total: data.total,
      estado: data.estado,
      metodoPago: data.metodoPago,
      fecha: data.fechaCreacion, // <- evita "Invalid Date"
      direccion: data.direccion,
      referencia: data.referencia,
      tipoEnvio: data.tipoEnvio,
    }
    items.value = (data.pedidosProductos || []).map((d: any) => ({
      id: d.id,
      nombre: d.producto?.nombre,
      imagenUrl: d.producto?.imagenUrl,
      precioUnit: d.precioUnitario,
      cantidad: d.cantidad,
      subtotal: d.precioUnitario * d.cantidad,
    }))
    // si tienes /pagos en relations:
    pago.value = (data.pagos && data.pagos[0]) || null
  } catch {
    /* si falla, te quedas con el ticket local */
  } finally {
    cargando.value = false
  }

  // limpia el “ticket” si quieres que no se re-muestre al recargar
  // localStorage.removeItem('ultimoPedido')
})

function fmtFecha(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString()
}

function fmtBs(n?: number) {
  return (Number(n) || 0).toFixed(2)
}
</script>

<template>
  <section class="gracias">
    <h2>¡Gracias por tu compra!</h2>
    <p>Tu pedido ha sido recibido. Te enviaremos un correo de confirmación.</p>

    <div class="panel">
      <div class="fila"><b>Pedido #:</b> {{ pedido?.id }}</div>
      <div class="fila"><b>Total:</b> Bs. {{ fmtBs(pedido?.total) }}</div>
      <div class="fila"><b>Fecha:</b> {{ fmtFecha(pedido?.fecha) }}</div>
      <div class="fila"><b>Método de pago:</b> {{ pedido?.metodoPago }}</div>
      <div class="fila"><b>Estado:</b> {{ pedido?.estado }}</div>

      <div v-if="pedido?.direccion" class="fila">
        <b>Envío:</b> {{ pedido?.tipoEnvio }} — {{ pedido?.direccion }}
        <span v-if="pedido?.referencia">({{ pedido?.referencia }})</span>
      </div>
    </div>

    <h3>Productos</h3>
    <div v-if="cargando">Cargando resumen…</div>
    <div v-else>
      <div v-if="items.length === 0" class="vacio">No se encontraron productos del pedido.</div>
      <div v-else class="lista">
        <div v-for="it in items" :key="it.id" class="item">
          <img :src="it.imagenUrl" alt="" />
          <div class="info">
            <div class="tit">{{ it.nombre }}</div>
            <div class="sub">Cant: {{ it.cantidad }} · Precio: Bs. {{ fmtBs(it.precioUnit) }}</div>
          </div>
          <div class="monto">Bs. {{ fmtBs(it.subtotal) }}</div>
        </div>
      </div>
    </div>

    <div v-if="pago" class="panel">
      <h3>Pago</h3>
      <div class="fila"><b>Método:</b> {{ pago.metodo }}</div>
      <div class="fila" v-if="pago.maskedCard"><b>Tarjeta:</b> {{ pago.maskedCard }}</div>
      <div class="fila"><b>Estado:</b> {{ pago.estado }}</div>
      <div class="fila" v-if="pago.comprobante">
        <b>Comprobante:</b> <a :href="pago.comprobante" target="_blank">ver</a>
      </div>
    </div>

    <router-link to="/" class="btn">Volver al inicio</router-link>
  </section>
</template>

<style scoped>
.gracias {
  padding: 24px;
  text-align: center;
}
.panel {
  margin: 16px auto;
  padding: 16px;
  max-width: 720px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  text-align: left;
}
.fila {
  margin: 6px 0;
}
.lista {
  max-width: 720px;
  margin: 0 auto;
}
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.item img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
}
.item .info {
  flex: 1;
  margin: 0 12px;
}
.item .tit {
  font-weight: 600;
}
.item .sub {
  color: #555;
  font-size: 0.9rem;
}
.item .monto {
  font-weight: 700;
}
.btn {
  display: inline-block;
  margin-top: 16px;
  background: #38b2ac;
  color: #fff;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
}
.vacio {
  color: #666;
}
</style>
