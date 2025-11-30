<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/plugins/axios'
import { getTokenFromLocalStorage, parseJwt } from '@/helpers'

type Pedido = {
  id: number
  total: number
  estado: 'pendiente' | 'entregado' | 'cancelado'
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
  if (!token) {
    alert('Por favor, inicie sesión para ver sus pedidos.')
    router.replace('/login')
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
  if (abierto.value === id) {
    abierto.value = null
    return
  }

  try {
    const { data } = await http.get(`/pedidos/${id}`)
    const i = pedidos.value.findIndex((p) => p.id === id)

    if (i >= 0) {
      pedidos.value[i] = {
        ...pedidos.value[i],
        ...data,
        pedidosProductos: data.pedidosProductos || [],
        pagos: data.pagos || [],
      }
    }

    abierto.value = id
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
  <div class="page-container">
    <h2 class="page-title">Mis Pedidos</h2>

    <section class="mis-pedidos">
      <div v-if="error" class="alert error">{{ error }}</div>
      <div v-else class="card">
        <div class="tabla-responsive">
          <table class="tabla">
            <thead>
              <tr>
                <th>Nro</th>
                <th>Total (Bs.)</th>
                <th>Método</th>
                <th>Estado</th>
                <th>Fecha y Hora</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(p, index) in pedidos" :key="p.id">
                <tr :class="{ 'fila-par': index % 2 === 1 }">
                  <td data-label="Nro">#{{ p.id }}</td>
                  <td data-label="Total (Bs.)">{{ fmtBs(p.total) }}</td>
                  <td data-label="Método">{{ p.metodoPago }}</td>
                  <td data-label="Estado">
                    <span class="badge" :class="`badge-${p.estado}`">
                      {{ p.estado }}
                    </span>
                  </td>
                  <td data-label="Fecha y Hora">{{ fmtFecha(p.fechaCreacion) }}</td>
                  <td data-label="Acciones">
                    <button
                      @click="verDetalle(p.id)"
                      class="btn-accion"
                      :class="{ 'btn-activo': abierto === p.id }"
                    >
                      {{ abierto === p.id ? 'Ocultar' : 'Ver' }}
                    </button>
                  </td>
                </tr>
                <tr v-if="abierto === p.id" class="detalle-row">
                  <td colspan="6" class="detalle-expandido">
                    <div class="detalle-card">
                      <h4>Productos</h4>
                      <div v-if="!p.pedidosProductos?.length" class="empty">Sin productos</div>
                      <div v-else class="productos-lista">
                        <div
                          v-for="producto in p.pedidosProductos"
                          :key="producto.id"
                          class="producto-card"
                        >
                          <img
                            :src="producto.producto.imagenUrl"
                            alt="Producto"
                            class="producto-imagen"
                          />
                          <div class="producto-info">
                            <h5>{{ producto.producto.nombre }}</h5>
                            <p class="producto-detalle">
                              Cantidad: {{ producto.cantidad }} · Precio: Bs.
                              {{ fmtBs(producto.precioUnitario) }}
                            </p>
                            <strong class="subtotal"
                              >Subtotal: Bs.
                              {{ fmtBs(producto.cantidad * producto.precioUnitario) }}</strong
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.mis-pedidos {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.toolbar h2 {
  color: #2c3e50;
  font-size: 1.75rem;
  font-weight: 600;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.tabla-responsive {
  overflow-x: auto;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

.tabla thead {
  background: #f8f9fa;
}

.tabla th {
  background-color: #278E60;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: white;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.tabla td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #2d3748;
}

/* Filas intercaladas */
.tabla tbody tr:not(.detalle-row) {
  background: white;
}

.tabla tbody tr.fila-par:not(.detalle-row) {
  background: #CFE5DB;
}

.tabla tbody tr:hover:not(.detalle-row) {
  background: #e8f4ed;
  transition: background 0.2s ease;
}

.tabla tbody tr.fila-par:hover:not(.detalle-row) {
  background: #bfd9ce;
  transition: background 0.2s ease;
}

/* Badges de estado */
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.813rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-pendiente {
  background: #fef3c7;
  color: #92400e;
}

.badge-entregado {
  background: #d1fae5;
  color: #065f46;
}

.badge-cancelado {
  background: #fee2e2;
  color: #991b1b;
}

/* Botón de acción */
.btn-accion {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.btn-accion:hover {
  background: #5a67d8;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-accion.btn-activo {
  background: #fc8181;
}

.btn-accion.btn-activo:hover {
  background: #f56565;
}

/* Detalles expandidos */
.detalle-expandido {
  background: #fafbfc;
  padding: 0 !important;
}

.detalle-card {
  padding: 24px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detalle-card h4 {
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.1rem;
  font-weight: 600;
}

.productos-lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.producto-card {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.producto-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: #cbd5e0;
}

.producto-imagen {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.producto-info {
  flex: 1;
}

.producto-info h5 {
  color: #2d3748;
  margin: 0 0 8px 0;
  font-size: 1rem;
  font-weight: 600;
}

.producto-detalle {
  color: #718096;
  margin: 4px 0;
  font-size: 0.875rem;
}

.subtotal {
  color: #667eea;
  font-size: 0.938rem;
}

.empty {
  color: #a0aec0;
  text-align: center;
  padding: 32px;
  font-style: italic;
}

.alert.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #dc2626;
}

.mis-pedidos {
  padding: 24px;
  padding-top: 40px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 50vh;
}

.page-container {
  background-color: #FEF9EC;
  min-height: 60vh;
  padding: 20px;
}

.page-title {
  color: #2c3e50;
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 24px;
  padding-top: 20px;
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .mis-pedidos {
    padding: 12px;
    padding-top: 20px;
  }

  .tabla-responsive {
    overflow-x: auto;
    border-radius: 12px;
  }

  .tabla {
    min-width: 600px;
  }

  .tabla th {
    padding: 12px 8px;
    font-size: 0.75rem;
  }

  .tabla td {
    padding: 12px 8px;
    font-size: 0.875rem;
  }

  .btn-accion {
    padding: 6px 16px;
    font-size: 0.75rem;
  }

  .producto-imagen {
    width: 60px;
    height: 60px;
  }

  .producto-card {
    gap: 12px;
    padding: 12px;
  }

  .producto-info h5 {
    font-size: 0.9rem;
  }

  .producto-detalle {
    font-size: 0.8rem;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 16px;
  }

  .detalle-card {
    padding: 16px;
  }

  .detalle-card h4 {
    font-size: 1rem;
    margin-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 12px;
  }

  .mis-pedidos {
    padding: 8px;
  }

  .card {
    border-radius: 8px;
  }

  .tabla {
    min-width: 500px;
    font-size: 0.75rem;
  }

  .tabla th {
    padding: 10px 6px;
    font-size: 0.7rem;
    letter-spacing: 0;
  }

  .tabla td {
    padding: 10px 6px;
  }

  .btn-accion {
    padding: 5px 12px;
    font-size: 0.7rem;
  }

  .producto-imagen {
    width: 50px;
    height: 50px;
  }

  .producto-card {
    gap: 8px;
    padding: 10px;
  }

  .producto-info h5 {
    font-size: 0.85rem;
    margin-bottom: 4px;
  }

  .producto-detalle {
    font-size: 0.75rem;
    margin: 2px 0;
  }

  .page-title {
    font-size: 1.25rem;
    margin-bottom: 12px;
  }

  .detalle-card {
    padding: 12px;
  }

  .detalle-card h4 {
    font-size: 0.95rem;
    margin-bottom: 10px;
  }
}
</style>