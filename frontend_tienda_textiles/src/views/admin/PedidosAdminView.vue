<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/plugins/axios'
import { getTokenFromLocalStorage, parseJwt } from '@/helpers'

type PedidoProducto = {
  id: number
  cantidad: number
  precioUnitario: number
  producto: { id: number; nombre: string; imagenUrl?: string; precio: number }
}

type Pago = {
  id: number
  metodo: 'efectivo' | 'transferencia' | 'qr' | 'tarjeta'
  estado: string
  comprobante?: string
  maskedCard?: string
  fechaPago?: string
}

type Pedido = {
  id: number
  total: number
  estado: 'pendiente' | 'confirmado' | 'cancelado'
  metodoPago: string
  tipoEnvio: string
  direccion?: string
  referencia?: string
  departamento?: string
  pais?: string
  usuario?: { id: number; nombre: string; email?: string }
  fechaCreacion?: string
  pedidosProductos?: PedidoProducto[]
  pagos?: Pago[]
}

const router = useRouter()

// --- estado UI ---
const cargando = ref(true)
const error = ref<string | null>(null)
const pedidos = ref<Pedido[]>([])
const filtroEstado = ref<'todos' | 'pendiente' | 'confirmado' | 'cancelado'>('todos')
const q = ref('')
const abierto = ref<number | null>(null) // id del pedido abierto (detalle)

const estados = ['pendiente', 'confirmado', 'cancelado'] as const

// --- auth mínima: exigir admin ---
onMounted(async () => {
  const token = getTokenFromLocalStorage()
  const payload = token ? parseJwt(token) : null
  if (!token || payload?.rol !== 'admin') {
    alert('Solo administradores.')
    router.replace('/')
    return
  }
  await cargarPedidos()
})

async function cargarPedidos() {
  cargando.value = true
  error.value = null
  try {
    const { data } = await http.get<Pedido[]>('/pedidos')
    // /pedidos viene “compacto”; cuando abras un detalle, se pedirá /pedidos/:id
    pedidos.value = data
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'No se pudieron cargar los pedidos'
  } finally {
    cargando.value = false
  }
}

async function abrirDetalle(id: number) {
  try {
    const { data } = await http.get(`/pedidos/${id}`)
    const i = pedidos.value.findIndex((p) => p.id === id)
    if (i >= 0) {
      pedidos.value[i] = {
        ...pedidos.value[i],
        ...data,
        pedidosProductos: data.pedidosProductos ?? [],
        pagos: data.pagos ?? [],
      }
    }
    abierto.value = id
  } catch {
    alert('No se pudo cargar el detalle')
  }
}

async function cambiarEstado(id: number, estado: Pedido['estado']) {
  const prev = pedidos.value.find((p) => p.id === id)?.estado
  // optimista
  const i = pedidos.value.findIndex((p) => p.id === id)
  if (i >= 0) pedidos.value[i] = { ...pedidos.value[i], estado }

  try {
    await http.patch(`/pedidos/${id}/estado`, { estado })
    // OK
  } catch (e: any) {
    // revertir
    if (i >= 0 && prev) pedidos.value[i].estado = prev as Pedido['estado']
    alert(e?.response?.data?.message || 'No se pudo actualizar el estado')
  }
}

