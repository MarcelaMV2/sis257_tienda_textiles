<script setup lang="ts">
import type { Usuario } from '@/models/usuarios'
import http from '@/plugins/axios'
import { Button, Dialog, InputText, Select } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'usuarios'

const props = defineProps({
  mostrar: Boolean,
  usuario: {
    type: Object as () => Usuario,
    default: () => ({}) as Usuario,
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

// Modelo local
const usuario = ref<Usuario>({ ...props.usuario })

// Password separado para no tocar siempre la clave
const password = ref<string>('')

// Opciones de rol (ajusta según tu backend)
const roles = ref([
  { label: 'Administrador', value: 'admin' },
  { label: 'Cliente', value: 'cliente' },
])

// Actualizar cuando cambie el prop.usuario
watch(
  () => props.usuario,
  (u) => {
    usuario.value = { ...u }
    password.value = ''
  },
)

// Cuando se abre el diálogo, inicializar datos
watch(
  () => props.mostrar,
  (open) => {
    if (open) {
      if (props.usuario?.id) {
        // Modo edición
        usuario.value = { ...props.usuario }
        password.value = ''
      } else {
        // Modo creación
        usuario.value = {
          id: 0,
          nombre: '',
          apellidos: '',
          email: '',
          telefono: '',
          rol: 'cliente',
        } as Usuario
        password.value = ''
      }
    }
  },
)

async function handleSave() {
  try {
    const body: any = {
      nombre: usuario.value.nombre,
      apellidos: usuario.value.apellidos,
      email: usuario.value.email,
      telefono: usuario.value.telefono,
      rol: usuario.value.rol,
    }

    // En creación la clave es obligatoria, en edición solo si se quiere cambiar
    if (!props.modoEdicion || password.value) {
      body.clave = password.value
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${usuario.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    usuario.value = {} as Usuario
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Ocurrió un error al guardar el usuario')
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar usuario' : 'Crear usuario'"
      style="width: 0.28m; background-color: #fabf13; color: black;"
    >
      <!-- Nombre -->
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText
          id="nombre"
          v-model="usuario.nombre"
          class="flex-auto"
          autocomplete="off"
          maxlength="50"
          style="background-color: white; color: #303F2D;"
        />
      </div>

      <!-- Apellidos -->
      <div class="flex items-center gap-4 mb-4">
        <label for="apellidos" class="font-semibold w-3">Apellidos</label>
        <InputText
          id="apellidos"
          v-model="usuario.apellidos"
          class="flex-auto"
          autocomplete="off"
          maxlength="50"
          style="background-color: white; color: #303F2D;"
        />
      </div>

      <!-- Email -->
      <div class="flex items-center gap-4 mb-4">
        <label for="email" class="font-semibold w-3">Email</label>
        <InputText
          id="email"
          v-model="usuario.email"
          class="flex-auto"
          autocomplete="off"
          type="email"
          maxlength="100"
          style="background-color: white; color: #303F2D;"
        />
      </div>

      <!-- Teléfono -->
      <div class="flex items-center gap-4 mb-4">
        <label for="telefono" class="font-semibold w-3">Teléfono</label>
        <InputText
          id="telefono"
          v-model="usuario.telefono"
          class="flex-auto"
          autocomplete="off"
          maxlength="20"
          style="background-color: white; color: #303F2D;"
        />
      </div>

      <!-- Rol -->
      <div class="flex items-center gap-4 mb-4">
        <label for="rol" class="font-semibold w-3">Rol</label>
        <Select
          id="rol"
          v-model="usuario.rol"
          :options="roles"
          optionLabel="label"
          optionValue="value"
          class="flex-auto"
          :inputStyle="{ 'background-color': 'white', 'color': '#303F2D' }"
        />
      </div>

      <!-- Clave -->
      <div class="flex items-center gap-4 mb-4">
        <label for="clave" class="font-semibold w-3">
          {{ props.modoEdicion ? 'Nueva clave' : 'Clave' }}
        </label>
        <InputText
          id="clave"
          v-model="password"
          class="flex-auto"
          autocomplete="new-password"
          type="password"
          maxlength="200"
          style="background-color: white; color: #303F2D;"
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
