// src/components/Navbar.vue

<template>
  <nav class="navbar">
    <router-link to="/dashboard">Anasayfa</router-link>
    <router-link to="/courses">Dersler</router-link>
    <router-link to="/qas">Soru-Cevap</router-link>
    <button @click="logout">Çıkış</button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 20px;
  background-color: #2c3e50;
  color: white;
}

.navbar a {
  color: white;
  text-decoration: none;
  margin: 0 10px;
}

.navbar button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
