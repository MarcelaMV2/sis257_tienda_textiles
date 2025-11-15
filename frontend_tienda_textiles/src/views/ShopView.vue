<template>
  <section class="py-4">
    <div class="container">
      <div class="d-flex align-items-center gap-2 mb-3">
        <h3 class="mb-0">Tienda</h3>
        <span v-if="selectedCategory" class="badge bg-primary">
          {{ selectedCategory }}
        </span>
        <button v-if="selectedCategory" class="btn btn-link btn-sm" @click="clearCategory">
          limpiar
        </button>
      </div>

      <div class="row g-4">
        <div class="col-6 col-md-4 col-xl-3" v-for="p in visibleProducts" :key="p.id">
          <div class="card h-100 shadow-sm border-0">
            <img :src="`/images/${p.image}`" class="card-img-top" :alt="p.name" />
            <div class="card-body">
              <h6 class="fw-semibold mb-1">{{ p.name }}</h6>
              <small class="text-muted d-block mb-2">{{ p.category }}</small>
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-success fw-bold">Bs. {{ p.price }}</span>
                <button class="btn btn-outline-primary btn-sm">Añadir</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="visibleProducts.length === 0" class="col-12 text-center text-muted py-5">
          No hay productos para esta categoría.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Demo local; reemplaza por fetch a tu API.
const products = [
  { id: 1, name: 'Poncho andino', category: 'calzado-hombre', image: 'poncho.jpg', price: 120 },
  { id: 2, name: 'Bufanda alpaca', category: 'ballerinas', image: 'bufanda.jpg', price: 80 },
  { id: 3, name: 'Manta color tierra', category: 'bolsos', image: 'manta.jpg', price: 150 },
  // …
]

const selectedCategory = computed(() => (route.query.category as string) || '')

const visibleProducts = computed(() => {
  if (!selectedCategory.value) return products
  return products.filter((p) => p.category === selectedCategory.value)
})

function clearCategory() {
  router.push({ name: 'shop', query: {} })
}
</script>
