import { RouteRecordRaw } from 'vue-router';
import main_routes from 'src/router/main_routes';
import auth_routes from 'src/router/auth_routes';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    meta: { requiresAuth: true, title: 'IO Tasks | Home' },
    component: () => import('layouts/MainLayout.vue'),
    children: [...main_routes],
  },

  {
    path: '/auth',
    meta: { requiresAuth: false, title: 'IO Tasks | Login' },
    component: () => import('layouts/AuthLayout.vue'),
    children: [...auth_routes],
  },

  {
    path: '/500',
    meta: { requiresAuth: false, title: 'IO Tasks | 500' },
    name: 'Error500',
    component: () => import('pages/errors/Error500.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/errors/ErrorNotFound.vue'),
  },
];

export default routes;
