<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const pedido = JSON.parse(localStorage.getItem('pedidoConfirmado') || '{}')
</script>

<template>
  <div class="container text-center py-5">
    <img
      src="@/assets/images/insta-item2.jpg"
      alt="Gracias"
      style="width: 150px; margin-bottom: 1rem;"
    />
    <h3>¡Gracias por tu compra!</h3>
    <p class="text-muted mb-4">
      Tu pedido ha sido recibido correctamente.
      <br />En breve te enviaremos un correo de confirmación.
    </p>

    <div class="card p-3 mx-auto" style="max-width: 500px;">
      <p><b>Total:</b> Bs. {{ pedido.total }}</p>
      <p><b>Fecha:</b> {{ new Date(pedido.fecha).toLocaleString() }}</p>
      <p><b>Método de pago:</b> {{ pedido.envio?.metodoPago }}</p>
    </div>

    <button class="btn btn-primary mt-4" @click="router.push('/')">
      Volver al inicio
    </button>
  </div>
</template>
