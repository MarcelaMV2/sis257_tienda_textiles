<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/plugins/axios'
import { getTokenFromLocalStorage, parseJwt } from '@/helpers'
import router from '@/router'

const usuario = ref({
  id: 0,
  nombre: '',
  email: '',
  telefono: '',
})

const error = ref<string | null>(null)

onMounted(async () => {
  const token = getTokenFromLocalStorage()
  const payload = token ? parseJwt(token) : null
  if (!token) {
    alert('No estás logueado')
    router.replace('/login')
    return
  }

  try {
    const { data } = await http.get(`/usuarios/${payload?.sub}`)
    usuario.value = data
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'No se pudo cargar el perfil'
  }
})
</script>

<template>
  <div class="perfil-container">
    <section class="profile-wrap">
      <header class="toolbar">
        <h2>Mi Perfil</h2>
      </header>

      <div v-if="error" class="alert error">{{ error }}</div>
      <div v-else>
        <div class="profile-card">
          <div class="profile-item">
            <strong>Nombre:</strong>
            <span>{{ usuario.nombre }}</span>
          </div>
          <div class="profile-item">
            <strong>Email:</strong>
            <span>{{ usuario.email }}</span>
          </div>
          <div class="profile-item">
            <strong>Teléfono:</strong>
            <span>{{ usuario.telefono || 'No disponible' }}</span>
          </div>
          <!-- Aquí puedes agregar un formulario para editar el perfil -->
          <RouterLink to="/mis-pedidos" class="button">mis pedidos</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.perfil-container {
  min-height: calc(100vh - 400px); /* Ajusta el 400px según la altura de tu header + footer */
  padding: 40px 20px;
}
</style>
