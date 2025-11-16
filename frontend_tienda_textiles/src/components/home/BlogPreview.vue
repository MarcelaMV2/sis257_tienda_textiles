<template>
  <section class="easy-buy-features py-5">
    <div class="container text-center">
      <h2 class="text-uppercase mb-5" style="color: #ff2304; font-weight: 700">
        COMPRA ONLINE FÁCILMENTE
      </h2>

      <div class="row features-grid">
        <div class="col-md-4 feature-item">
          <i class="pi pi-truck feature-icon" style="color: #ff2304"></i>
          <h3 class="feature-title">ENVÍOS A DOMICILIO</h3>
          <p class="feature-description">Recibe tu pedido en la puerta de tu casa</p>
        </div>

        <div class="col-md-4 feature-item">
          <i class="pi pi-shield feature-icon" style="color: #ff2304"></i>
          <h3 class="feature-title">COMPRA SEGURA</h3>
          <p class="feature-description">
            Resguardamos tu información y te brindamos seguimiento a tu pedido
          </p>
        </div>

        <div class="col-md-4 feature-item">
          <i class="pi pi-whatsapp feature-icon" style="color: #ff2304"></i>
          <h3 class="feature-title">ATENCIÓN AL CLIENTE</h3>
          <p class="feature-description">
            ¡Contáctanos ante cualquier duda! Nos encantaría ayudarte en tu compra
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Aquí luego agregaremos funcionalidad real
</script>

<style>
/* Estilos generales para que la estructura funcione */
.easy-buy-features {
  padding-top: 5rem; /* Ajuste del espacio superior */
  padding-bottom: 5rem; /* Ajuste del espacio inferior */
  background-color: white; /* Asumiendo fondo blanco */
}

.container {
  max-width: 1140px; /* Ancho máximo para el contenido */
  margin: 0 auto;
}

/* Estilos de la cuadrícula de características (simulando Bootstrap) */
.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 3rem; /* Espacio entre el título y los íconos */
}

.col-md-4 {
  width: 30%; /* Para que quepan 3 en una línea */
  padding: 0 15px;
  margin-bottom: 20px;
}

/* Estilos de los elementos de la característica */
.feature-item {
  text-align: center;
}

.feature-icon {
  font-size: 4rem; /* Tamaño grande para los íconos */
  display: block;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1rem;
  font-weight: 600;
  color: black; /* Texto secundario en negro */
  margin-bottom: 0.5rem;
}

.feature-description {
  font-size: 0.9rem;
  color: #333; /* Texto descriptivo en gris oscuro */
}

/* Responsividad básica (para pantallas más pequeñas) */
@media (max-width: 768px) {
  .col-md-4 {
    width: 90%; /* Los elementos se apilan en dispositivos móviles */
    margin-bottom: 30px;
  }
}

/* NOTA: Para que los íconos 'pi pi-...' funcionen, debes seguir incluyendo la librería PrimeIcons. */
</style>
