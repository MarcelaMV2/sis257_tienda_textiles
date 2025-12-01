<script setup lang="ts">
import type { Categoria } from '@/models/categoria'
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { Button, Dialog, InputNumber, InputText, Select, Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'productos'
const props = defineProps({
  mostrar: Boolean,
  producto: {
    type: Object as () => Producto,
    default: () => ({}) as Producto,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const categorias = ref<Categoria[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const producto = ref<Producto>({ ...props.producto })
const idCategoria = ref<number>(0)

watch(
  () => props.producto,
  (p) => {
    producto.value = { ...p }
    idCategoria.value = p?.idCategoria ?? p?.categoria?.id ?? 0
  },
)

async function obtenerCategorias() {
  categorias.value = await http.get('categorias').then((r) => r.data)
}

/* async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  console.log('Archivo seleccionado para producto:', file);  // Verifica el archivo
  if (!file) return;
  const fd = new FormData();
  fd.append('file', file); // El archivo que se enviará al backend
  try {
    const { data } = await http.post('/uploads', fd, {  // Verifica la URL
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Respuesta del backend:', data);  // Verifica la respuesta
    if (data?.url) {
      producto.value.imagenUrl = data.url;  // Guarda la URL de la imagen
    }
  } catch (err: any) {
    console.error('Error al subir imagen:', err);
    alert('No se pudo subir la imagen');
  }
} */

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  console.log('Archivo seleccionado:', file)

  if (!file) return

  const fd = new FormData()
  fd.append('file', file)

  try {
    // ← NO pongas headers aquí
    const { data } = await http.post('uploads', fd)

    console.log('Respuesta del backend:', data)

    if (data?.url) {
      producto.value.imagenUrl = data.url
    }
  } catch (err: any) {
    console.error('Error al subir imagen:', err)
    console.error('Detalles:', err.response?.data)
    alert('No se pudo subir la imagen')
  }
}

async function handleSave() {
  try {
    const body = {
      idCategoria: idCategoria.value,
      nombre: producto.value.nombre,
      descripcion: producto.value.descripcion,
      precio: producto.value.precio,
      stock: producto.value.stock,
      imagenUrl: producto.value.imagenUrl, // ← ya contiene la URL de la subida
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${producto.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    producto.value = {} as Producto
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  (open) => {
    if (open) {
      obtenerCategorias()
      if (props.producto?.id) {
        producto.value = { ...props.producto }
        idCategoria.value = props.producto.idCategoria ?? props.producto.categoria?.id ?? 0
      } else {
        producto.value = {
          id: 0,
          idCategoria: 0,
          nombre: '',
          descripcion: '',
          precio: 0,
          stock: 0,
          imagenUrl: '',
          categoria: { id: 0 } as Categoria,
        } as Producto
        idCategoria.value = 0
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar un producto' : 'Crear nuevo producto'"
      style="width: 0.28m; background-color: #fabf13; color: black"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="categoria" class="font-semibold w-3">Categoría</label>
        <Select
          id="categoria"
          v-model="idCategoria"
          :options="categorias"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
          autofocus
          :inputStyle="{ 'background-color': 'white', color: '#303F2D' }"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText
          id="nombre"
          v-model="producto.nombre"
          class="flex-auto"
          autocomplete="off"
          maxlength="60"
          style="background-color: white; color: #303f2d"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="descripcion" class="font-semibold w-3">Descripción</label>
        <Textarea
          id="descripcion"
          v-model="producto.descripcion"
          class="flex-auto"
          rows="3"
          maxlength="200"
          autocomplete="off"
          style="background-color: white; color: #303f2d"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="precio" class="font-semibold w-3">Precio</label>
        <InputNumber
          id="precio"
          v-model.number="producto.precio"
          :minFractionDigits="2"
          :maxFractionDigits="5"
          class="flex-auto"
          autocomplete="off"
          :inputStyle="{ 'background-color': 'white', color: '#303F2D' }"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="stock" class="font-semibold w-3">Stock</label>
        <InputNumber
          id="stock"
          v-model.number="producto.stock"
          :minFractionDigits="0"
          :maxFractionDigits="0"
          :useGrouping="false"
          class="flex-auto"
          autocomplete="off"
          :inputStyle="{ 'background-color': 'white', color: '#303F2D' }"
        />
      </div>

      <!-- Subir imagen (único input visible) -->
      <div class="flex items-center gap-4 mb-4">
        <label for="imagenFile" class="font-semibold w-3">Imagen</label>
        <input id="imagenFile" type="file" accept="image/*" @change="onFileChange" />
      </div>

      <!-- Previsualización si ya hay URL (creación o edición) -->
      <div v-if="producto.imagenUrl" class="mb-4">
        <img
          :src="producto.imagenUrl"
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
        />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
