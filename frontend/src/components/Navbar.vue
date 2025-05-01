<template>
  <nav class="navbar animate-fadeIn">
    <div class="navbar-left">
      <router-link to="/">
        <img class="logo" src="http://ceng1.cumhuriyet.edu.tr/images/logo2.png" alt="Logo" />
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
  background-color: var(--color-primary);
  color: var(--color-light);
  padding: 0.75rem 1rem;
}
.navbar a {
  color: var(--color-light);
  transition: color var(--transition);
}
.navbar a:hover {
  color: var(--color-secondary);
}
.divider {
  margin: 0 0.5rem;
}
.nav-icon {
  font-size: 1.2rem;
}
button {
  background: none;
  border: 1px solid var(--color-light);
  color: var(--color-light);
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background var(--transition), transform var(--transition);
}
button:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
}
.logo {
  width: 32px;
  height: 32px;
}
</style>
