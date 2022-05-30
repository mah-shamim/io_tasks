import authConfigs from 'src/utils/authConfigs';
import { UserModel } from 'src/models/user';

export default class {
  static storeUserData(userData: UserModel) {
    localStorage.setItem(authConfigs.storageUserDataKeyName, JSON.stringify(userData))
  }

  static getUserData(): UserModel | null {
    const userString = localStorage.getItem(authConfigs.storageUserDataKeyName)

    if (userString) {
      return JSON.parse(userString)
    }
    return null
  }

  static storeAccessToken(token: string) {
    localStorage.setItem(authConfigs.storageTokenKeyName, token)
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(authConfigs.storageTokenKeyName)
  }

  static storeRefreshToken(token: string) {
    sessionStorage.setItem(authConfigs.storageRefreshTokenKeyName, token)
  }

  static getRefreshToken(): string | null {
    return sessionStorage.getItem(authConfigs.storageRefreshTokenKeyName)
  }

  static clearLocalStorage() {
    sessionStorage.clear()
  }
}
