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
  metodo: string
  estado: string
  comprobante?: string
  fechaPago?: string
}

type DepartamentoPedido = {
  id: number
  nombre: string
}

type Pedido = {
  id: number
  total: number
  estado: 'pendiente' | 'entregado' | 'cancelado'
  metodoPago: string
  tipoEnvio: string
  direccion?: string
  referencia?: string
  ciudad?: string // 👈 ciudad
  departamento?: DepartamentoPedido | string // puede venir objeto o string
  pais?: string
  usuario?: { nombre: string; email?: string }
  fechaCreacion?: string
  pedidosProductos?: PedidoProducto[]
  pagos?: Pago[]
}

const router = useRouter()
const cargando = ref(true)
const pedidos = ref<Pedido[]>([])
const filtroEstado = ref<'todos' | 'pendiente' | 'entregado' | 'cancelado'>('todos')
const q = ref('')
const abierto = ref<number | null>(null)
const paginaActual = ref(1)
const itemsPorPagina = ref(10)

// Modales
const mostrarModal = ref(false)
const imagenModal = ref('')
const mostrarModalConfirm = ref(false)
const mensajeConfirm = ref('')
const accionConfirm = ref<(() => Promise<void>) | null>(null)

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
  try {
    const { data } = await http.get<Pedido[]>('/pedidos')
    for (const pedido of data) {
      try {
        const { data: detalle } = await http.get(`/pedidos/${pedido.id}`)
        // Asignar todos los datos del detalle al pedido
        Object.assign(pedido, detalle)
        pedido.pagos = detalle.pagos || []
        pedido.pedidosProductos = detalle.pedidosProductos || []
      } catch (e) {
        pedido.pagos = []
        pedido.pedidosProductos = []
      }
    }
    pedidos.value = data
  } catch (e: any) {
    alert(e?.response?.data?.message || 'Error al cargar pedidos')
  } finally {
    cargando.value = false
  }
}

function handleCambioEstadoPedido(pedido: Pedido, nuevoEstado: string) {
  abrirModalConfirm(`¿Desea cambiar el estado del pedido a "${nuevoEstado}"?`, async () => {
    try {
      await http.patch(`/pedidos/${pedido.id}/estado`, { estado: nuevoEstado })
      pedido.estado = nuevoEstado as any
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Error al actualizar')
    }
  })
}

function handleCambioEstadoPago(pedido: Pedido, nuevoEstado: string) {
  // Validación inicial
  if (!pedido.pagos?.[0]) {
    alert('Este pedido no tiene registro de pago')
    return
  }

  abrirModalConfirm(
    `¿Desea cambiar el estado del pago a "${nuevoEstado.replace('_', ' ')}"?`,
    async () => {
      // Validación adicional para TypeScript (NO afecta la lógica)
      const pago = pedido.pagos?.[0]
      if (!pago) return

      try {
        await http.patch(`/pagos/${pago.id}`, { estado: nuevoEstado })
        pago.estado = nuevoEstado

        if (nuevoEstado === 'rechazado') {
          await http.patch(`/pedidos/${pedido.id}/estado`, { estado: 'cancelado' })
          pedido.estado = 'cancelado'
          alert('El pago fue rechazado y el pedido ha sido cancelado automáticamente')
        }
      } catch (e: any) {
        alert(e?.response?.data?.message || 'Error al actualizar')
      }
    },
  )
}

function toggleDetalle(id: number) {
  abierto.value = abierto.value === id ? null : id
}

function verComprobante(url: string) {
  imagenModal.value = url
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
  imagenModal.value = ''
}

/***MODALES DE ESTADO DE PAGO Y PEDIDO */
function abrirModalConfirm(mensaje: string, accion: () => Promise<void>) {
  mensajeConfirm.value = mensaje
  accionConfirm.value = accion
  mostrarModalConfirm.value = true
}

function cancelarConfirm() {
  mostrarModalConfirm.value = false
  mensajeConfirm.value = ''
  accionConfirm.value = null
}

async function ejecutarConfirm() {
  mostrarModalConfirm.value = false
  if (accionConfirm.value) {
    await accionConfirm.value()
    accionConfirm.value = null
  }
}

function obtenerEstadoPago(p: Pedido): string {
  return p.pagos?.[0]?.estado || 'sin_pago'
}

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
  return arr.sort((a, b) => b.id - a.id)
})

const totalPaginas = computed(() => Math.ceil(filtrados.value.length / itemsPorPagina.value))

const paginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value
  return filtrados.value.slice(inicio, inicio + itemsPorPagina.value)
})

function cambiarPagina(p: number) {
  if (p >= 1 && p <= totalPaginas.value) {
    paginaActual.value = p
    abierto.value = null
  }
}

function fmtFecha(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString()
}

function fmtBs(n?: number) {
  if (n == null || n === undefined) return '0.00'
  return Number(n).toFixed(2)
}
</script>

