import {defineStore} from 'pinia';
import {isUserLoggedIn} from 'src/utils/utils'
import {api} from 'boot/axios';
import { UserInterface } from 'src/interfaces/user.interface';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    currentUser: {} as Partial<UserInterface>,
  }),

  getters: {
    getCurrentUser: (state) => state.currentUser,
  },

  actions: {
    fetchCurrentUser(payload: any): Promise<any>|null {
      if (!isUserLoggedIn()) {
        return null
      }
      return new Promise((resolve, reject) => {
        api
          .get('auth/user', { params: payload })
          .then((response) => {
            // update the current user state
            this.currentUser = response.data.data

            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },

    logoutUser(payload: any) {
      return new Promise((resolve, reject) => {
        api
          .get('auth/logout', payload)
          .then((response) => {
            this.currentUser = {}

            resolve(response)
          })
          .catch((error) => {
            this.currentUser = {}

            reject(error)
          })
      })
    },
  }
})

