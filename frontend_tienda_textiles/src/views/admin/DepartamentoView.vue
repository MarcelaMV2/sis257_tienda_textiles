<script setup lang="ts">
import DepartamentoList from '@/components/departamento/DepartamentoList.vue'
import DepartamentoSave from '@/components/departamento/DepartamentoSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const departamentoListRef = ref<typeof DepartamentoList | null>(null)
const departamentoEdit = ref<any>(null)

function handleCreate() {
  departamentoEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(departamento: any) {
  departamentoEdit.value = departamento
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  departamentoListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="admin-wrap">
    <h2>Departamentos</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <DepartamentoList ref="departamentoListRef" @edit="handleEdit" />
    <DepartamentoSave
      :mostrar="mostrarDialog"
      :departamento="departamentoEdit"
      :modoEdicion="!!departamentoEdit"
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