<template>
  <section class="admin-wrap">
    <!-- Header -->
    <div class="header">
      <h2>Pedidos</h2>
      <div class="filters">
        <input v-model="q" type="search" placeholder="Buscar..." />
        <select v-model="filtroEstado">
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
    </div>

    <!-- Tabla -->
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Nro</th>
            <th>Cliente</th>
            <th>Total (Bs.)</th>
            <th>Método</th>
            <th>Estado Pago</th>
            <th>Estado Pedido</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="p in paginados" :key="p.id">
            <tr>
              <td>{{ p.id }}</td>
              <td>
                <strong>{{ p.usuario?.nombre || '—' }}</strong>
                <small v-if="p.usuario?.email">{{ p.usuario.email }}</small>
              </td>
              <td>
                <strong>{{ fmtBs(p.total) }}</strong>
              </td>
              <td>{{ p.metodoPago }}</td>
              <td>
                <select
                  v-if="p.pagos?.[0]"
                  class="badge"
                  :class="obtenerEstadoPago(p)"
                  :value="obtenerEstadoPago(p)"
                  @change="handleCambioEstadoPago(p, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_revision">En Revisión</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
                <span v-else class="badge sin">Sin pago</span>
              </td>
              <td>
                <select
                  class="badge"
                  :class="p.estado"
                  :value="p.estado"
                  @change="handleCambioEstadoPedido(p, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </td>
              <td>{{ fmtFecha(p.fechaCreacion) }}</td>
              <td>
                <button class="btn-action" @click="toggleDetalle(p.id)">
                  {{ abierto === p.id ? 'Ocultar' : 'Ver' }}
                </button>
              </td>
            </tr>

            <!-- Detalle -->
            <tr v-if="abierto === p.id" class="detalle">
              <td colspan="8">
                <div class="detalle-content">
                  <!-- Productos -->
                  <div class="detalle-box">
                    <h4>Productos</h4>
                    <div v-if="!p.pedidosProductos?.length" class="empty">Sin productos</div>
                    <div v-for="d in p.pedidosProductos" :key="d.id" class="producto">
                      <img v-if="d.producto?.imagenUrl" :src="d.producto.imagenUrl" />
                      <div class="producto-info">
                        <strong>{{ d.producto?.nombre }}</strong>
                        <span>×{{ d.cantidad }} - Bs. {{ fmtBs(d.precioUnitario) }}</span>
                      </div>
                      <strong>Bs. {{ fmtBs(d.cantidad * d.precioUnitario) }}</strong>
                    </div>
                  </div>

                  <!-- Pago -->
                  <div class="detalle-box">
                    <h4>Pago</h4>
                    <div v-if="!p.pagos?.length" class="empty">Sin registro</div>
                    <div v-for="pg in p.pagos" :key="pg.id" class="info-grid">
                      <div class="info-row">
                        <span>Método:</span>
                        <strong>{{ pg.metodo }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Estado:</span>
                        <span class="badge" :class="pg.estado">{{
                          pg.estado.replace('_', ' ')
                        }}</span>
                      </div>
                      <div class="info-row" v-if="pg.comprobante">
                        <span>Comprobante:</span>
                        <button class="btn-comprobante" @click="verComprobante(pg.comprobante)">
                          Ver comprobante
                        </button>
                      </div>
                      <div class="info-row">
                        <span>Fecha:</span>
                        <small>{{ fmtFecha(pg.fechaPago) }}</small>
                      </div>
                    </div>
                  </div>

                  <!-- Envío -->
                  <div class="detalle-box">
                    <h4>Envío</h4>
                    <div class="info-grid">
                      <div class="info-row">
                        <span>Tipo:</span>
                        <strong>{{ p.tipoEnvio || '—' }}</strong>
                      </div>

                      <div class="info-row" v-if="p.direccion">
                        <span>Dirección:</span>
                        <span>{{ p.direccion }}</span>
                      </div>

                      <div class="info-row" v-if="p.referencia">
                        <span>Referencia:</span>
                        <span>{{ p.referencia }}</span>
                      </div>

                      <div class="info-row" v-if="p.ciudad">
                        <span>Ciudad:</span>
                        <span>{{ p.ciudad }}</span>
                      </div>

                      <div class="info-row" v-if="p.departamento">
                        <span>Departamento:</span>
                        <span>
                          {{
                            typeof p.departamento === 'string'
                              ? p.departamento
                              : p.departamento?.nombre
                          }}
                        </span>
                      </div>

                      <div class="info-row" v-if="p.pais">
                        <span>País:</span>
                        <span>{{ p.pais }}</span>
                      </div>

                      <div
                        class="empty"
                        v-if="!p.tipoEnvio && !p.direccion && !p.ciudad && !p.departamento"
                      >
                        Sin datos de envío
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Paginación -->
      <div v-if="totalPaginas > 1" class="paginacion">
        <button
          class="btn-pag"
          :disabled="paginaActual === 1"
          @click="cambiarPagina(paginaActual - 1)"
        >
          ‹
        </button>

        <div class="paginas">
          <button
            v-for="p in totalPaginas"
            :key="p"
            class="btn-num"
            :class="{ activo: p === paginaActual }"
            @click="cambiarPagina(p)"
          >
            {{ p }}
          </button>
        </div>

        <button
          class="btn-pag"
          :disabled="paginaActual === totalPaginas"
          @click="cambiarPagina(paginaActual + 1)"
        >
          ›
        </button>
      </div>

      <div v-if="!cargando && !filtrados.length" class="empty-state">No hay pedidos</div>
    </div>

    <!-- Modal de Confirmación -->
    <div v-if="mostrarModalConfirm" class="modal-overlay" @click="cancelarConfirm">
      <div class="modal-confirm" @click.stop>
        <h3>Confirmar Acción</h3>
        <p>{{ mensajeConfirm }}</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="cancelarConfirm">Cancelar</button>
          <button class="btn-confirm" @click="ejecutarConfirm">Confirmar</button>
        </div>
      </div>
    </div>

    <!-- Modal Comprobante -->
    <div v-if="mostrarModal" class="modal-overlay" @click="cerrarModal">
      <div class="modal-content" @click.stop>
        <button class="btn-close" @click="cerrarModal">✕</button>
        <img :src="imagenModal" alt="Comprobante" class="modal-img" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin-wrap {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  background-color: #eeeeee;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  font-size: 24px;
}

.filters {
  display: flex;
  gap: 10px;
}

.filters input,
.filters select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.filters input {
  width: 250px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

th {
  background: #fbbf24;
  color: #000;
  font-weight: 600;
  font-size: 14px;
}

td strong {
  display: block;
  color: #111;
}

td small {
  display: block;
  color: #666;
  font-size: 12px;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  text-transform: capitalize;
}

.badge.pendiente {
  background: #f59e0b;
  color: white;
}

.badge.entregado {
  background: #10b981;
  color: white;
}

.badge.cancelado,
.badge.rechazado {
  background: #ef4444;
  color: white;
}

.badge.en_revision {
  background: #3b82f6;
  color: white;
}

.badge.aprobado {
  background: #10b981;
  color: white;
}

.badge.sin {
  background: #e5e7eb;
  color: #6b7280;
}

.btn-action {
  padding: 6px 16px;
  background: #374151;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: background 0.2s;
}

.btn-action:hover {
  background: #1f2937;
}

.detalle {
  background: #fafafa;
}

.detalle-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
}

.detalle-box {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.detalle-box h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #111;
  border-bottom: 2px solid #fbbf24;
  padding-bottom: 8px;
}

.producto {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 6px;
  margin-bottom: 8px;
}

.producto img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

.producto-info {
  flex: 1;
}

.producto-info strong {
  font-size: 14px;
}

.producto-info span {
  font-size: 12px;
  color: #666;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.info-row span:first-child {
  color: #666;
  font-weight: 500;
}

.btn-comprobante {
  padding: 6px 14px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-comprobante:hover {
  background: #2563eb;
}

.empty,
.empty-state {
  text-align: center;
  color: #999;
  padding: 20px;
  font-style: italic;
}

/* Paginación */
.paginacion {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #f1f5f9;
}

.paginas {
  display: flex;
  gap: 4px;
}

.btn-pag,
.btn-num {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.813rem;
  color: #4b5563;
}

.btn-pag:hover:not(:disabled),
.btn-num:hover {
  background: #fef3c7;
  border-color: #fbbf24;
}

.btn-pag:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-num.activo {
  background: #f59e0b;
  color: white;
  border-color: #f59e0b;
}

.btn-pag i {
  font-size: 0.75rem;
}
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .filters {
    flex-direction: column;
  }

  .filters input {
    width: 100%;
  }

  .detalle-content {
    grid-template-columns: 1fr;
  }
}

/* Modal de Comprobante */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-content {
  position: relative;
  max-width: 700px;
  max-height: 85vh;
  background: white;
  padding: 20px;
  border-radius: 12px;
  overflow: auto;
}

.btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.btn-close:hover {
  background: #dc2626;
}

.modal-img {
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  display: block;
  border-radius: 8px;
}

/* Modal de Confirmación */
.modal-confirm {
  background: white;
  padding: 28px;
  border-radius: 12px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.modal-confirm h3 {
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #111;
}

.modal-confirm p {
  margin: 0 0 24px 0;
  color: #555;
  font-size: 15px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel,
.btn-confirm {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-cancel {
  background: #e5e7eb;
  color: #111;
}

.btn-cancel:hover {
  background: #d1d5db;
}

.btn-confirm {
  background: #fbbf24;
  color: #000;
}

.btn-confirm:hover {
  background: #f59e0b;
}
</style>
