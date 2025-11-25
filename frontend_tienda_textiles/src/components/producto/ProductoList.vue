<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'productos'
const productos = ref<Producto[]>([])
const productoDelete = ref<Producto | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

// Paginación
const paginaActual = ref(1)
const itemsPorPagina = ref(10)

const emit = defineEmits(['edit'])

const productosFiltrados = computed(() => {
  return productos.value.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.categoria.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

// Paginación
const totalPaginas = computed(() =>
  Math.ceil(productosFiltrados.value.length / itemsPorPagina.value),
)

const productosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value
  const fin = inicio + itemsPorPagina.value
  return productosFiltrados.value.slice(inicio, fin)
})

function cambiarPagina(pagina: number) {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaActual.value = pagina
  }
}

async function obtenerLista() {
  productos.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(producto: Producto) {
  emit('edit', producto)
}

function mostrarEliminarConfirm(producto: Producto) {
  productoDelete.value = producto
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${productoDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div class="productos-container">
    <!-- Header con botón y búsqueda -->
    <div class="header-acciones">
      <div class="search-bar">
        <InputGroup>
          <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
          <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o categoría" />
        </InputGroup>
      </div>
    </div>

    <!-- Tabla -->
    <div class="tabla-card">
      <table class="tabla">
        <thead>
          <tr>
            <th>Nro</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(producto, index) in productosPaginados" :key="producto.id">
            <td>{{ (paginaActual - 1) * itemsPorPagina + index + 1 }}</td>
            <td>
              <div class="producto-info">
                <img :src="producto.imagenUrl" alt="foto" class="producto-img" />
                <span class="producto-nombre">{{ producto.nombre }}</span>
              </div>
            </td>
            <td>
              <span class="badge">{{ producto.categoria?.nombre || '—' }}</span>
            </td>
            <td class="precio">Bs. {{ producto.precio.toFixed(2) }}</td>
            <td>
              <span class="badge" :class="producto.stock <= 10 ? 'badge-stock-bajo' : ''">
                {{ producto.stock }}
              </span>
            </td>
            <td>
              <div class="acciones">
                <Button icon="pi pi-pencil" severity="info" text @click="emitirEdicion(producto)" />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  @click="mostrarEliminarConfirm(producto)"
                />
              </div>
            </td>
          </tr>
          <tr v-if="productosPaginados.length === 0">
            <td colspan="6" class="empty">No se encontraron productos.</td>
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
          ¿Estás seguro de que deseas eliminar el producto
          <strong>{{ productoDelete?.nombre }}</strong
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
.productos-container {
  padding: 0;
}

/* Header con botón crear */
.header-acciones {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.header-acciones :deep(.p-button) {
  background: #fbbf24;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  color: #1a202c;
  transition: all 0.2s ease;
}

.header-acciones :deep(.p-button:hover) {
  background: #f59e0b;
}

/* Buscador */
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

/* Tabla */
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

.producto-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.producto-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

.producto-nombre {
  color: #1f2937;
}

.precio {
  font-weight: 600;
  color: #374151;
}

/* Categoría y stock sin fondos de color */
.badge {
  font-size: 0.813rem;
  color: #4b5563;
}

.badge-stock-bajo {
  color: #dc2626;
  font-weight: 600;
}

/* Botones de acción sin círculos */
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

/* Dialog */
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

  .producto-img {
    width: 40px;
    height: 40px;
  }
}
</style>
