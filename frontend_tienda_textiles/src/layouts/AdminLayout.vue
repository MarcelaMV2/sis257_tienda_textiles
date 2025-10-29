<script setup lang="ts">
import SidebarAdmin from '@/components/admin/SidebarAdmin.vue';


</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <SidebarAdmin />
    </aside>
    <main class="content">
      <header class="topbar">
        <h2>Panel de Administración</h2>
      </header>
      <section class="page">
        <router-view />
      </section>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}
.sidebar {
  border-right: 1px solid #2d3748;
  padding: 1rem;
}
.content {
  display: flex;
  flex-direction: column;
}
.topbar {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #2d3748;
}
.page {
  padding: 1.25rem;
}
</style>
