<script setup lang="ts">
import type { Categoria } from '@/models/categoria'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'categorias'
const categorias = ref<Categoria[]>([])
const categoriaDelete = ref<Categoria | null>(null)
const mostrarConfirmDialog = ref(false)
const busqueda = ref('')
const paginaActual = ref(1)
const ITEMS_PER_PAGE = 10

const emit = defineEmits(['edit'])

const categoriasFiltradas = computed(() =>
  categorias.value.filter((c) =>
    (c.nombre + ' ' + c.descripcion).toLowerCase().includes(busqueda.value.toLowerCase()),
  ),
)

const totalPaginas = computed(() => Math.ceil(categoriasFiltradas.value.length / ITEMS_PER_PAGE))

const categoriasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * ITEMS_PER_PAGE
  return categoriasFiltradas.value.slice(inicio, inicio + ITEMS_PER_PAGE)
})

const cambiarPagina = (p: number) => {
  if (p >= 1 && p <= totalPaginas.value) paginaActual.value = p
}

const obtenerLista = async () => {
  categorias.value = await http.get(ENDPOINT).then((r) => r.data)
}

const emitirEdicion = (categoria: Categoria) => emit('edit', categoria)

const mostrarEliminarConfirm = (categoria: Categoria) => {
  categoriaDelete.value = categoria
  mostrarConfirmDialog.value = true
}

const eliminar = async () => {
  await http.delete(`${ENDPOINT}/${categoriaDelete.value?.id}`)
  await obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(obtenerLista)
defineExpose({ obtenerLista })
</script>

<template>
  <div class="productos-container">
    <div class="header-acciones">
      <div class="search-bar">
        <InputGroup style="margin-top: 5px">
          <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
          <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o descripción" />
        </InputGroup>
      </div>
    </div>

    <div class="tabla-card">
      <table class="tabla">
        <thead>
          <tr>
            <th>Nro</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(categoria, index) in categoriasPaginadas" :key="categoria.id">
            <td>{{ (paginaActual - 1) * ITEMS_PER_PAGE + index + 1 }}</td>
            <td class="producto-nombre">{{ categoria.nombre }}</td>
            <td>{{ categoria.descripcion }}</td>
            <td><img :src="categoria.imagenUrl" alt="foto" class="producto-img" /></td>
            <td>
              <div class="acciones">
                <Button
                  icon="pi pi-pencil"
                  aria-label="Editar"
                  text
                  @click="emitirEdicion(categoria)"
                />
                <Button
                  icon="pi pi-trash"
                  aria-label="Eliminar"
                  text
                  @click="mostrarEliminarConfirm(categoria)"
                />
              </div>
            </td>
          </tr>
          <tr v-if="categoriasPaginadas.length === 0">
            <td colspan="5" class="empty">No se encontraron resultados.</td>
          </tr>
        </tbody>
      </table>

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

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '400px' }"
      modal
    >
      <div class="confirm-content">
        <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #f59e0b"></i>
        <p>
          ¿Estás seguro de que deseas eliminar la categoría
          <strong>{{ categoriaDelete?.nombre }}</strong
          >?
        </p>
      </div>
      <template #footer>
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          outlined
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" severity="danger" @click="eliminar" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
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

.producto-nombre {
  color: #1f2937;
  font-weight: 500;
}

.producto-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

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

.acciones :deep(.p-button[aria-label='Editar']:hover) {
  color: #3b82f6;
}

.acciones :deep(.p-button[aria-label='Eliminar']:hover) {
  color: #ef4444;
}

.empty {
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  padding: 32px;
}

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
