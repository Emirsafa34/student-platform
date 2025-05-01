<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/">
        <img
          class="logo"
          src="https://cdn-icons-png.flaticon.com/512/1055/1055644.png"
          alt="Logo"
        />
      </router-link>
      <span class="site-name">Ceng Rehber</span>
    </div>

    <div class="navbar-center">
      <router-link to="/">Anasayfa</router-link>
      <span class="divider">|</span>
      <router-link to="/courses">Dersler</router-link>
      <span class="divider">|</span>
      <router-link to="/qas">Soru-Cevap</router-link>
    </div>

    <div class="navbar-right">
      <template v-if="authStore.isAuthenticated">
        <span class="user-info">👤 {{ authStore.user.username }}</span>
        <button @click="logout">Çıkış</button>
      </template>
      <template v-else>
        <router-link to="/login" class="nav-icon" title="Giriş Yap">🔐</router-link>
        <router-link to="/register" class="nav-icon" title="Kayıt Ol">📝</router-link>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

function logout() {
  authStore.logout();
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
.navbar-left,
.navbar-center,
.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logo {
  width: 32px;
  height: 32px;
}
.divider {
  margin: 0 0.5rem;
}
.nav-icon {
  font-size: 1.2rem;
}
button {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
