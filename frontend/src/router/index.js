// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Courses from '../views/Courses.vue';
import QAs from '../views/QAs.vue';

const routes = [
  { path: '/', redirect: '/register' },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/courses', component: Courses, meta: { requiresAuth: true } },
  { path: '/qas', component: QAs, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/register');
  } else {
    next();
  }
});

export default router;
