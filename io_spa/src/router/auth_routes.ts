export default [
  {
    path: '/auth',
    meta: { requiresAuth: false, redirectIfLoggedIn: true, title: 'IO Tasks | Login' },
    name: 'AuthLayout',
    redirect: {
      name: 'AuthLogin',
    },
  },

  {
    path: 'login',
    meta: { requiresAuth: false, redirectIfLoggedIn: true, title: 'IO Tasks | Login' },
    name: 'AuthLogin',
    component: () => import('pages/auth/AuthLogin.vue'),
  },

  {
    path: 'register',
    meta: { requiresAuth: false, redirectIfLoggedIn: true, title: 'IO Tasks | Register' },
    name: 'AuthRegister',
    component: () => import('pages/auth/AuthRegister.vue'),
  },
  ]
