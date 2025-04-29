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

<style>
/* --- Reset & Temel Ayarlar --- */
* {
  box-sizing: border-box;
}
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  background: #f5f5f5;   /* sayfa arka planı */
  color: #333;            /* metin rengi */
  font-family: Arial, sans-serif;
}

/* --- Navbar Sabitleme --- */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

/* --- Ana İçerik --- */
.main-content {
  margin-top: 60px;       /* navbar yüksekliği kadar boşluk */
  padding: 20px;
  min-height: calc(100vh - 60px);
  overflow-y: auto;
  background: #ffffff;    /* içerik kutusu arka planı */
}

/* --- Link & Başlık Stilleri --- */
a {
  color: #2c3e50;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
h1, h2, h3, h4, h5 {
  color: #2c3e50;
  margin-bottom: 0.5em;
}
</style>
