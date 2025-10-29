<script setup lang="ts">
import { RouterView } from 'vue-router';
import MainFooter from './components/MainFooter.vue';
import MainHeader from './components/MainHeader.vue';
/* import MainFooter from './components/MainFooter.vue' */
</script>

<template>
  <MainHeader />
  <RouterView />

  <MainFooter />
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

