<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/plugins/axios'

const router = useRouter()

// Define las variables reactivas
const cargando = ref(true)
const pedido = ref<any>(null)
const items = ref<any[]>([])
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

  // limpia el "ticket" si quieres que no se re-muestre al recargar
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
  <div class="container text-center py-5">
    <img
      src="@/assets/images/insta-item2.jpg"
      alt="Gracias"
      style="width: 150px; margin-bottom: 1rem"
    />
    <h3>¡Gracias por tu compra!</h3>
    <p class="text-muted mb-4">
      Tu pedido ha sido recibido correctamente.
      <br />En breve te enviaremos un correo de confirmación.
    </p>

    <div v-if="cargando" class="vacio">Cargando...</div>

    <div v-else-if="pedido" class="panel">
      <div class="fila"><b>Pedido #:</b> {{ pedido?.id }}</div>
      <div class="fila"><b>Total:</b> Bs. {{ fmtBs(pedido?.total) }}</div>
      <div class="fila"><b>Fecha:</b> {{ fmtFecha(pedido?.fecha) }}</div>
      <div class="fila"><b>Método de pago:</b> {{ pedido?.metodoPago }}</div>
      <div class="fila"><b>Estado:</b> {{ pedido?.estado }}</div>

      <div v-if="pedido?.direccion" class="fila">
        <b>Envío:</b> {{ pedido?.tipoEnvio }} — {{ pedido?.direccion }}
        <span v-if="pedido?.referencia">({{ pedido?.referencia }})</span>
      </div>

      <!-- Opcional: Mostrar items si los tienes -->
      <div v-if="items.length > 0" class="lista mt-4">
        <h5>Productos:</h5>
        <div v-for="item in items" :key="item.id" class="item">
          <img :src="item.imagenUrl" :alt="item.nombre" />
          <div class="info">
            <div class="tit">{{ item.nombre }}</div>
            <div class="sub">{{ item.cantidad }} x Bs. {{ fmtBs(item.precioUnit) }}</div>
          </div>
          <div class="monto">Bs. {{ fmtBs(item.subtotal) }}</div>
        </div>
      </div>
    </div>

    <button class="btn btn-primary mt-4" @click="router.push('/')">Volver al inicio</button>
  </div>
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
  border: none;
  cursor: pointer;
}
.vacio {
  color: #666;
  padding: 20px;
}
</style>
