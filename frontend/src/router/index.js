// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Courses from '../views/Courses.vue';
import QAs from '../views/QAs.vue';
import Announcements from '../views/Announcements.vue';

const routes = [
  // Ana sayfa (Dashboard) herkese açık
  {
    path: '/',
    component: Dashboard
  },
  // Giriş / Kayıt - navbar ve footer gizlenecek
  {
    path: '/login',
    component: Login,
    meta: { hideNavbar: true, hideFooter: true }
  },
  {
    path: '/register',
    component: Register,
    meta: { hideNavbar: true, hideFooter: true }
  },
  // Dashboard kısayolu
  {
    path: '/dashboard',
    redirect: '/'
  },
  // Dersler ve Soru-Cevap herkes için açık
  {
    path: '/courses',
    component: Courses
  },
  {
    path: '/qas',
    component: QAs
  },
  {
    path: '/announcements',
    component: Announcements
  }
  // İleride korumak istediğin başka sayfalar olursa:
  // {
  //   path: '/secret',
  //   component: SecretPage,
  //   meta: { requiresAuth: true }
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Her sayfa geçişinde sayfa başına scroll
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  // Sadece meta.requiresAuth içeren rotalarda kontrol et
  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }

  // Diğer tüm sayfalarda izin ver
  next();
});

export default router;
