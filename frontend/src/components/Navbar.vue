<template>
  <nav class="navbar">
    <!-- Sadece giriş yapmış kullanıcılar görebilsin -->
    <router-link v-if="isLoggedIn" to="/dashboard">Anasayfa</router-link>
    <router-link v-if="isLoggedIn" to="/courses">Dersler</router-link>
    <router-link v-if="isLoggedIn" to="/qas">Soru-Cevap</router-link>
    <button v-if="isLoggedIn" @click="logout">Çıkış</button>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Giriş yapılmış mı kontrolü
const isLoggedIn = computed(() => !!localStorage.getItem('token'));

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  router.push('/login');
}
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
