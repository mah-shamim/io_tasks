import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import AppStorage from 'src/utils/AppStorage';
const env = process.env.NODE_ENV

export const baseUrl =
  env === 'development' || env === 'staging'
    ? process.env.LOCAL_API_URL
    : process.env.PRODUCTION_API_URL

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside the
// "export default () => {}" function below (which runs individually
// for each client)

/**
 * default api client
 */
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    Accept: 'application/json',
  },
})
// add a request interceptor to add the token to the request
api.interceptors.request.use(
  (request) => {
    request.headers['Authorization'] = `Bearer ${AppStorage.getAccessToken()}`

    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)
// add a response interceptor for 401 unauthorized responses
// >> we assume that the user is not logged in or the access token is expired
api.interceptors.response.use(
  (response) => response,
  (error) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { config, response } = error

    // if status 401 >> means token expired
    if (response && response.status === 401) {
      // clear local storage and reload page to force redirection to login
      AppStorage.clearLocalStorage()
      location.reload()
    }
    // any other error status will be returned
    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };

