<script setup lang="ts">
const services = [
  {
    icon: '🚚',
    title: 'Envíos gratis',
    text: 'En compras mayores a Bs. 300',
  },
  {
    icon: '🧵',
    title: 'Hecho a mano',
    text: 'Productos creados por artesanos locales',
  },
  {
    icon: '💳',
    title: 'Pago seguro',
    text: 'Aceptamos tarjetas y QR Simple',
  },
  {
    icon: '🔁',
    title: 'Cambios garantizados',
    text: 'Hasta 7 días después de la compra',
  },
]
</script>

<template>
  <div class="contenedor">
    <section class="services py-5">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-3" v-for="(s, i) in services" :key="i">
            <div class="service-box p-3">
              <div class="icon fs-1 mb-3">{{ s.icon }}</div>
              <h4 class="fw-semibold">{{ s.title }}</h4>
              <p class="text-muted">{{ s.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contenedor {
  background-color: #fee3fe;
}
.service-box {
  background: var(--color-white);
  border-radius: 1rem;
  transition: all 0.3s;
}
.service-box:hover {
  background: var(--color-primary-light);
  transform: translateY(-5px);
}
</style>
