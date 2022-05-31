import authConfigs from 'src/utils/authConfigs';
import { UserInterface} from 'src/interfaces/user.interface';

export default class {
  static storeUserData(userData: UserInterface) {
    localStorage.setItem(authConfigs.storageUserDataKeyName, JSON.stringify(userData))
  }

  static getUserData(): UserInterface | null {
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
    localStorage.setItem(authConfigs.storageRefreshTokenKeyName, token)
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(authConfigs.storageRefreshTokenKeyName)
  }

  static clearLocalStorage() {
    localStorage.clear()
  }
}
