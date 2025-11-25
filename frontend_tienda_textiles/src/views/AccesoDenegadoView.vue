<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function volverInicio() {
  router.push('/')
}
</script>

<template>
  <div class="acceso-denegado">
    <div class="contenedor">
      <div class="icono">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>

      <h1>Acceso Denegado</h1>
      <p class="mensaje">
        Esta sección es exclusiva para administradores. Tu cuenta actual no tiene los permisos
        necesarios para acceder al panel de administración.
      </p>
      <p class="submensaje">
        Si crees que deberías tener acceso, contacta con el administrador del sistema.
      </p>

      <div class="acciones">
        <button @click="volverInicio" class="btn-primario">Volver al Inicio</button>
        <router-link to="/mis-pedidos" class="btn-secundario"> Ver Mis Pedidos </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.acceso-denegado {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.contenedor {
  background: white;
  padding: 48px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.icono {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  color: #ef4444;
}

.icono svg {
  width: 100%;
  height: 100%;
}

h1 {
  color: #1f2937;
  font-size: 2rem;
  margin-bottom: 16px;
  font-weight: 700;
}

.mensaje {
  color: #6b7280;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 12px;
}

.submensaje {
  color: #9ca3af;
  font-size: 0.938rem;
  margin-bottom: 32px;
}

.acciones {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primario {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primario:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.btn-secundario {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-secundario:hover {
  background: #f0f4ff;
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .contenedor {
    padding: 32px 24px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .mensaje {
    font-size: 1rem;
  }

  .acciones {
    flex-direction: column;
  }

  .btn-primario,
  .btn-secundario {
    width: 100%;
  }
}
</style>
