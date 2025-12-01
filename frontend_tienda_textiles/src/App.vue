<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import MainFooter from './components/MainFooter.vue'
import MainHeader from './components/MainHeader.vue'

const route = useRoute()
const hideLayout = computed(() => {
  const noLayoutNames = ['login', 'register']
  return route.path.startsWith('/admin') || noLayoutNames.includes(route.name as string)
})
</script>

<template>
  <MainHeader v-if="!hideLayout" />
  <RouterView />
  <MainFooter v-if="!hideLayout" />
</template>

<!-- <style>
/* @import '@/assets/css/bootstrap.min.css';
@import '@/assets/css/style.css';
/* @import '@/assets/css/vendor.css'; */ -->
<style>
/* Que el header quede fijo arriba y el contenido no se esconda detrás */
header {
  position: sticky;
  top: 0;
  z-index: 1000;
}
</style>
