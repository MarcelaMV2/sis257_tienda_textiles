<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { Button } from 'primevue'
import { ref, onMounted } from 'vue'
import { getTokenFromLocalStorage, parseJwt } from '@/helpers'

const router = useRouter()
const route = useRoute()
const nombreUsuario = ref('')
const rolUsuario = ref('')

function isActive(path: string) {
  return route.path.startsWith(path)
}

onMounted(() => {
  const token = getTokenFromLocalStorage()

  if (token) {
    const decoded = parseJwt(token)

    const nombre = decoded?.nombre || ''
    const apellidos = decoded?.apellidos || ''
    const nombreCompleto = `${nombre} ${apellidos}`.trim()

    nombreUsuario.value = nombreCompleto || decoded?.email?.split('@')[0] || 'Usuario'

    rolUsuario.value = decoded?.rol || 'admin'
  }
})

function cerrarSesion() {
  // Limpiar el localStorage
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  // Redirigir al login
  router.push('/login')
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
    <Button
      label="Departamentos"
      icon="pi pi-map"
      class="w-full mb-2"
      :outlined="!isActive('/admin/departamentos')"
      @click="router.push('/admin/departamentos')"
    />
    <Button
      label="Proveedores"
      icon="pi pi-truck"
      class="w-full mb-2"
      :outlined="!isActive('/admin/proveedores')"
      @click="router.push('/admin/proveedores')"
    />
    <Button
      label="Compras"
      icon="pi pi-shopping-bag"
      class="w-full mb-2"
      :outlined="!isActive('/admin/compras')"
      @click="router.push('/admin/compras')"
    />
    <Button
      label="Usuarios"
      icon="pi pi-user"
      class="w-full mb-2"
      :outlined="!isActive('/admin/usuarios')"
      @click="router.push('/admin/usuarios')"
    />
    <!-- Separador visual -->
    <div class="separador"></div>

    <div class="user-info">
      <div class="user-name">{{ nombreUsuario }}</div>
      <div class="user-role">{{ rolUsuario }}</div>
    </div>

    <!-- Botón de cerrar sesión -->
    <button class="btn-logout" @click="cerrarSesion">
      <span class="pi pi-sign-out"></span>
      <span> Cerrar Sesión</span>
    </button>
  </nav>
</template>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  background: linear-gradient(180deg, #fabf13 0%, #f59e0b 100%);
  padding: 20px;
  border-radius: 12px;
}

.menu h3 {
  color: #1a202c;
  font-weight: 700;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.menu :deep(.p-button) {
  justify-content: flex-start;
  gap: 0.75rem;
  background: transparent;
  border: none;
  color: #1a202c;
  font-weight: 600;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.menu :deep(.p-button:hover) {
  background: rgba(26, 32, 44, 0.1);
  transform: translateX(4px);
}

/* Botón activo (no outlined) */
.menu :deep(.p-button:not(.p-button-outlined)) {
  background: #2d3748;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.menu :deep(.p-button:not(.p-button-outlined):hover) {
  background: #1a202c;
  transform: translateX(0);
}

.separador {
  height: 2px;
  background: rgba(26, 32, 44, 0.2);
  margin-top: auto;
  margin-bottom: 20px;
}

.user-info {
  padding: 16px;
  background: rgba(45, 55, 72, 0.9);
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.user-name {
  font-weight: 700;
  color: white;
  font-size: 0.938rem;
  margin-bottom: 4px;
}

.user-role {
  font-size: 0.813rem;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.btn-logout {
  padding: 10px;
  border-radius: 10px;
  margin-top: 0;
  background: transparent !important;
  border: 2px solid #dc2626 !important;
  color: #dc2626 !important;
  font-weight: 600;
}

.btn-logout:hover {
  background-color: #dc2626 !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.btn-logout :deep(.p-button-icon) {
  color: inherit;
}
.menu :deep(.p-button:hover) {
  background: #a5f3fc; /* Celeste sólido */
  transform: translateX(4px);
}

.menu :deep(.p-button-outlined:hover) {
  background: #a5f3fc !important;
  border-color: transparent !important;
  color: #1a202c !important;
}
</style>
