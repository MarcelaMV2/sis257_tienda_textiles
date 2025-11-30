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
  <div class="login-container">
    <form class="login-form" @submit.prevent="onSubmit">
      <h1 class="login-title">Iniciar Sesión</h1>

      <label class="form-label">Correo electrónico</label>
      <input
        v-model="email"
        type="email"
        class="form-input"
        placeholder="Ingresa tu correo"
        required
      />

      <label class="form-label">Contraseña</label>
      <input
        v-model="clave"
        type="password"
        class="form-input"
        placeholder="Ingresa tu contraseña"
        required
      />

      <p v-if="error" class="error-message">Usuario o contraseña incorrectos</p>

      <button type="submit" class="form-submit">Ingresar</button>

      <p class="register-text">
        ¿No tienes cuenta?
        <RouterLink to="/register" class="link-register"> Regístrate aquí </RouterLink>
      </p>
    </form>
  </div>
</template>

<style>
/* ===============================
   LOGIN PAGE — SANSA THEME
=============================== */

.login-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  background: linear-gradient(135deg, #0b1f3a, #1a3d6b); /* igual al registro */
  padding: 20px;
}

/* Caja */
.login-form {
  width: 350px;
  background: #ffffffee;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
  border: 3px solid #fabf13; /* amarillo SANSA */
  display: flex;
  flex-direction: column;
}

/* Título */
.login-title {
  color: #1a365d; /* azul oscuro SANSA */
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
}

/* Etiquetas */
.form-label {
  margin-top: 1.3rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748; /* gris profesional */
}

/* Inputs */
.form-input {
  padding: 12px 14px;
  border: 1.5px solid #d0d7e2;
  border-radius: 10px;
  background: #ffffff;
  font-size: 0.95rem;
  color: #1a202c;
  transition: 0.25s ease;
  margin-top: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

.form-input:focus {
  border-color: #2b6cb0;
  box-shadow: 0 0 0 3px rgba(43,108,176,0.15);
  outline: none;
}

/* Botón */
.form-submit {
  margin-top: 2rem;
  background: #2b6cb0;
  border: none;
  border-radius: 10px;
  color: white;
  padding: 0.9rem 0;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.2s;
}

.form-submit:hover {
  background: #1a365d;
}

/* Error */
.error-message {
  margin-top: 10px;
  color: #e63946;
  font-weight: 600;
}

/* Registro */
.register-text {
  margin-top: 1rem;
  text-align: center;
  color: #2d3748;
}

.link-register {
  font-weight: 700;
  color: #1a365d;
}

.link-register:hover {
  color: #2b6cb0;
}
</style>
