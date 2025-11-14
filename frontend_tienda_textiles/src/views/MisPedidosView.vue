<!-- <script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/plugins/axios'
import { getTokenFromLocalStorage, parseJwt } from '@/helpers'

type Pedido = {
  id: number
  total: number
  estado: 'pendiente' | 'confirmado' | 'cancelado'
  metodoPago: string
  tipoEnvio: string
  direccion?: string
  fechaCreacion?: string
}

const router = useRouter()
const pedidos = ref<Pedido[]>([])
const cargando = ref(true)
const error = ref<string | null>(null)
const abierto = ref<number | null>(null)

onMounted(async () => {
  const token = getTokenFromLocalStorage()
  const payload = token ? parseJwt(token) : null
  if (!token || payload?.rol !== 'cliente') {
    alert('Solo clientes pueden ver su historial de compras.')
    router.replace('/')
    return
  }
  await cargarPedidos()
})

async function cargarPedidos() {
  cargando.value = true
  error.value = null
  try {
    const { data } = await http.get<Pedido[]>('/pedidos/mios')
    pedidos.value = data
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'No se pudieron cargar los pedidos'
  } finally {
    cargando.value = false
  }
}

async function verDetalle(id: number) {
  try {
    const { data } = await http.get(`/pedidos/${id}`) // Obtener el detalle del pedido
    const i = pedidos.value.findIndex((p) => p.id === id)

    if (i >= 0) {
      pedidos.value[i] = {
        ...pedidos.value[i],
        ...data,
        pedidosProductos: data.pedidosProductos || [],
        pagos: data.pagos || [],
      }
    }

    abierto.value = id // Set the 'abierto' id to show details for this order.
  } catch (error) {
    alert('No se pudo cargar el detalle.')
  }
}

function fmtFecha(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(+d) ? '' : d.toLocaleString()
}

function fmtBs(n?: number) {
  if (n == null) return '0.00'
  return Number(n).toFixed(2)
}
</script>

