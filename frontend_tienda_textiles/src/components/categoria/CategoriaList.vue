<script setup lang="ts">
import type { Categoria } from '@/models/categoria'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'categorias'
const categorias = ref<Categoria[]>([])
const categoriaDelete = ref<Categoria | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')
const emit = defineEmits(['edit'])

const categoriasFiltradas = computed(() => {
  return categorias.value.filter(
    (categoria) =>
      categoria.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      categoria.descripcion.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

async function obtenerLista() {
  categorias.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(categoria: Categoria) {
  emit('edit', categoria)
}

function mostrarEliminarConfirm(categoria: Categoria) {
  categoriaDelete.value = categoria
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${categoriaDelete.value?.id}`)
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o descripción" />
      </InputGroup>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(categoria, index) in categoriasFiltradas" :key="categoria.id">
          <td>{{ index + 1 }}</td>
          <td>{{ categoria.nombre }}</td>
          <td>{{ categoria.descripcion }}</td>
          <td>
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
          </td>
        </tr>
        <tr v-if="categoriasFiltradas.length === 0">
          <td colspan="4">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar la categoría {{ categoriaDelete?.nombre }}?</p>
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
