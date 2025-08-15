import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import TestingPage from '../views/testingPage.vue';
import auth from '../services/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/testconnection',
    name: 'TestConnection',
    component: TestingPage,
    meta: { requiresAuth: true }, // This route requires authentication
  },
  {
    path: '/',
    redirect: '/testconnection',
  },
];

const router = createRouter({
    history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.isAuthenticated()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;