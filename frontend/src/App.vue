<template>
  <div id="app">
    <!-- Navbar'ı sadece login ve register sayfaları dışında göster -->
    <Navbar v-if="showNavbar" />

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';

const route = useRoute();

// Login ve Register sayfalarında navbar gizli olsun
const showNavbar = computed(() =>
  !['/login', '/register'].includes(route.path)
);
</script>

<style>
/* Global reset, layout vs. hepsi style.css’e taşındı */
</style>
