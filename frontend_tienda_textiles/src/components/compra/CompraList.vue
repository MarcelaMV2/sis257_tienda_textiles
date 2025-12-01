<script setup lang="ts">
import type { Compra } from '@/models/compra'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'compras'
const compras = ref<Compra[]>([])
const compraDelete = ref<Compra | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

// Paginación
const paginaActual = ref(1)
const itemsPorPagina = ref(10)

const emit = defineEmits(['edit'])

const comprasFiltradas = computed(() => {
  const term = busqueda.value.toLowerCase()
  return compras.value.filter((c) => {
    const prov = c.proveedor?.nombre || ''
    const prod = c.producto?.nombre || ''
    return (
      prov.toLowerCase().includes(term) ||
      prod.toLowerCase().includes(term) ||
      String(c.id).includes(term)
    )
  })
})

const totalPaginas = computed(() => Math.ceil(comprasFiltradas.value.length / itemsPorPagina.value))

const comprasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value
  const fin = inicio + itemsPorPagina.value
  return comprasFiltradas.value.slice(inicio, fin)
})

function cambiarPagina(pagina: number) {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaActual.value = pagina
  }
}

async function obtenerLista() {
  compras.value = await http.get(ENDPOINT).then((r) => r.data)
}

function emitirEdicion(compra: Compra) {
  emit('edit', compra)
}

function mostrarEliminarConfirm(compra: Compra) {
  compraDelete.value = compra
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  if (!compraDelete.value) return
  await http.delete(`${ENDPOINT}/${compraDelete.value.id}`)
  await obtenerLista()
  mostrarConfirmDialog.value = false
}

function fmtFecha(iso?: string | Date) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString()
}

function fmtBs(n: number | undefined) {
  if (n == null) return '0.00'
  return Number(n).toFixed(2)
}

onMounted(obtenerLista)

defineExpose({ obtenerLista })
</script>

<template>
  <div class="productos-container">
    <!-- Header con búsqueda -->
    <div class="header-acciones">
      <div class="search-bar">
        <InputGroup style="margin-top: 5px">
          <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
          <InputText
            v-model="busqueda"
            type="text"
            placeholder="Buscar por proveedor, producto o N° compra"
          />
        </InputGroup>
      </div>
    </div>

    <!-- Tabla -->
    <div class="tabla-card">
      <table class="tabla">
        <thead>
          <tr>
            <th>Nro</th>
            <th>Fecha</th>
            <th>Proveedor</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(compra, index) in comprasPaginadas" :key="compra.id">
            <td>{{ (paginaActual - 1) * itemsPorPagina + index + 1 }}</td>
            <!-- usa fechaCreacion del entity -->
            <td>{{ fmtFecha(compra.fechaCreacion as any) }}</td>
            <td>{{ compra.proveedor?.nombre || '—' }}</td>
            <td>{{ compra.producto?.nombre || '—' }}</td>
            <td>{{ compra.cantidad }}</td>
            <!-- usa precioUnitario -->
            <td>Bs. {{ fmtBs(compra.precioUnitario) }}</td>
            <!-- usa montoTotal del backend -->
            <td>Bs. {{ fmtBs(compra.montoTotal) }}</td>
            <td>
              <div class="acciones">
                <Button icon="pi pi-pencil" severity="info" text @click="emitirEdicion(compra)" />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  @click="mostrarEliminarConfirm(compra)"
                />
              </div>
            </td>
          </tr>
          <tr v-if="comprasPaginadas.length === 0">
            <td colspan="8" class="empty">No se encontraron compras.</td>
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
          <i class="pi pi-chevron-left"></i>
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
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Dialog de confirmación -->
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '400px' }"
      modal
    >
      <div class="confirm-content">
        <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #f59e0b"></i>
        <p>
          ¿Estás seguro de que deseas eliminar la compra
          <strong>#{{ compraDelete?.id }}</strong
          >?
        </p>
      </div>
      <template #footer>
        <Button
          label="Cancelar"
          severity="secondary"
          outlined
          @click="mostrarConfirmDialog = false"
        />
        <Button label="Eliminar" severity="danger" @click="eliminar" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
/* dejo tu mismo CSS tal cual */
.productos-container {
  padding: 0;
}

.header-acciones {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.search-bar {
  flex: 1;
  max-width: 400px;
}

.search-bar :deep(.p-inputgroup) {
  border-radius: 8px;
  overflow: hidden;
}

.search-bar :deep(.p-inputtext) {
  border: 1px solid #d1d5db;
  border-left: none;
  padding: 10px 16px;
}

.search-bar :deep(.p-inputtext:focus) {
  border-color: #fbbf24;
  outline: none;
  box-shadow: none;
}

.search-bar :deep(.p-inputgroup-addon) {
  background: white;
  border: 1px solid #d1d5db;
  border-right: none;
  color: #6b7280;
}

.tabla-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

.tabla thead {
  background: linear-gradient(135deg, #fabf13 0%, #f59e0b 100%);
}

.tabla th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  color: #1a202c;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tabla td {
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #374151;
  font-size: 0.875rem;
}

.tabla tbody tr:hover {
  background: #fafafa;
}

.badge {
  font-size: 0.813rem;
  color: #4b5563;
}

/* Botones de acción */
.acciones {
  display: flex;
  gap: 8px;
}

.acciones :deep(.p-button) {
  padding: 6px;
  background: none;
  border: none;
  color: #6b7280;
  transition: color 0.2s;
}

.acciones :deep(.p-button:hover) {
  background: none;
}

.acciones :deep(.p-button[severity='info']:hover) {
  color: #3b82f6;
}

.acciones :deep(.p-button[severity='danger']:hover) {
  color: #ef4444;
}

.empty {
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  padding: 32px;
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

.confirm-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
}

.confirm-content p {
  margin: 0;
  color: #4b5563;
}

.confirm-content strong {
  color: #1a202c;
}

/* Responsive */
@media (max-width: 768px) {
  .header-acciones {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar {
    max-width: 100%;
  }

  .tabla th,
  .tabla td {
    padding: 10px 12px;
    font-size: 0.813rem;
  }
}
</style>