// --- filtros ---
const filtrados = computed(() => {
  let arr = [...pedidos.value]
  if (filtroEstado.value !== 'todos') {
    arr = arr.filter((p) => p.estado === filtroEstado.value)
  }
  if (q.value.trim()) {
    const s = q.value.trim().toLowerCase()
    arr = arr.filter(
      (p) =>
        String(p.id).includes(s) ||
        (p.usuario?.nombre || '').toLowerCase().includes(s) ||
        (p.usuario?.email || '').toLowerCase().includes(s),
    )
  }
  // más recientes primero (si el backend no lo hace)
  return arr.sort((a, b) => b.id - a.id)
})

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
      <h2>Pedidos (Admin)</h2>

      <div class="filters">
        <input v-model="q" type="search" placeholder="Buscar por #, cliente o email…" />
        <select v-model="filtroEstado">
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <button class="btn" @click="cargarPedidos" :disabled="cargando">
          {{ cargando ? 'Actualizando…' : 'Actualizar' }}
        </button>
      </div>
    </header>

    <div v-if="error" class="alert error">{{ error }}</div>
    <div v-else class="card">
      <table class="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Total (Bs.)</th>
            <th>Método</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th style="width: 160px">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- Un solo v-for que envuelve la fila normal y la fila de detalle -->
          <template v-for="p in filtrados" :key="p.id">
            <!-- Fila principal -->
            <tr>
              <td>#{{ p.id }}</td>
              <td>
                <div class="cliente">
                  <strong>{{ p.usuario?.nombre ?? '—' }}</strong>
                  <small v-if="p.usuario?.email">{{ p.usuario.email }}</small>
                </div>
              </td>
              <td class="moneda">{{ fmtBs(p.total) }}</td>
              <td>{{ p.metodoPago ?? '—' }}</td>
              <td>
                <select
                  class="pill"
                  :class="p.estado"
                  v-model="p.estado"
                  @change="cambiarEstado(p.id, p.estado)"
                >
                  <option value="pendiente">pendiente</option>
                  <option value="confirmado">confirmado</option>
                  <option value="cancelado">cancelado</option>
                </select>
              </td>
              <td>{{ fmtFecha(p.fechaCreacion) }}</td>
              <td class="acciones">
                <button class="btn-sec" @click="abrirDetalle(p.id)">
                  {{ abierto === p.id ? 'Ocultar' : 'Ver' }}
                </button>
              </td>
            </tr>

            <!-- Fila de detalle (NO lleva v-for) -->
            <tr v-if="abierto === p.id" class="detalle" :key="`det-${p.id}`">
              <td colspan="7">
                <div class="detalle-grid">
                  <section>
                    <h4>Productos</h4>
                    <div v-if="!p.pedidosProductos?.length" class="empty">Sin ítems</div>
                    <ul v-else class="lista-productos">
                      <li v-for="d in p.pedidosProductos" :key="d.id">
                        <img v-if="d.producto?.imagenUrl" :src="d.producto.imagenUrl" />
                        <div>
                          <div class="nombre">{{ d.producto?.nombre }}</div>
                          <small
                            >Cant: {{ d.cantidad }} · Precio: Bs.
                            {{ fmtBs(d.precioUnitario) }}</small
                          >
                        </div>
                        <strong>Bs. {{ fmtBs(d.cantidad * d.precioUnitario) }}</strong>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h4>Pago</h4>
                    <div v-if="!p.pagos?.length" class="empty">Aún sin registro de pago</div>
                    <ul v-else class="lista-pagos">
                      <li v-for="pg in p.pagos" :key="pg.id">
                        <div class="row">
                          <span>Método:</span><strong>{{ pg.metodo }}</strong>
                        </div>
                        <div class="row">
                          <span>Estado:</span><strong>{{ pg.estado }}</strong>
                        </div>
                        <div class="row" v-if="pg.maskedCard">
                          <span>Tarjeta:</span><strong>{{ pg.maskedCard }}</strong>
                        </div>
                        <div class="row" v-if="pg.comprobante">
                          <span>Comprobante:</span><a :href="pg.comprobante" target="_blank">ver</a>
                        </div>
                        <div class="row" v-if="pg.fechaPago">
                          <span>Fecha:</span><small>{{ fmtFecha(pg.fechaPago) }}</small>
                        </div>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h4>Envío</h4>
                    <div class="row">
                      <span>Tipo:</span><strong>{{ p.tipoEnvio ?? '—' }}</strong>
                    </div>
                    <div class="row">
                      <span>Dirección:</span><small>{{ p.direccion ?? '—' }}</small>
                    </div>
                    <div class="row" v-if="p.referencia">
                      <span>Referencia:</span><small>{{ p.referencia }}</small>
                    </div>
                    <div class="row" v-if="p.departamento || p.pais">
                      <span>Ubicación:</span>
                      <small>{{ p.departamento ?? '—' }} · {{ p.pais ?? '' }}</small>
                    </div>
                  </section>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div v-if="!cargando && !filtrados.length" class="empty big">
        No hay pedidos con esos filtros.
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
