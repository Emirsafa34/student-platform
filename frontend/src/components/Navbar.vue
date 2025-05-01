<template>
  <nav class="navbar animate-fadeIn">
    <div class="navbar-left">
      <router-link to="/" class="navbar-logo-link">
        <img class="logo" src="http://ceng1.cumhuriyet.edu.tr/images/logo2.png" alt="Logo" />
        <span class="site-name">Ceng Rehber</span>
      </router-link>
    </div>

    <button class="hamburger" @click="toggleMenu">☰</button>

    <!-- SLIDE Menü -->
    <div class="mobile-menu" :class="{ open: menuOpen }">
      <router-link to="/" @click="closeMenu">Anasayfa</router-link>
      <router-link to="/courses" @click="closeMenu">Dersler</router-link>
      <router-link to="/qas" @click="closeMenu">Soru-Cevap</router-link>
      <router-link v-if="!authStore.isAuthenticated" to="/login" @click="closeMenu">🔐 Giriş Yap</router-link>
      <router-link v-if="!authStore.isAuthenticated" to="/register" @click="closeMenu">📝 Kayıt Ol</router-link>
      <template v-if="authStore.isAuthenticated">
        <span class="user-info">👤 {{ authStore.user.username }}</span>
        <button @click="handleLogout">Çıkış</button>
      </template>
    </div>

    <!-- Masaüstü menü -->
    <div class="navbar-center desktop-only">
      <router-link to="/">Anasayfa</router-link>
      <span class="divider">|</span>
      <router-link to="/courses">Dersler</router-link>
      <span class="divider">|</span>
      <router-link to="/qas">Soru-Cevap</router-link>
    </div>

    <div class="navbar-right desktop-only">
      <router-link v-if="!authStore.isAuthenticated" to="/login" class="nav-icon" title="Giriş Yap">🔐</router-link>
      <router-link v-if="!authStore.isAuthenticated" to="/register" class="nav-icon" title="Kayıt Ol">📝</router-link>
      <template v-if="authStore.isAuthenticated">
        <span class="user-info">👤 {{ authStore.user.username }}</span>
        <button @click="handleLogout">Çıkış</button>
      </template>
    </div>

    <!-- Karartma alanı -->
    <div class="overlay" v-if="menuOpen" @click="closeMenu"></div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const menuOpen = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const toggleMenu = () => (menuOpen.value = !menuOpen.value);
const closeMenu = () => (menuOpen.value = false);

function handleLogout() {
  authStore.logout();
  closeMenu();
  router.push('/login');
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-primary);
  padding: 0.75rem 1.5rem;
  position: relative;
  z-index: 1000;
}

/* LOGO */
.navbar-logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}
.logo {
  width: 180px;
  height: auto;
}
.site-name {
  margin-left: 0.75rem;
  font-family: var(--font-logo);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-light);
}

/* DESKTOP MENÜ */
.navbar-center,
.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.navbar-center a,
.navbar-right a {
  color: var(--color-light);
  font-family: var(--font-base);
  font-weight: 500;
  text-decoration: none;
}
.navbar-center a:hover,
.navbar-right a:hover {
  color: var(--color-secondary);
}
.divider {
  color: var(--color-light);
}
.nav-icon {
  font-size: 1.5rem;
  color: var(--color-light);
}
button {
  background: none;
  border: 1px solid var(--color-light);
  color: var(--color-light);
  padding: 6px 12px;
  border-radius: var(--radius);
  cursor: pointer;
}
button:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
}
.user-info {
  color: var(--color-light);
  font-family: var(--font-base);
}

/* HAMBURGER */
.hamburger {
  display: none;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: var(--color-light);
  cursor: pointer;
}

/* SLIDE MENÜ */
.mobile-menu {
  position: fixed;
  top: var(--navbar-height, 60px);
  right: 0;
  width: 250px;
  height: 100vh;
  background-color: var(--color-primary);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 999;
}
.mobile-menu.open {
  transform: translateX(0);
}
.mobile-menu a,
.mobile-menu button {
  color: var(--color-light);
  text-decoration: none;
  font-size: 1.1rem;
  font-family: var(--font-base);
}
.mobile-menu button {
  border: 1px solid var(--color-light);
  padding: 6px 12px;
}

/* OVERLAY */
.overlay {
  position: fixed;
  top: var(--navbar-height, 60px);
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 998;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .desktop-only {
    display: none;
  }

  .logo {
    width: 120px;
  }

  .site-name {
    font-size: 1.25rem;
  }
}
</style>
