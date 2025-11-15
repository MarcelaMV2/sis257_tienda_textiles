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
const emit = defineEmits(['edit'])

const productosFiltrados = computed(() => {
  return productos.value.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.categoria.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

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
  <div>
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o categoría" />
      </InputGroup>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Imagen</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(producto, index) in productosFiltrados" :key="producto.id">
          <td>{{ index + 1 }}</td>
          <td>{{ producto.nombre }}</td>
          <td>{{ producto.categoria?.nombre || '' }}</td>
          <td>{{ producto.precio }}</td>
          <td>{{ producto.stock }}</td>
          <td><img :src="producto.imagenUrl" alt="foto" width="80" /></td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(producto)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(producto)"
            />
          </td>
        </tr>
        <tr v-if="productosFiltrados.length === 0">
          <td colspan="7">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar el producto {{ productoDelete?.nombre }}?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
