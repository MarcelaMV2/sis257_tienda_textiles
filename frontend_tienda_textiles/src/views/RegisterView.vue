<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import http from '@/plugins/axios'
import Dialog from 'primevue/dialog'   // 🆕
import Button from 'primevue/button'   // 🆕

const router = useRouter()
const route = useRoute()

const ENDPOINT = '/usuarios'
const DEFAULT_PWD = import.meta.env.VITE_DEFAULT_PASSWORD || 'hola123'

const datos = ref({
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  rol: 'cliente',
})

const cargando = ref(false)
const error = ref<string | null>(null)

// 🆕 control del modal de éxito
const mostrarModalExito = ref(false)

async function registrarUsuario() {
  cargando.value = true
  error.value = null
  try {
    const body = {
      nombre: datos.value.nombre,
      apellidos: datos.value.apellidos,
      email: datos.value.email,
      telefono: datos.value.telefono,
      rol: datos.value.rol,
      // no mandamos clave: backend usa la default
    }

    // 1) Crear usuario
    await http.post(ENDPOINT, body)

    // 2) Login automático con la contraseña por defecto
    const { data: loginData } = await http.post('/auth/login', {
      email: body.email,
      clave: DEFAULT_PWD,
    })

    localStorage.setItem('token', loginData.access_token)

    // 3) 🆕 En lugar de redirigir de una, mostramos el modal
    mostrarModalExito.value = true
  } catch (e: any) {
    console.error(e)
    const msg = e?.response?.data?.message

    if (typeof msg === 'string' && msg.toLowerCase().includes('existe')) {
      error.value = 'Ese correo ya está registrado. Inicia sesión para continuar.'
    } else if (Array.isArray(msg)) {
      error.value = msg.join('\n')
    } else {
      error.value = msg || 'Error al registrar usuario. Intenta nuevamente.'
    }
  } finally {
    cargando.value = false
  }
}

// 🆕 función para ir al inicio cuando se cierra el modal
const irAlInicio = () => {
  mostrarModalExito.value = false
  // Si SIEMPRE quieres ir al home:
  router.push('/')
  // Si quisieras respetar un `redirect` de la URL, podrías usar:
  // const redirect = (route.query.redirect as string) || '/'
  // router.push(redirect)
}
</script>

<template>
  <section class="checkout-container">
    <div class="contenido">
      <div class="formulario">
        <h3>Crear cuenta</h3>

        <form @submit.prevent="registrarUsuario">
          <div class="campos-doble">
            <div class="campo">
              <label>Nombre</label>
              <input type="text" v-model="datos.nombre" required />
            </div>
            <div class="campo">
              <label>Apellidos</label>
              <input type="text" v-model="datos.apellidos" required />
            </div>
          </div>

          <div class="campos-doble">
            <div class="campo">
              <label>Correo electrónico</label>
              <input type="email" v-model="datos.email" required />
            </div>
            <div class="campo">
              <label>Teléfono</label>
              <input type="text" v-model="datos.telefono" required />
            </div>
          </div>

          <p v-if="error" class="error-msg">{{ error }}</p>

          <button class="btn-continuar" type="submit" :disabled="cargando">
            {{ cargando ? 'Registrando...' : 'Registrarme' }}
          </button>
        </form>

        <p class="texto">
          ¿Ya tienes cuenta?
          <RouterLink to="/login">Inicia sesión aquí</RouterLink>.
        </p>
      </div>
    </div>
  </section>

  <!-- 🆕 Modal bonito de éxito -->
  <Dialog
    v-model:visible="mostrarModalExito"
    modal
    :closable="false"
    header="¡Registro exitoso!"
    :style="{ width: '420px' }"
  >
    <div class="text-center">
      <p class="mb-2">🎉 ¡Felicidades, tu cuenta ha sido creada correctamente!</p>
      <p class="mb-4">Bienvenido(a) a <strong>SANSA</strong>. Ya puedes empezar a comprar.</p>

      <Button label="Ir al inicio" @click="irAlInicio" />
    </div>
  </Dialog>
</template>

<style scoped>
.checkout-container {
  padding: 2rem;
  background: var(--color-bg, #f3f4f6);
  min-height: 80vh;
  display: flex;
  justify-content: center;
}

.contenido {
  width: 100%;
  max-width: 800px;
}

.formulario {
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.campo {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.campos-doble {
  display: flex;
  gap: 1rem;
}

input[type='text'],
input[type='email'] {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.btn-continuar {
  margin-top: 1rem;
  background-color: #38b2ac;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
}

.btn-continuar:disabled {
  opacity: 0.7;
  cursor: default;
}

.error-msg {
  margin-top: 0.5rem;
  color: #dc2626;
  white-space: pre-line;
}
</style>
