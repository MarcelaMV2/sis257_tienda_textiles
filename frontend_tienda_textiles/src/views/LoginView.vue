<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/index'
import { useRouter, useRoute } from 'vue-router'
import { parseJwt } from '@/helpers'

const router = useRouter()
const route = useRoute()
const email = ref('')
const clave = ref('')
const error = ref(false)

async function onSubmit() {
  const authStore = useAuthStore()
  try {
    await authStore.login(email.value, clave.value)

    // Obtener el token del localStorage después del login exitoso
    const token = localStorage.getItem('token')

    if (token) {
      // Decodificar el token para obtener el rol
      const decoded = parseJwt(token)
      const userRole = decoded?.rol || decoded?.role || decoded?.tipo

      // Redirigir según el rol
      if (userRole === 'admin') {
        // Si hay returnUrl en la query, usar esa, sino ir al admin
        const returnUrl = route.query.returnUrl as string
        router.push(returnUrl || '/admin')
      } else {
        // Cliente o cualquier otro rol
        router.push('/') // o '/mis-pedidos' si prefieres
      }
    }
  } catch {
    error.value = true
  }
}
</script>

<template>
  <div class="full-screen-container">
    <div class="container my-5 pt-5">
      <h1 class="text-center" style="color: #e54d07">Iniciar Sesión</h1>
      <form class="form" @submit.prevent="onSubmit">
        <label class="form-label">Email:</label>
        <input
          v-model="email"
          type="text"
          class="form-input"
          style="background-color: #c7daf1; color: black; border-radius: 20px"
          placeholder="Email"
          autofocus
        />

        <label class="form-label">Contraseña:</label>
        <input
          v-model="clave"
          type="password"
          class="form-input"
          style="background-color: #c7daf1; color: black; border-radius: 20px"
          placeholder="Contraseña"
        />

        <p v-if="error" class="text-danger">Usuario y/o contraseña incorrectos</p>
        <input type="submit" class="form-submit" value="Ingresar" />
      </form>
      <p class="mt-3 text-center">
        ¿No tienes cuenta?
        <RouterLink to="/register" class="text-primary fw-semibold"> Regístrate aquí </RouterLink>
      </p>
    </div>
  </div>
</template>

<style>
.full-screen-container {
  /* 1. Imagen de Fondo */
  background-image: url('@/assets/images/fondologin.jpg');

  /* 2. Propiedades de Ajuste */
  background-size: cover; /* Escala la imagen para cubrir todo el contenedor */
  background-position: center center; /* Centra la imagen horizontal y verticalmente */
  background-repeat: no-repeat; /* Evita que la imagen se repita */

  /* Propiedades de altura y ancho que ya tenías */
  min-height: 100vh;
  width: 100%;
  padding-top: 30px;
  /* Opcional: Color de respaldo (se ve si la imagen no carga) */
  background-color: #333333;
}

.form {
  margin: 1.5rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20%;
  min-width: 350px;
  max-width: 100%;
  background: #0b3a66;
  border-radius: 5px;
  padding: 50px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}

.form-label {
  margin-top: 2rem;
  color: white;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 10px 15px;
  background: none;
  background-image: none;
  border: 1px solid white;
  color: white;
}

.form-submit {
  background: #ee5007;
  border: none;
  border-radius: 5rem;
  color: white;
  margin-top: 3rem;
  padding: 1rem 0;
  cursor: pointer;
  transition: background 0.2s;
}
</style>
