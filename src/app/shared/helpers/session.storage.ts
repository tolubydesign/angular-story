import { UserCredentials } from "@shared/models/user.models";

const sitePrimaryKey = "toa_dev_session_storage_";
const tokenKey = sitePrimaryKey + 'token';
const username = sitePrimaryKey + 'username';
const role = sitePrimaryKey + 'role';
const email = sitePrimaryKey + 'email';

/**
 * Get User Credentials from Session Storage.
 * Will return undefined for a value if that value is not available.
 */
export function getUserCredentials(): UserCredentials {
  return {
    token: (!!sessionStorage.getItem(tokenKey)) ? sessionStorage.getItem(tokenKey) : undefined,
    username: !!sessionStorage.getItem(username) ? sessionStorage.getItem(username) : undefined,
    role: !!sessionStorage.getItem(role) ? sessionStorage.getItem(role) : undefined,
    email: !!sessionStorage.getItem(email) ? sessionStorage.getItem(email) : undefined
  }
}

/**
 * Set credentials to Session Storage.
 * @param credential 
 * @returns 
 */
export function setUserCredential(credential: UserCredentials): void {
  if (sessionStorage && credential.token) sessionStorage.setItem(tokenKey, credential.token);
  if (sessionStorage && credential.email) sessionStorage.setItem(tokenKey, credential.email);
  if (sessionStorage && credential.role) sessionStorage.setItem(tokenKey, credential.role);
  if (sessionStorage && credential.username) sessionStorage.setItem(tokenKey, credential.username);
  return;
}
