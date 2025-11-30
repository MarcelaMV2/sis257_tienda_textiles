<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/plugins/axios'
import { getTokenFromLocalStorage, parseJwt } from '@/helpers'

type Pago = {
  id: number
  metodo: 'efectivo' | 'transferencia' | 'qr' | 'tarjeta'
  monto: number
  estado: string
  comprobante?: string
  maskedCard?: string
  fechaPago?: string
  pedido?: {
    id: number
    total: number
    estado: string
    usuario?: { nombre: string; email: string }
  }
}

const router = useRouter()
const cargando = ref(true)
const pagos = ref<Pago[]>([])
const filtroEstado = ref<'todos' | 'pendiente' | 'aprobado' | 'rechazado' | 'en_revision'>('todos')
const filtroMetodo = ref<'todos' | 'efectivo' | 'transferencia' | 'qr' | 'tarjeta'>('todos')
const q = ref('')
const abierto = ref<number | null>(null)
const paginaActual = ref(1)
const itemsPorPagina = ref(10)

// Modal
const mostrarModal = ref(false)
const imagenModal = ref('')

onMounted(async () => {
  const token = getTokenFromLocalStorage()
  const payload = token ? parseJwt(token) : null
  if (!token || payload?.rol !== 'admin') {
    alert('Solo administradores.')
    router.replace('/')
    return
  }
  await cargarPagos()
})

async function cargarPagos() {
  cargando.value = true
  try {
    const { data } = await http.get<Pago[]>('/pagos')
    pagos.value = data
  } catch (e: any) {
    alert(e?.response?.data?.message || 'Error al cargar pagos')
  } finally {
    cargando.value = false
  }
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

const filtrados = computed(() => {
  let arr = [...pagos.value]
  if (filtroEstado.value !== 'todos') {
    arr = arr.filter((p) => p.estado === filtroEstado.value)
  }
  if (filtroMetodo.value !== 'todos') {
    arr = arr.filter((p) => p.metodo === filtroMetodo.value)
  }
  if (q.value.trim()) {
    const s = q.value.trim().toLowerCase()
    arr = arr.filter(
      (p) =>
        String(p.id).includes(s) ||
        String(p.pedido?.id || '').includes(s) ||
        (p.pedido?.usuario?.nombre || '').toLowerCase().includes(s) ||
        (p.pedido?.usuario?.email || '').toLowerCase().includes(s),
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
      <h2>Pagos</h2>
      <div class="filters">
        <input v-model="q" type="search" placeholder="Buscar..." />
        <select v-model="filtroMetodo">
          <option value="todos">Todos los métodos</option>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
          <option value="qr">QR</option>
          <option value="tarjeta">Tarjeta</option>
        </select>
        <select v-model="filtroEstado">
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_revision">En Revisión</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>
    </div>

    <!-- Tabla -->
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>#Pago</th>
            <th>#Pedido</th>
            <th>Cliente</th>
            <th>Método</th>
            <th>Monto (Bs.)</th>
            <th>Estado</th>
            <th>Comprobante</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in paginados" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ p.pedido?.id ?? '—' }}</td>
            <td>
              <strong v-if="p.pedido?.usuario?.nombre">{{ p.pedido.usuario.nombre }}</strong>
              <strong v-else-if="p.pedido?.usuario?.email">{{ p.pedido.usuario.email }}</strong>
              <strong v-else>—</strong>
              <small v-if="p.pedido?.usuario?.email && p.pedido?.usuario?.nombre">
                {{ p.pedido.usuario.email }}
              </small>
            </td>
            <td>
              <span class="badge badge-metodo">{{ p.metodo }}</span>
            </td>
            <td>{{ fmtBs(p.monto) }}</td>
            <td>
              <span class="badge" :class="p.estado">{{ p.estado.replace('_', ' ') }}</span>
            </td>
            <td>
              <button
                v-if="p.comprobante"
                class="btn-comprobante"
                @click="verComprobante(p.comprobante)"
              >
                Ver
              </button>
              <span v-else class="sin-comprobante">—</span>
            </td>
            <td>{{ fmtFecha(p.fechaPago) }}</td>
          </tr>
          <tr v-if="!cargando && !paginados.length">
            <td colspan="8" class="empty-state">No hay pagos</td>
          </tr>
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

.badge.en_revision {
  background: #3b82f6;
  color: white;
}

.badge.aprobado,
.badge.confirmado {
  background: #10b981;
  color: white;
}

.badge.rechazado,
.badge.cancelado {
  background: #ef4444;
  color: white;
}

.btn-comprobante {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s;
  width: 100%;
}

.btn-comprobante:hover {
  background: #2563eb;
}

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

/* Modal */
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
.badge-metodo {
  background: #e0e7ff;
  color: #3730a3;
  text-transform: capitalize;
}

.badge.entregado {
  background: #10b981;
  color: white;
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

.sin-comprobante {
  color: #999;
  font-style: italic;
}
</style>
