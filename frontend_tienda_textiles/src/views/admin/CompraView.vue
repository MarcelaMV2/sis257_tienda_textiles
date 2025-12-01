<script setup lang="ts">
import CompraList from '@/components/compra/CompraList.vue'
import CompraSave from '@/components/compra/CompraSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const compraListRef = ref<typeof CompraList | null>(null)
const compraEdit = ref<any>(null)

function handleCreate() {
  compraEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(compra: any) {
  compraEdit.value = compra
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  compraListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="admin-wrap">
    <h2>Compras</h2>
    <Button label="Registrar Compra" icon="pi pi-plus" @click="handleCreate" />
    <CompraList ref="compraListRef" @edit="handleEdit" />
    <CompraSave
      :mostrar="mostrarDialog"
      :compra="compraEdit"
      :modoEdicion="!!compraEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped>
.admin-wrap {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  background-color: #eeeeee;
}
</style>
