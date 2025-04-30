<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style scoped>
/* #app tüm sayfayı kapsasın ve CSS Variable’ları kullansın */
#app {
  min-height: 100vh;
  background-color: var(--color-bg);
  color: var(--color-text);
  display: flex;
  flex-direction: column;
}

/* main-content artık beyaz sabit arka plan tanımlamıyor;
   boşluk ve üst marj CSS Variable’larla sağlanıyor */
.main-content {
  margin-top: var(--navbar-height);
  padding: var(--spacing);
  flex: 1;
  overflow-y: auto;
}
</style>
