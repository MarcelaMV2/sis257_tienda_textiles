<template>
  <RouterLink
    class="category-card d-block position-relative rounded-3 overflow-hidden"
    :to="{ name: 'shop', query: { category: slug } }"
  >
    <img :src="image" :alt="name" class="w-100 h-100 object-fit-cover" />
    <div class="category-overlay d-flex flex-column justify-content-end p-3">
      <h3 class="text-white fw-semibold mb-2">{{ name }}</h3>
      <button class="btn btn-light btn-sm align-self-start">Ver productos</button>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  slug: string
  image: string // ruta pública, p.ej. /images/categories/bolsos.jpg
}>()
</script>

<style scoped>
.category-card {
  aspect-ratio: 4 / 3;
}
.category-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.55) 100%);
  color: #fff;
  opacity: 0.95;
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}
.category-card:hover .category-overlay {
  transform: scale(1.02);
  opacity: 1;
}
.object-fit-cover {
  object-fit: cover;
}
</style>
