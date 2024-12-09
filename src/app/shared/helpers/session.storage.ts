import { UserCredentials } from '@shared/models/user.models';
import { isPlatformBrowser } from '@angular/common';

const sitePrimaryKey = 'toa_dev_session_storage_';
const tokenKey = sitePrimaryKey + 'token';
const username = sitePrimaryKey + 'username';
const role = sitePrimaryKey + 'role';
const email = sitePrimaryKey + 'email';

/**
 * Get User Credentials from Session Storage.
 * Will return undefined for a value if that value is not available.
 * @param isBrowser `false` on the server side and `true` on the browser side
 */
export function getUserCredentials(isBrowser: boolean, session?: Storage): UserCredentials {
  console.log('session storage', sessionStorage)
  console.log('get user credentials isBrowser:', isBrowser)
  if (!isBrowser) {
    return {
      token: undefined,
      username: undefined,
      role: undefined,
      email: undefined,
    }
  }

  return {
    token: session?.getItem(tokenKey) ? session.getItem(tokenKey) : undefined,
    username: session ? session.getItem(username) : undefined,
    role: session ? session.getItem(role) : undefined,
    email: session ? session.getItem(email) : undefined,
  };
}

/**
 * Set credentials to Session Storage.
 * @param credential
 * @returns
 */
export function setUserCredential(credential: UserCredentials): void {
  if (sessionStorage && credential.token) sessionStorage.setItem(tokenKey, credential.token);
  if (sessionStorage && credential.email) sessionStorage.setItem(email, credential.email);
  if (sessionStorage && credential.role) sessionStorage.setItem(role, credential.role);
  if (sessionStorage && credential.username) sessionStorage.setItem(username, credential.username);
  return;
}

export function removeUserSessionStorageCredentials(): void {
  if (sessionStorage) {
    sessionStorage.removeItem(tokenKey);
    sessionStorage.removeItem(email);
    sessionStorage.removeItem(role);
    sessionStorage.removeItem(username);
  }
}
