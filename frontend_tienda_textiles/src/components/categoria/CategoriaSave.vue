<script setup lang="ts">
import type { Categoria } from '@/models/categoria'
import http from '@/plugins/axios'
import { Button, Dialog, InputText, Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'categorias'
const props = defineProps({
  mostrar: Boolean,
  categoria: {
    type: Object as () => Categoria,
    default: () => ({}) as Categoria,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const categoria = ref<Categoria>({ ...props.categoria })

watch(
  () => props.categoria,
  (newVal) => {
    categoria.value = { ...newVal }
  },
)

watch(
  () => props.mostrar,
  (open) => {
    if (open) {
      if (props.categoria?.id) {
        categoria.value = { ...props.categoria }
      } else {
        // Resetea para nuevo registro
        categoria.value = {
          id: 0,
          nombre: '',
          descripcion: '',
          imagenUrl: '',
        } as Categoria
      }
    }
  },
)

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  const fd = new FormData()
  fd.append('file', file)

  try {
    // No pongas Content-Type manualmente, axios lo detecta con FormData
    const { data } = await http.post('uploads', fd)

    if (data?.url) {
      categoria.value.imagenUrl = data.url
      console.log('Imagen subida:', data.url)
    }
  } catch (err: any) {
    console.error('Error al subir imagen:', err)
    alert(err?.response?.data?.message || 'No se pudo subir la imagen')
  }
}

async function handleSave() {
  try {
    const body = {
      nombre: categoria.value.nombre,
      descripcion: categoria.value.descripcion,
      imagenUrl: categoria.value.imagenUrl || '', // ← AGREGADO
    }

    console.log('Body enviado:', body)

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${categoria.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    categoria.value = {} as Categoria
    dialogVisible.value = false
  } catch (error: any) {
    console.error('Error al guardar:', error)
    alert(error?.response?.data?.message || 'Error al guardar la categoría')
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar categoria' : 'Crear nueva categoría'"
      style="width: 28rem; background-color: #fabf13; color: black"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText
          id="nombre"
          v-model="categoria.nombre"
          class="flex-auto"
          autocomplete="off"
          autofocus
          maxlength="60"
          style="background-color: white; color: #303f2d"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="descripcion" class="font-semibold w-3">Descripción</label>
        <Textarea
          id="descripcion"
          v-model="categoria.descripcion"
          class="flex-auto"
          rows="3"
          maxlength="200"
          autocomplete="off"
          style="background-color: white; color: #303f2d"
        />
      </div>

      <!-- Subir imagen -->
      <div class="flex items-center gap-4 mb-4">
        <label for="imagenFile" class="font-semibold w-3">Imagen</label>
        <input id="imagenFile" type="file" accept="image/*" @change="onFileChange" />
      </div>

      <!-- Previsualización -->
      <div v-if="categoria.imagenUrl" class="mb-4 text-center">
        <img
          :src="categoria.imagenUrl"
          alt="imagen categoría"
          style="width: 120px; height: 120px; object-fit: cover; border-radius: 6px"
        />
        <p class="text-xs text-gray-500 mt-1">Vista previa</p>
      </div>

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
