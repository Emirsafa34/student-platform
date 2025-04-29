// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import api from './services/api';
import './style.css';

const app = createApp(App);

// (Optional) expose your axios instance as $api in all components
app.config.globalProperties.$api = api;

app
  .use(createPinia())
  .use(router)
  .mount('#app');
