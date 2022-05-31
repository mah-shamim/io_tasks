export default [
  {
    path: '',
    meta: { requiresAuth: true, title: 'IO Tasks | Home' },
    redirect: {
      name: 'TasksPageRoute',
    },
    /*name: 'HomeRoute',
    component: () => import('pages/TasksPage.vue'),*/
  },
  {
    path: '/tasks',
    meta: { requiresAuth: true, title: 'IO Tasks | List' },
    name: 'TasksPageRoute',
    component: () => import('pages/TasksPage.vue'),
  },
]
