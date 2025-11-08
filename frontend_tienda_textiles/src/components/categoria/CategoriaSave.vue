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

async function handleSave() {
  try {
    const body = {
      nombre: categoria.value.nombre,
      descripcion: categoria.value.descripcion,
    }
    if (props.modoEdicion) {
      console.log('body enviado:', body)

      await http.patch(`${ENDPOINT}/${categoria.value.id}`, body)
    } else {
      console.log('body enviadoFYTGHVGUV:', body)
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    categoria.value = {} as Categoria
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const fd = new FormData()
  fd.append('file', file)
  try {
    const { data } = await http.post('/uploads', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    if (data?.url) categoria.value.imagenUrl = data.url // ← se guarda internamente
  } catch (err: any) {
    alert(err?.response?.data?.message || 'No se pudo subir la imagen')
  } finally {
    input.value = ''
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar' : 'Crear'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText
          id="nombre"
          v-model="categoria.nombre"
          class="flex-auto"
          autocomplete="off"
          autofocus
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
        />
      </div>

      <!-- Subir imagen (único input visible) -->
      <div class="flex items-center gap-4 mb-4">
        <label for="imagenFile" class="font-semibold w-3">Imagen</label>
        <input id="imagenFile" type="file" accept="image/*" @change="onFileChange" />
      </div>

      <!-- Previsualización si ya hay URL (creación o edición) -->
      <div v-if="categoria.imagenUrl" class="mb-4">
        <img
          :src="categoria.imagenUrl"
          alt="imagen producto"
          style="width: 120px; border-radius: 6px"
        />
      </div>

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
