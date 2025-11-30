<template>
  <section class="instagram-gallery py-5 text-center" style="background-color: #b3d7c6">
    <div class="container">
      <h2 class="text-uppercase mb-4">Síguenos en Instagram</h2>

      <!-- Botón con flecha indicando -->
      <div class="boton-con-flecha mt-4">
        <button @click="irAInstagram">Ir a Instagram</button>
        <span class="flecha">⬅ Presiona aquí</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const irAInstagram = () => {
  // Redirige a la pagina de instagram de Sansa
  window.location.href = 'https://www.instagram.com/sansa.designsbo/'
}
</script>

<style scoped>
.instagram-gallery {
  background: var(--color-gray-light);
}

/* Contenedor del botón y flecha */
.boton-con-flecha {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

/* Botón estilizado */
.boton-con-flecha button {
  background-color: #2b6cb0;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.boton-con-flecha button:hover {
  background-color: #1a365d;
}

/* Flecha llamativa */
.flecha {
  color: #d97706;
  font-weight: bold;
  animation: parpadeo 1s infinite;
}

/* Animación para que la flecha parpadee */
@keyframes parpadeo {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
