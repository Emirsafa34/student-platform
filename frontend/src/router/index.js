import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import CoursesView from '../views/CoursesView.vue';
import QAs from '../views/QAs.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login',   component: Login },
  { path: '/register', component: Register },
  { 
    path: '/dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/courses', 
    component: CoursesView, 
    meta: { requiresAuth: true, roles: ['admin'] } 
  },
  { 
    path: '/qas', 
    component: QAs, 
    meta: { requiresAuth: true } 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // 'admin' veya 'user'

  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }

  if (to.meta.roles && !to.meta.roles.includes(role)) {
    // Yetkiniz olmayan sayfaya erişim isteğinde iseniz Anasayfa'ya yönlendir
    return next('/dashboard');
  }

  next();
});

export default router;
