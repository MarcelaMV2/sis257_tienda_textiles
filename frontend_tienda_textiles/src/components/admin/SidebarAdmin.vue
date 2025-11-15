<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { Button } from 'primevue'
const router = useRouter()
const route = useRoute()

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="menu">
    <h3 class="mb-3">Administración</h3>

    <Button
      label="Productos"
      icon="pi pi-box"
      class="w-full mb-2"
      :outlined="!isActive('/admin/productos')"
      @click="router.push('/admin/productos')"
    />
    <Button
      label="Categorías"
      icon="pi pi-tags"
      class="w-full mb-2"
      :outlined="!isActive('/admin/categorias')"
      @click="router.push('/admin/categorias')"
    />
    <Button
      label="Pedidos"
      icon="pi pi-shopping-cart"
      class="w-full mb-2"
      :outlined="!isActive('/admin/pedidos')"
      @click="router.push('/admin/pedidos')"
    />
    <Button
      label="Pagos"
      icon="pi pi-credit-card"
      class="w-full mb-2"
      :outlined="!isActive('/admin/pagos')"
      @click="router.push('/admin/pagos')"
    />
  </nav>
</template>

<style scoped>
.menu :deep(.p-button) {
  justify-content: flex-start;
  gap: 0.5rem;
}
</style>
