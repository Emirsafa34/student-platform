// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth';
import api from './services/api';
import router from './router';
import App from './App.vue';

// Global stiller: önce tema, sonra varsa ekstra stil
import './assets/styles/variables.css';
import './style.css';

// Font Awesome ikon kütüphanesini dahil ediyoruz
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App);

// 1. Pinia & router’ı kaydet
app.use(createPinia());
app.use(router);

// 2. Axios instance’ını tüm bileşenlerde $api olarak kullan
app.config.globalProperties.$api = api;

// 3. Uygulama açılır açılmaz localStorage’dan auth bilgisini store’a yükle
const authStore = useAuthStore();
const token = localStorage.getItem('token');
if (token) {
  authStore.token = token;
  authStore.user = {
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role'),
  };
}

// 4. Router hazır olduğunda mount et
router.isReady().then(() => {
  app.mount('#app');
});