<template>
  <section class="admin-wrap">
    <header class="toolbar">
      <h2>Mis Pedidos</h2>
    </header>

    <div v-if="error" class="alert error">{{ error }}</div>
    <div v-else class="card">
      <table class="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Total (Bs.)</th>
            <th>Método</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pedidos" :key="p.id">
            <td>#{{ p.id }}</td>
            <td>{{ fmtBs(p.total) }}</td>
            <td>{{ p.metodoPago }}</td>
            <td>{{ p.estado }}</td>
            <td>{{ fmtFecha(p.fechaCreacion) }}</td>
            <td>
              <button @click="verDetalle(p.id)">Ver</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="abierto !== null">
        <h3>Detalles del Pedido #{{ abierto }}</h3>
        <table class="tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="producto in pedidos.find((p) => p.id === abierto)?.pedidosProductos || []"
              :key="producto.id"
            >
              <td>{{ producto.producto.nombre }}</td>
              <td>{{ producto.cantidad }}</td>
              <td>{{ fmtBs(producto.precioUnitario) }}</td>
              <td>{{ fmtBs(producto.cantidad * producto.precioUnitario) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin-wrap {
  padding: 24px;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.filters {
  display: flex;
  gap: 8px;
  align-items: center;
}
.filters input {
  padding: 0.55rem 0.7rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  min-width: 280px;
}
.filters select {
  padding: 0.55rem 0.7rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}
.btn,
.btn-sec {
  padding: 0.55rem 0.9rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
}
.btn {
  background: #38b2ac;
  color: white;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-sec {
  background: #f3f4f6;
  color: #111827;
}
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.tabla {
  width: 100%;
  border-collapse: collapse;
}
.tabla th,
.tabla td {
  padding: 12px 14px;
  border-bottom: 1px solid #eef2f7;
  vertical-align: top;
}
.moneda {
  font-weight: 700;
}
.cliente small {
  display: block;
  color: #6b7280;
}
.pill {
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
}
.pill.pendiente {
  background: #da851d;
}
.pill.confirmado {
  background: #0ecc73;
}
.pill.cancelado {
  background: #de1e1e;
}
.acciones {
  display: flex;
  gap: 8px;
}
.detalle {
  background: #fafafa;
}
.detalle-grid {
  display: grid;
  grid-template-columns: 2fr 1.3fr 1fr;
  gap: 18px;
  padding: 14px;
}
.lista-productos,
.lista-pagos {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.lista-productos li,
.lista-pagos li {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
}
.lista-productos img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
}
.lista-productos .nombre {
  font-weight: 600;
}
.row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.row span {
  width: 90px;
  color: #6b7280;
}
.empty {
  color: #6b7280;
}
.empty.big {
  padding: 24px;
  text-align: center;
}
.alert.error {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #7f1d1d;
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 10px;
}
@media (max-width: 1024px) {
  .detalle-grid {
    grid-template-columns: 1fr;
  }
}
</style>
 -->

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/plugins/axios'
import { getTokenFromLocalStorage, parseJwt } from '@/helpers'

type Pedido = {
  id: number
  total: number
  estado: 'pendiente' | 'confirmado' | 'cancelado'
  metodoPago: string
  tipoEnvio: string
  direccion?: string
  fechaCreacion?: string
  pedidosProductos?: Array<any>
  pagos?: Array<any>
  referencia?: string
  departamento?: string
  pais?: string
}

const router = useRouter()
const pedidos = ref<Pedido[]>([])
const cargando = ref(true)
const error = ref<string | null>(null)
const abierto = ref<number | null>(null)

onMounted(async () => {
  const token = getTokenFromLocalStorage()
  const payload = token ? parseJwt(token) : null
  if (!token || payload?.rol !== 'cliente') {
    alert('Solo clientes pueden ver su historial de compras.')
    router.replace('/')
    return
  }
  await cargarPedidos()
})

async function cargarPedidos() {
  cargando.value = true
  error.value = null
  try {
    const { data } = await http.get<Pedido[]>('/pedidos/mios')
    pedidos.value = data
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'No se pudieron cargar los pedidos'
  } finally {
    cargando.value = false
  }
}

async function verDetalle(id: number) {
  try {
    const { data } = await http.get(`/pedidos/${id}`) // Obtener el detalle del pedido
    const i = pedidos.value.findIndex((p) => p.id === id)

    if (i >= 0) {
      pedidos.value[i] = {
        ...pedidos.value[i],
        ...data,
        pedidosProductos: data.pedidosProductos || [],
        pagos: data.pagos || [],
      }
    }

    abierto.value = id // Set the 'abierto' id to show details for this order.
  } catch (error) {
    alert('No se pudo cargar el detalle.')
  }
}

function fmtFecha(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(+d) ? '' : d.toLocaleString()
}

function fmtBs(n?: number) {
  if (n == null) return '0.00'
  return Number(n).toFixed(2)
}
</script>

<template>
  <section class="mis-pedidos">
    <header class="toolbar">
      <h2>Mis Pedidos</h2>
    </header>

    <div v-if="error" class="alert error">{{ error }}</div>
    <div v-else class="card">
      <table class="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Total (Bs.)</th>
            <th>Método</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pedidos" :key="p.id">
            <td>#{{ p.id }}</td>
            <td>{{ fmtBs(p.total) }}</td>
            <td>{{ p.metodoPago }}</td>
            <td>{{ p.estado }}</td>
            <td>{{ fmtFecha(p.fechaCreacion) }}</td>
            <td>
              <button @click="verDetalle(p.id)">Ver</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mostrar Detalles del Pedido -->
      <div v-if="abierto !== null">
        <h3>Detalles del Pedido #{{ abierto }}</h3>

        <div class="detalle-card">
          <h4>Productos</h4>
          <div v-if="!pedidos.find((p) => p.id === abierto)?.pedidosProductos.length" class="empty">
            Sin productos
          </div>
          <div v-else class="productos-lista">
            <div
              v-for="producto in pedidos.find((p) => p.id === abierto)?.pedidosProductos"
              :key="producto.id"
              class="producto-card"
            >
              <img :src="producto.producto.imagenUrl" alt="Producto" class="producto-imagen" />
              <div>
                <h5>{{ producto.producto.nombre }}</h5>
                <p>
                  Cantidad: {{ producto.cantidad }} · Precio: Bs.
                  {{ fmtBs(producto.precioUnitario) }}
                </p>
                <strong
                  >Subtotal: Bs. {{ fmtBs(producto.cantidad * producto.precioUnitario) }}</strong
                >
              </div>
            </div>
          </div>
        </div>

        <div class="detalle-card">
          <h4>Pago</h4>
          <div v-if="!pedidos.find((p) => p.id === abierto)?.pagos.length" class="empty">
            Aún sin registro de pago
          </div>
          <div v-else>
            <p>Método de pago: {{ pedidos.find((p) => p.id === abierto)?.pagos[0].metodo }}</p>
            <p>Estado del pago: {{ pedidos.find((p) => p.id === abierto)?.pagos[0].estado }}</p>
            <p v-if="pedidos.find((p) => p.id === abierto)?.pagos[0].fechaPago">
              Fecha del pago:
              {{ fmtFecha(pedidos.find((p) => p.id === abierto)?.pagos[0].fechaPago) }}
            </p>
          </div>
        </div>

        <div class="detalle-card">
          <h4>Envío</h4>
          <div v-if="!pedidos.find((p) => p.id === abierto)?.direccion" class="empty">
            Sin dirección registrada
          </div>
          <div v-else>
            <p>Tipo de envío: {{ pedidos.find((p) => p.id === abierto)?.tipoEnvio }}</p>
            <p>Dirección: {{ pedidos.find((p) => p.id === abierto)?.direccion }}</p>
            <p v-if="pedidos.find((p) => p.id === abierto)?.referencia">
              Referencia: {{ pedidos.find((p) => p.id === abierto)?.referencia }}
            </p>
            <p>
              Ubicación: {{ pedidos.find((p) => p.id === abierto)?.departamento }} ·
              {{ pedidos.find((p) => p.id === abierto)?.pais }}
            </p>
          </div>
        </div>

        <button @click="abierto = null" class="btn-sec">Ocultar</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mis-pedidos {
  padding: 24px;
}

.detalle-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  padding: 20px;
}

.productos-lista {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.producto-card {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.producto-imagen {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.empty {
  color: #6b7280;
  text-align: center;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  padding: 20px;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

.tabla th,
.tabla td {
  padding: 12px 14px;
  border-bottom: 1px solid #eef2f7;
}

.btn-sec {
  background-color: #f3f4f6;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 8px;
  align-items: center;
}

.filters input {
  padding: 0.55rem 0.7rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  min-width: 280px;
}

.filters select {
  padding: 0.55rem 0.7rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}
</style>
