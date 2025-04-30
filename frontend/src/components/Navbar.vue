<template>
  <nav v-if="!isAuthPage" class="navbar">
    <div class="navbar-left">
      <img class="logo" src="https://cdn-icons-png.flaticon.com/512/1055/1055644.png" alt="Logo" />
      <span class="site-name">Ceng Rehber</span>
    </div>
    <div class="navbar-center">
      <router-link to="/dashboard">Anasayfa</router-link>
      <span class="divider">|</span>
      <router-link to="/courses">Dersler</router-link>
      <span class="divider">|</span>
      <router-link to="/qas">Soru-Cevap</router-link>
    </div>
    <div class="navbar-right" v-if="isLoggedIn">
      <span class="user-info">👤 {{ username }}</span>
      <button @click="logout">Çıkış</button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isLoggedIn = computed(() => !!localStorage.getItem('token'));
const username = computed(() => localStorage.getItem('username') || 'Kullanıcı');

// Login veya Register sayfasında mıyız?
const isAuthPage = computed(() =>
  route.path === '/login' || route.path === '/register'
);

function logout() {
  localStorage.clear();
  router.push('/login');
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4f46e5;
  color: white;
  padding: 0.75rem 1rem;
  flex-wrap: wrap;
}
.navbar-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logo {
  width: 32px;
  height: 32px;
}
.site-name {
  font-size: 1.2rem;
  font-weight: bold;
}
.navbar-center {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.divider {
  color: #ccc;
}
.navbar a {
  color: white;
  text-decoration: none;
}
.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.user-info {
  font-weight: bold;
}
button {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .navbar-center {
    flex-wrap: wrap;
  }
}
</style>
