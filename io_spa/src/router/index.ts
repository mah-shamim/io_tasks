import {route} from 'quasar/wrappers';
import {Notify} from 'quasar';
import {isUserLoggedIn, prepareErrorMessage, showErrorNotification} from 'src/utils/utils';
import profileMethods from 'components/profile/profileMethods';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({left: 0, top: 0}),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  /**
   * Authentication guards
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Router.beforeEach(async (to, from, next) => {
    const {profileData, fetchProfile} = profileMethods()

    if (isUserLoggedIn() && !profileData.value.email) {
      // fetch user data and update state on application reload
      await fetchProfile()?.then(() => {/* do nothing */
      })
        .catch((error) => {
          const message = prepareErrorMessage(error)
          Notify.create({
            type: 'negative',
            message,
            position: 'top-right',
          })
        })
    }

    const redirectLoggedIn = to.meta.redirectIfLoggedIn || false
    const auth = to.meta.requiresAuth || false

    // set page title
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.title = to.meta.title || 'IO Tasks'

    /**
     * public path proceed
     * doesn't require auth
     */
    if (!isUserLoggedIn() && !auth) {
      next()
    }

    /**
     * if route requires a logged-in user;
     * and the user is not authenticated redirect to log in
     */
    if (!isUserLoggedIn() && auth) {
      next({
        name: 'AuthLogin',
      })
    }

    /**
     * if route requires a logged-in user;
     * and the user is authenticated, just proceed
     */
    if (isUserLoggedIn() && auth) {
      next()
    }

    /**
     * if user is logged in and this is an auth route
     * redirect to home
     */
    if (isUserLoggedIn() && redirectLoggedIn) {
      next({
        name: 'TasksPageRoute',
      })
    }

    /**
     * if route doesn't require auth e.g. public path
     *
     * and user is logged in just proceed
     */
    if (isUserLoggedIn() && !auth) {
      next()
    }

  })

  return Router;
});
