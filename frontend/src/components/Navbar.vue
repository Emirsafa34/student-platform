<template>
  <nav class="navbar">
    <router-link v-if="isLoggedIn && !isAuthPage" to="/dashboard">Anasayfa</router-link>
    <router-link v-if="isLoggedIn && !isAuthPage" to="/courses">Dersler</router-link>
    <router-link v-if="isLoggedIn && !isAuthPage" to="/qas">Soru-Cevap</router-link>

    <div v-if="isLoggedIn && !isAuthPage" class="user-section">
      <span class="username">👤 {{ username }}</span>
      <button @click="logout">Çıkış</button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route  = useRoute();

const isLoggedIn = computed(() => !!localStorage.getItem('token'));
const isAuthPage = computed(() => ['/login','/register'].includes(route.path));
const username   = computed(() => localStorage.getItem('username') || '');

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
  padding: 0.75rem 1rem;
  background: var(--color-primary);
}
.user-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.username {
  color: #fff;
  font-weight: 500;
}
.navbar a, .navbar button {
  color: #fff;
  text-decoration: none;
}
.navbar button {
  background: #ef4444;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius);
  cursor: pointer;
}
</style>
