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
  clave: '', // 🔑 añadimos la contraseña al objeto datos
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
            <input
              v-model="datos.nombre"
              type="text"
              class="form-input"
              required
              placeholder="Nombre"
            />
          </div>
          <div class="campo">
            <label class="form-label">Apellidos</label>
            <input
              v-model="datos.apellidos"
              type="text"
              class="form-input"
              required
              placeholder="Apellidos"
            />
          </div>
        </div>

        <div class="campos-doble">
          <div class="campo">
            <label class="form-label">Correo electrónico</label>
            <input
              v-model="datos.email"
              type="email"
              class="form-input"
              required
              placeholder="Correo electronico"
            />
          </div>
          <div class="campo">
            <label class="form-label">Teléfono</label>
            <input
              v-model="datos.telefono"
              type="text"
              class="form-input"
              required
              placeholder="Teléfono"
            />
          </div>
        </div>

        <div class="campos-doble">
          <div class="campo">
            <label class="form-label">Contraseña</label>
            <input
              v-model="datos.clave"
              type="password"
              class="form-input"
              required
              placeholder="Contraseña"
            />
          </div>
        </div>

        <p v-if="error" class="text-danger">{{ error }}</p>
        <input
          type="submit"
          class="form-submit"
          :value="cargando ? 'Registrando...' : 'Registrarme'"
          :disabled="cargando"
        />
      </form>

      <p class="mt-3 text-center textooo">
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
      class="modal-exito-registro"
    >
      <div class="text-center" style="padding: 1rem">
        <h2 style="color: #0b3a66; margin-bottom: 0.5rem">¡Felicidades!</h2>
        <p style="font-size: 1rem; color: #333; margin-bottom: 0.5rem">
          Tu cuenta ha sido creada correctamente.
        </p>
        <p style="font-size: 0.95rem; color: #555; margin-bottom: 1.5rem">
          Bienvenido(a) a <strong>SANSA</strong>. Ya puedes empezar a comprar.
        </p>
        <Button label="Ir al inicio" @click="irAlInicio" class="btn-exito" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.full-screen-container {
  background: linear-gradient(135deg, #0b1f3a, #1a3d6b);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: flex-start; /* NO SE TOCA */
  padding-top: 60px;
}

/* FORMULARIO */
.form {
  margin: 1.5rem auto;         /* ESTO ES LO QUE TE CENTRA */
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 25%;                  /* NO SE TOCA */
  min-width: 500px;            /* NO SE TOCA */
  max-width: 100%;

  background: #ffffffee;
  border-radius: 15px;
  padding: 40px;

  border: 3px solid #fabf13;   /* Amarillito elegante */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}
.form h1 {
  color: #1a365d !important; /* azul oscuro */
  padding: 10px 20px;
  border-radius: 12px;
  text-align: center;
  margin: 0 auto 1.5rem auto;
  width: fit-content;
  font-weight: 700;
}

.form-label {
  margin-bottom: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748; /* gris oscuro profesional */
}

/* INPUT elegante */
.form-input {
  padding: 12px 14px;
  border: 1.5px solid #d0d7e2;
  border-radius: 10px;
  background: #ffffff;
  color: #1a202c;
  font-size: 0.95rem;
  transition: all 0.25s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

.form-input:focus {
  border-color: #2b6cb0;
  box-shadow: 0 0 0 3px rgba(43,108,176,0.15);
  outline: none;
  background: #ffffff;
}

/* BOTÓN */
.form-submit {
  background: #2b6cb0;
  border: none;
  border-radius: 10px;
  color: white;
  margin-top: 2rem;
  padding: 1rem 0;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.1rem;
  transition: 0.2s;
}

.form-submit:hover {
  background: #1a365d;
}

.form-submit:disabled {
  opacity: 0.6;
}

/* CAMPOS DOBLES */
.campos-doble {
  display: flex;
  gap: 1rem;
}

.campo {
  flex: 1;
}

/* BOTÓN MODAL */
.btn-exito {
  background-color: #fabf13 !important;
  color: #1a202c !important;
  border: none !important;
  padding: 0.8rem !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
  width: 100%;
  transition: 0.2s;
}

.btn-exito:hover {
  background-color: #d9a50c !important;
}
.textooo {
  color: #eff1f4;
}

p a:hover {
  color: #1a365d;
}
/* ===============================
   MODAL DE ÉXITO — SANSA THEME
   (Totalmente aislado)
================================*/

.modal-exito-registro .p-dialog-mask {
  background: rgba(0,0,0,0.45) !important;
  backdrop-filter: blur(3px);
}

/* Contenedor */
.modal-exito-registro .p-dialog {
  background: #ffffff !important;
  border-radius: 16px !important;
  box-shadow: 0px 8px 30px rgba(0,0,0,0.35) !important;
  overflow: hidden;
}

/* Header */
.modal-exito-registro .p-dialog-header {
  background: #1a365d !important; /* azul oscuro */
  color: #ffffff !important;
  font-weight: 700 !important;
  font-size: 1.2rem !important;
  border-bottom: 4px solid #f6c947 !important; /* amarillo */
  padding: 1rem 1.5rem !important;
}

/* Contenido */
.modal-exito-registro .p-dialog-content {
  background: #ffffff !important;
  color: #1a202c !important;
  padding: 1.8rem !important;
  text-align: center;
}

/* Botones */
.modal-exito-registro .btn-exito {
  background-color: #f6c947 !important; /* amarillo */
  color: #1a202c !important;
  border: none !important;
  padding: 0.8rem !important;
  border-radius: 10px !important;
  width: 100%;
  font-weight: 700 !important;
  transition: 0.2s;
}

.modal-exito-registro .btn-exito:hover {
  background-color: #e4b93b !important;
}

/* Cerrar “X” (si algún día agregas closable=true) */
.modal-exito-registro .p-dialog-close-button {
  color: #f6c947 !important;
}

</style>

<style>
/* ===========================================
   FIX DEFINITIVO PARA FONDO NEGRO PRIMEVUE
=========================================== */

/* Contenedor principal del modal */
.modal-exito-registro .p-dialog {
  background: #ffffff !important;
  border-radius: 16px !important;
}

/* El contenido interno que PrimeVue genera dinámicamente */
.modal-exito-registro .p-dialog-content {
  background: #ffffff !important;
}

/* El SEGUNDO layer interno (la razón de tu problema) */
.modal-exito-registro .p-dialog-content > div {
  background: #ffffff !important;
}

/* Asegurar que no queden restos del tema oscuro */
.modal-exito-registro .p-dialog .p-component {
  background: #ffffff !important;
}

/* Asegurar que cualquier texto no quede oscuro */
.modal-exito-registro .p-dialog-content * {
  color: #1a202c !important;
}
</style>

