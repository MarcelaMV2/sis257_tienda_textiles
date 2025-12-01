<script setup lang="ts">
import UsuarioList from '@/components/usuario/UsuarioList.vue'
import UsuarioSave from '@/components/usuario/UsuarioSave.vue'
import type { Usuario } from '@/models/usuarios'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const usuarioListRef = ref<typeof UsuarioList | null>(null)
const usuarioEdit = ref<Usuario | null>(null)

function handleCreate() {
  usuarioEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(usuario: Usuario) {
  usuarioEdit.value = usuario
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  usuarioListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="admin-wrap">
    <h2>Usuarios</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <UsuarioList ref="usuarioListRef" @edit="handleEdit" />
    <UsuarioSave
      :mostrar="mostrarDialog"
      :usuario="usuarioEdit"
      :modoEdicion="!!usuarioEdit"
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
