<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps<{
  color: { clave: string; valor: string }
}>()
</script>

<template>
  <li :style="{ color: props.color.clave }">{{ props.color.valor }}</li>
</template>

<style scoped></style>
