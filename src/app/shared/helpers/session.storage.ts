import { UserCredentials } from '@shared/models/user.models';
import { isPlatformBrowser } from '@angular/common';

const sitePrimaryKey = 'toa_dev_session_storage_';
const tokenKey = sitePrimaryKey + 'token';
const username = sitePrimaryKey + 'username';
const id = sitePrimaryKey + 'id';
const email = sitePrimaryKey + 'email';

/**
 * Get User Credentials from Session Storage.
 * Will return undefined for a value if that value is not available.
 * @param isBrowser `false` on the server side and `true` on the browser side
 */
export function getUserCredentials(isBrowser: boolean, session?: Storage): UserCredentials {
  if (!isBrowser) {
    return {
      token: undefined,
      username: undefined,
      email: undefined,
      id: undefined,
    }
  }

  return {
    token: session?.getItem(tokenKey) ? session.getItem(tokenKey) : undefined,
    username: session ? session.getItem(username) : undefined,
    email: session ? session.getItem(email) : undefined,
    id: session ? session.getItem(id) : undefined,
  };
}

/**
 * Set credentials to Session Storage.
 * @param credential
 * @returns
 */
export function setUserCredential(credential: UserCredentials): void {
  if (sessionStorage && credential.token) sessionStorage.setItem(tokenKey, credential.token);
  if (sessionStorage && credential.username) sessionStorage.setItem(username, credential.username);
  if (sessionStorage && credential.email) sessionStorage.setItem(email, credential.email);
  if (sessionStorage && credential.id) sessionStorage.setItem(id, credential.id);
  return;
}

export function removeUserSessionStorageCredentials(): void {
  if (sessionStorage) {
    sessionStorage.removeItem(tokenKey);
    sessionStorage.removeItem(email);
    sessionStorage.removeItem(id);
    sessionStorage.removeItem(username);
  }
}
