const env = process.env.NODE_ENV

const baseUrl =
  env === 'development' || env === 'staging'
    ? process.env.LOCAL_API_URL
    : process.env.PRODUCTION_API_URL

export default {
  loginEndpoint: `${baseUrl}auth/user/login`,
  registerEndpoint: `${baseUrl}auth/register`,
  refreshEndpoint: `${baseUrl}auth/token/refresh`,
  logoutEndpoint: `${baseUrl}auth/logout`,

  tokenType: 'Bearer',
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
  storageUserDataKeyName: 'userData',
}
