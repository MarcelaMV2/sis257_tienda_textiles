<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import http from '@/plugins/axios'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const router = useRouter()
const route = useRoute()

const ENDPOINT = '/usuarios'

const datos = ref({
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  rol: 'cliente',
  clave: '' // 🔑 añadimos la contraseña al objeto datos
})

const cargando = ref(false)
const error = ref<string | null>(null)
const mostrarModalExito = ref(false)

async function registrarUsuario() {
  cargando.value = true
  error.value = null
  try {
    const body = { ...datos.value }
    await http.post(ENDPOINT, body)


    // 🔑 Usamos la contraseña que el usuario escribió
    const { data: loginData } = await http.post('/auth/login', {
      email: body.email,
      clave: body.clave,
    })

    localStorage.setItem('token', loginData.access_token)
    mostrarModalExito.value = true
  } catch (e: any) {
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

const irAlInicio = () => {
  mostrarModalExito.value = false
  router.push('/')
}
</script>


<template>
  <div class="full-screen-container">
    <div class="container my-5 pt-5">

      <form class="form" @submit.prevent="registrarUsuario">
        <h1 class="text-center" style="color: white">Crear Cuenta</h1>
        <div class="campos-doble">
          <div class="campo">
            <label class="form-label">Nombre</label>
            <input v-model="datos.nombre" type="text" class="form-input" required
            placeholder="Nombre" />
          </div>
          <div class="campo">
            <label class="form-label">Apellidos</label>
            <input v-model="datos.apellidos" type="text" class="form-input" required
            placeholder="Apellidos"/>
          </div>
        </div>

        <div class="campos-doble">
          <div class="campo">
            <label class="form-label">Correo electrónico</label>
            <input v-model="datos.email" type="email" class="form-input" required
            placeholder="Correo electronico"/>
          </div>
          <div class="campo">
            <label class="form-label">Teléfono</label>
            <input v-model="datos.telefono" type="text" class="form-input" required
            placeholder="Teléfono" />
          </div>
        </div>

        <div class="campos-doble">
          <div class="campo">
            <label class="form-label">Contraseña</label>
            <input v-model="datos.clave" type="password" class="form-input" required
            placeholder="Contraseña" />
          </div>
        </div>

        <p v-if="error" class="text-danger">{{ error }}</p>
        <input type="submit" class="form-submit" :value="cargando ? 'Registrando...' : 'Registrarme'" :disabled="cargando" />
      </form>


      <p class="mt-3 text-center">
        ¿Ya tienes cuenta?
        <RouterLink to="/login" class="text-primary fw-semibold"> Inicia sesión aquí </RouterLink>
      </p>
    </div>

    <!-- Modal de éxito -->

    <Dialog
  v-model:visible="mostrarModalExito"
  modal
  :closable="false"
  header="¡Registro exitoso!"
  :style="{ width: '420px', borderRadius: '12px' }"
>
  <div class="text-center" style="padding: 1rem">

    <h2 style="color: #0b3a66; margin-bottom: 0.5rem">¡Felicidades!</h2>
    <p style="font-size: 1rem; color: #333; margin-bottom: 0.5rem">
      Tu cuenta ha sido creada correctamente.
    </p>
    <p style="font-size: 0.95rem; color: #555; margin-bottom: 1.5rem">
      Bienvenido(a) a <strong>SANSA</strong>. Ya puedes empezar a comprar.
    </p>
    <Button
    label="Ir al inicio"
  @click="irAlInicio"
  class="btn-exito"/>

  </div>
</Dialog>

  </div>

</template>

<style scoped>


.full-screen-container {
  background-image: url('@/assets/images/fondologin.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  padding-top: 30px;
  background-color: #333333;
}

.form {
  margin: 1.5rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 25%;
  min-width: 500px;
  max-width: 100%;
  background: #0b3a66;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.form-label {
  margin-top: 1rem;
  color: white;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 10px 15px;
  background-color: #c7daf1;
  border: none;
  border-radius: 20px;
  color: black;
}

.form-submit {
  background: #ee5007;
  border: none;
  border-radius: 5rem;
  color: white;
  margin-top: 2rem;
  padding: 1rem 0;
  cursor: pointer;
  transition: background 0.2s;
}

.form-submit:disabled {
  opacity: 0.7;
  cursor: default;
}

.campos-doble {
  display: flex;
  gap: 1rem;
}

.campo {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.btn-exito {
  background-color: rgb(0, 0, 92) !important;
  border: none !important;
  color: white !important;
  font-weight: 600;
  box-shadow: 0 3px 6px rgba(0,0,0,0.2);
}
.btn-exito:hover {
  background-color: #050033 !important;
}

</style>
