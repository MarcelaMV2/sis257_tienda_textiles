<script setup lang="ts">
import type { Departamento } from '@/models/departamento'
import http from '@/plugins/axios'
import { Button, Dialog, InputText } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'departamentos'
const props = defineProps({
  mostrar: Boolean,
  departamento: {
    type: Object as () => Departamento,
    default: () => ({}) as Departamento,
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

const departamento = ref<Departamento>({ ...props.departamento })

watch(
  () => props.departamento,
  (newVal) => {
    departamento.value = { ...newVal }
  },
)

watch(
  () => props.mostrar,
  (open) => {
    if (open) {
      if (props.departamento?.id) {
        departamento.value = { ...props.departamento }
      } else {
        // Nuevo registro
        departamento.value = {
          id: 0,
          nombre: '',
        } as Departamento
      }
    }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: departamento.value.nombre,
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${departamento.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    departamento.value = {} as Departamento
    dialogVisible.value = false
  } catch (error: any) {
    console.error('Error al guardar:', error)
    alert(error?.response?.data?.message || 'Error al guardar el departamento')
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar departamento' : 'Crear departamento'"
      style="width: 24rem; background-color: #fabf13; color: black"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText
          id="nombre"
          v-model="departamento.nombre"
          class="flex-auto"
          autocomplete="off"
          autofocus
          maxlength="100"
          style="background-color: white; color: #303f2d"
        />
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
