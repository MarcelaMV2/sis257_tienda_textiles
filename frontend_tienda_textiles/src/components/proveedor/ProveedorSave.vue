<script setup lang="ts">
import type { Proveedor } from '@/models/proveedor'
import http from '@/plugins/axios'
import { Button, Dialog, InputText, Select } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'proveedores'

const props = defineProps({
  mostrar: Boolean,
  proveedor: {
    type: Object as () => Proveedor,
    default: () => ({}) as Proveedor,
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

const proveedor = ref<Proveedor>({ ...props.proveedor })

watch(
  () => props.proveedor,
  (p) => {
    proveedor.value = { ...p }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: proveedor.value.nombre,
      telefono: proveedor.value.telefono,
      email: proveedor.value.email,
      direccion: proveedor.value.direccion,
      estado: proveedor.value.estado || 'activo',
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${proveedor.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    proveedor.value = {} as Proveedor
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Ocurrió un error')
  }
}

watch(
  () => props.mostrar,
  (open) => {
    if (open) {
      if (props.proveedor?.id) {
        // Edición
        proveedor.value = { ...props.proveedor }
      } else {
        // Creación
        proveedor.value = {
          id: 0,
          nombre: '',
          telefono: '',
          email: '',
          direccion: '',
          estado: 'activo',
        } as Proveedor
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Proveedor' : 'Crear Proveedor'"
      style="width: 0.28m; background-color: #fabf13; color: black"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText
          id="nombre"
          v-model="proveedor.nombre"
          class="flex-auto"
          autocomplete="off"
          maxlength="150"
          style="background-color: white; color: #303f2d"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="telefono" class="font-semibold w-3">Teléfono</label>
        <InputText
          id="telefono"
          v-model="proveedor.telefono"
          class="flex-auto"
          autocomplete="off"
          maxlength="50"
          style="background-color: white; color: #303f2d"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="email" class="font-semibold w-3">Email</label>
        <InputText
          id="email"
          v-model="proveedor.email"
          class="flex-auto"
          autocomplete="off"
          maxlength="150"
          style="background-color: white; color: #303f2d"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="direccion" class="font-semibold w-3">Dirección</label>
        <InputText
          id="direccion"
          v-model="proveedor.direccion"
          class="flex-auto"
          autocomplete="off"
          maxlength="255"
          style="background-color: white; color: #303f2d"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="estado" class="font-semibold w-3">Estado</label>
        <Select
          id="estado"
          v-model="proveedor.estado"
          :options="[
            { label: 'Activo', value: 'activo' },
            { label: 'Inactivo', value: 'inactivo' },
          ]"
          optionLabel="label"
          optionValue="value"
          class="flex-auto"
          :inputStyle="{ 'background-color': 'white', color: '#303F2D' }"
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
