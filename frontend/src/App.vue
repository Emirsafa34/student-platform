<script setup>
// Mevcut component importları
import HelloWorld from './components/HelloWorld.vue'

// API importu
import api from './api';

// Bir butona basıldığında çalışacak fonksiyon:
const denemeIstek = async () => {
  try {
    // Burada public bir endpoint'e GET isteği atıyoruz
    const response = await api.get('/');
    console.log('Gelen veri:', response.data); // Gelen mesajı console'a yaz
  } catch (error) {
    console.error('İstek Hatası:', error.response?.data?.message || error.message);
  }
};
</script>

<template>
  <div>
    <!-- API Test Butonu -->
    <div style="padding: 10px; text-align: center;">
      <h1>Student Platform - API Test</h1>
      <button @click="denemeIstek">Veri Çek</button>
    </div>

    <!-- Normal router sistemin -->
    <router-view />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
