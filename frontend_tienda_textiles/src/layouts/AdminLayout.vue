<script setup lang="ts">
import SidebarAdmin from '@/components/admin/SidebarAdmin.vue'
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <SidebarAdmin />
    </aside>
    <main class="content">
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
  max-height: 100vh;
  overflow: hidden;
}

.sidebar {
  border-right: 1px solid #e5e7eb;
  padding: 1rem;
  height: 100vh;
  overflow-y: auto;
  position: sticky;
  top: 0;
  background: #ffffff;
}

.content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  background: #f8f9fa;
}

.page {
  padding: 0;
  flex: 1;
}
</style>
