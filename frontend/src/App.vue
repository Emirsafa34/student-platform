<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- Navbar'ı sadece login ve register sayfaları dışında göster -->
    <Navbar v-if="showNavbar" />

    <main class="main-content">
      <router-view />
    </main>

    <!-- Her sayfada alt kısımda Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

const route = useRoute();

// Login ve Register sayfalarında navbar gizli olsun
const showNavbar = computed(() =>
  !['/login', '/register'].includes(route.path)
);
</script>

<style>
/* Uygulamanın tamamını kapsayacak şekilde flex düzeni kuruyoruz */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ekran yüksekliğinin tamamı kadar */
}

/* Router-view içeriği büyüyüp kalan alanı kaplasın */
.main-content {
  flex: 1;
  /* İstersen padding veya background burada ayarlanır */
}

/* Eğer global olarak html, body yükseklikleri ayarlı değilse: */
/* html, body, #app { height: 100%; margin: 0; padding: 0; } */
</style>
