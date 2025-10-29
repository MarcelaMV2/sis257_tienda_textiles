<script setup lang="ts">
import { usarCarrito } from '@/funciones/UsarCarrito'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/plugins/axios'

const { carrito, totalCarrito } = usarCarrito()
const router = useRouter()

const ENDPOINT = 'usuarios'

const usuarioLogueado = ref(false)
const usuario = ref<any>(null)

const datos = ref({
  nombre: '',
  apellidos: '',
  email: '',
  password: '',
  rol: 'cliente',
})

const subtotal = computed(() => totalCarrito().toFixed(2))

// 🔹 Si ya está logueado, ir directo al paso de envío
onMounted(() => {
  const usuarioGuardado = localStorage.getItem('usuario')
  if (usuarioGuardado) {
    usuario.value = JSON.parse(usuarioGuardado)
    usuarioLogueado.value = true
    router.push('/checkout/envio')
  }
})

// 🔹 Registrar usuario (estilo “docente”)
async function registrarUsuario() {
  try {
    const body = {
      nombre: datos.value.nombre,
      apellidos: datos.value.apellidos,
      email: datos.value.email,
      password: datos.value.password,
      rol: datos.value.rol,
    }

    console.log('body enviado:', body)
    const { data } = await http.post(ENDPOINT, body)

    alert('Usuario registrado correctamente.')
    localStorage.setItem('usuario', JSON.stringify(data))
    /* router.push('/checkout/envio') */
  } catch (error: any) {
    // 💬 Manejo del error de correo duplicado
    if (error?.response?.data?.message?.includes('correo')) {
      alert('El correo ya está registrado. Inicia sesión para continuar.')
      router.push('/login')
    } else {
      alert(error?.response?.data?.message || 'Error al registrar usuario.')
    }
  }
}
</script>

<template>
  <section class="checkout-container">
    <div class="contenido">
      <!-- FORMULARIO -->
      <div class="formulario">
        <h3>1. Identificación</h3>

        <div v-if="usuarioLogueado" class="alert alert-success mb-3">
          Bienvenido, {{ usuario.nombre }}. Redirigiéndote a la página de envío...
        </div>

        <div v-else>
          <p class="texto">Si ya tienes cuenta, <a href="/login">inicia sesión aquí</a>.</p>

          <form @submit.prevent="registrarUsuario">
            <div class="campo">
              <label>Correo electrónico</label>
              <input type="email" v-model="datos.email" required />
            </div>

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

            <div class="campo">
              <label>Contraseña</label>
              <input type="password" v-model="datos.password" required />
            </div>

            <button class="btn-continuar" type="submit">Registrarme y continuar</button>
          </form>
        </div>
      </div>

      <!-- RESUMEN -->
      <aside class="resumen">
        <h3>Resumen del pedido</h3>
        <div v-for="item in carrito" :key="item.producto.id" class="item-resumen">
          <img :src="item.producto.imagenUrl" />
          <div class="info">
            <p>{{ item.producto.nombre }}</p>
            <small>Cant: {{ item.cantidad }}</small>
          </div>
          <span class="precio"> Bs. {{ (item.producto.precio * item.cantidad).toFixed(2) }} </span>
        </div>

        <hr />
        <div class="totales">
          <p>
            Subtotal: <span>Bs. {{ subtotal }}</span>
          </p>
          <p>Envío: <span class="envio">Gratis</span></p>
          <h4>
            Total: <span>Bs. {{ subtotal }}</span>
          </h4>
        </div>

        <router-link to="/carrito" class="volver">Volver al carrito</router-link>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.checkout-container {
  padding: 2rem;
  background: var(--color-bg);
  min-height: 80vh;
}
.contenido {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}
.formulario {
  background: white;
  padding: 2rem;
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
input[type='email'],
input[type='password'] {
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
}
.resumen {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
.item-resumen {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.item-resumen img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
}
.precio {
  font-weight: 600;
}
.envio {
  color: green;
}
.volver {
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-primary);
  text-decoration: underline;
}
</style>
