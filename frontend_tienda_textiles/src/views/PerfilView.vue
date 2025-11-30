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

const scrollTop = ref(0)

window.addEventListener('scroll', () => {
  scrollTop.value = window.scrollY
})
</script>

<template>
  <div class="perfil-container">
    <section class="profile-wrap">
      <header class="toolbar" :class="{ oculto: scrollTop > 50 }">
        <h2>Mi Perfil</h2>
      </header>

      <!-- Mensaje de error -->
      <div v-if="error" class="alert error">
        {{ error }}
      </div>

      <!-- Vista del perfil -->
      <div v-else class="profile-card">
        <div class="profile-row">
          <strong>Nombre:</strong>
          <span>{{ usuario.nombre }}</span>
        </div>

        <div class="profile-row">
          <strong>Email:</strong>
          <span>{{ usuario.email }}</span>
        </div>

        <div class="profile-row">
          <strong>Teléfono:</strong>
          <span>{{ usuario.telefono || 'No disponible' }}</span>
        </div>

        <RouterLink to="/mis-pedidos" class="button"> 📦 Ver mis pedidos </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.perfil-container {
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

.profile-wrap {
  width: 100%;
  max-width: 550px;
}

.toolbar h2 {
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 25px;
  color: #333;
}

/* Tarjeta */
.profile-card {
  background: #FDE8AB;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Filas */
.profile-row {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #1E88E5;
}

.profile-row strong {
  color: #444;
}

/* Botón */
.button {
  margin-top: 20px;
  display: inline-block;
  text-align: center;
  width: 100%;
  padding: 12px 18px;
  background: #1e88e5;
  color: white;
  font-weight: bold;
  border-radius: 10px;
  text-decoration: none;
  transition: 0.3s ease;
}

.button:hover {
  background: #1565c0;
}

/* Estilo de error */
.alert.error {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 10px;
  border-left: 4px solid #e53935;
  font-weight: 500;
}

.toolbar.oculto {
  opacity: 0;
  transform: translateY(-20px);
  pointer-events: none;
}
</style>
