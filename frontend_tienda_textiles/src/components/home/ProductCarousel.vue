<script setup lang="ts">
import { ref } from 'vue'

const productos = ref([
  { nombre: 'Poncho andino', precio: 120, imagen: 'product-item1.jpg' },
  { nombre: 'Bufanda de alpaca', precio: 80, imagen: 'product-item2.jpg' },
  { nombre: 'Manta color tierra', precio: 150, imagen: 'product-item3.jpg' },
])

function getImageUrl(nombreArchivo: string) {
  return new URL(`@/assets/images/${nombreArchivo}`, import.meta.url).href
}
</script>

<template>
  <section class="products py-5" style="display: none;">
    <div class="container">
      <h2 class="text-center text-dark mb-4 text-uppercase">Productos destacados</h2>
      <div class="row">
        <div class="col-md-4 mb-4" v-for="(p, i) in productos" :key="i">
          <div class="card shadow-sm border-0 rounded-4 h-100">
            <img
              :src="getImageUrl(p.imagen)"
              class="card-img-top"
              alt="producto"
            />
            <div class="card-body text-center">
              <h5 class="card-title">{{ p.nombre }}</h5>
              <p class="text-primary fs-5 fw-bold">Bs. {{ p.precio }}</p>
              <button class="btn btn-outline-dark btn-sm">Añadir al carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
