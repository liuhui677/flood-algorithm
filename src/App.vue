<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const currentTitle = computed(() => (route.meta.title as string) || '')
</script>

<template>
  <div class="app-wrapper">
    <nav class="nav-bar">
      <div class="nav-title">Flood Algorithm</div>
      <div class="nav-links">
        <RouterLink to="/scan-line" class="nav-link" active-class="active">
          扫描线查找封闭图形
        </RouterLink>
        <RouterLink to="/variable-compilation" class="nav-link" active-class="active">
          变量编译（字符串→函数）
        </RouterLink>
      </div>
      <div class="nav-current">{{ currentTitle }}</div>
    </nav>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
:global(html),
:global(body),
:global(#app) {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
.app-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.nav-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 20px;
  height: 48px;
  background: #1f2937;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}
.nav-title {
  font-weight: 700;
  font-size: 16px;
  color: #fbbf24;
}
.nav-links {
  display: flex;
  gap: 16px;
}
.nav-link {
  color: #d1d5db;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;
}
.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}
.nav-link.active {
  color: #fff;
  background: #3b82f6;
}
.nav-current {
  margin-left: auto;
  font-size: 13px;
  color: #9ca3af;
}
.app-main {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
}
</style>
