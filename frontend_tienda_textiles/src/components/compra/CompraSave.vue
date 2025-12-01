<script setup lang="ts">
import type { Compra } from '@/models/compra'
import type { Producto } from '@/models/producto'
import type { Proveedor } from '@/models/proveedor'
import http from '@/plugins/axios'
import { Button, Dialog, InputNumber, Select, Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'compras'

const props = defineProps({
  mostrar: Boolean,
  compra: {
    type: Object as () => Compra,
    default: () => ({}) as Compra,
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

const compra = ref<Compra>({ ...props.compra })
const idProveedor = ref<number>(0)
const idProducto = ref<number>(0)

const proveedores = ref<Proveedor[]>([])
const productos = ref<Producto[]>([])

// 👇 TOTAL CALCULADO PARA MOSTRAR EN EL INPUT DESHABILITADO
const montoTotal = computed(() => {
  const cantidad = Number(compra.value.cantidad) || 0
  const precioUnitario = Number(compra.value.precioUnitario) || 0
  return cantidad * precioUnitario
})

async function obtenerProveedores() {
  proveedores.value = await http.get('proveedores').then((r) => r.data)
}

async function obtenerProductos() {
  productos.value = await http.get('productos').then((r) => r.data)
}

async function handleSave() {
  try {
    const cantidad = Number(compra.value.cantidad) || 0
    const precioUnitario = Number(compra.value.precioUnitario) || 0
    const total = cantidad * precioUnitario

    const body = {
      idProveedor: idProveedor.value,
      idProducto: idProducto.value,
      cantidad,
      precioUnitario,
      montoTotal: total, // lo mandas al backend
      observacion: compra.value.observacion || null,
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${compra.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    compra.value = {} as Compra
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Ocurrió un error')
  }
}

watch(
  () => props.compra,
  (c) => {
    compra.value = { ...c }
    idProveedor.value = c?.idProveedor ?? c?.proveedor?.id ?? 0
    idProducto.value = c?.idProducto ?? c?.producto?.id ?? 0
  },
)

watch(
  () => props.mostrar,
  async (open) => {
    if (open) {
      await Promise.all([obtenerProveedores(), obtenerProductos()])

      if (props.compra?.id) {
        // Edición
        compra.value = { ...props.compra }
        idProveedor.value = props.compra.idProveedor ?? props.compra.proveedor?.id ?? 0
        idProducto.value = props.compra.idProducto ?? props.compra.producto?.id ?? 0
      } else {
        // Creación
        compra.value = {
          id: 0,
          idProveedor: 0,
          idProducto: 0,
          cantidad: 0,
          precioUnitario: 0,
          montoTotal: 0,
          observacion: '',
        } as Compra
        idProveedor.value = 0
        idProducto.value = 0
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Compra' : 'Registrar Compra'"
      style="width: 0.28m; background-color: #fabf13; color: black"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="proveedor" class="font-semibold w-3">Proveedor</label>
        <Select
          id="proveedor"
          v-model="idProveedor"
          :options="proveedores"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
          :inputStyle="{ 'background-color': 'white', color: '#303F2D' }"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="producto" class="font-semibold w-3">Producto</label>
        <Select
          id="producto"
          v-model="idProducto"
          :options="productos"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
          :inputStyle="{ 'background-color': 'white', color: '#303F2D' }"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="cantidad" class="font-semibold w-3">Cantidad</label>
        <InputNumber
          id="cantidad"
          v-model.number="compra.cantidad"
          :min="1"
          class="flex-auto"
          autocomplete="off"
          :inputStyle="{ 'background-color': 'white', color: '#303F2D' }"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="precioUnitario" class="font-semibold w-3">Precio Unitario</label>
        <InputNumber
          id="precioUnitario"
          v-model.number="compra.precioUnitario"
          :minFractionDigits="2"
          :maxFractionDigits="5"
          class="flex-auto"
          autocomplete="off"
          :inputStyle="{ 'background-color': 'white', color: '#303F2D' }"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label class="font-semibold w-3">Total</label>
        <InputNumber
          :modelValue="montoTotal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          class="flex-auto"
          disabled
          :inputStyle="{ 'background-color': 'white', color: '#303F2D' }"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="observacion" class="font-semibold w-3">Observación</label>
        <Textarea
          id="observacion"
          v-model="compra.observacion"
          class="flex-auto"
          rows="3"
          autocomplete="off"
          maxlength="255"
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
