import { Inject, Injectable, InjectionToken, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { getUserCredentials } from "@shared/helpers/session.storage";
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
class UserToken { }

// export const BROWSER_STORAGE  = new InjectionToken<Storage>('Browser Storage', {
//   providedIn: 'root',
//   factory: () => window.sessionStorage
// });

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  session: Storage | undefined = undefined;

  constructor(
    private router: Router,
    // @Inject(BROWSER_STORAGE) public storage: Storage,
    @Inject(PLATFORM_ID) public platformId: object
  ) {
    // if (sessionStorage) this.session = sessionStorage;
    // if (!sessionStorage) console.log('session storage not accessible')
  }

  canActivate(): boolean {
    const isBrowser = isPlatformBrowser(this.platformId);
    let session: Storage | undefined = undefined;
    if (isBrowser) {
      // session storage is undefined in server side render
      // if placed in the same line as isBrowser the page will error out in the terminal
      // keeping here. confirm that we are in a browser before checking for session storage.
      // Unfortunately, it will still show the warning `user has insufficient credentials. preventing access` in the terminal
      if (sessionStorage) session = sessionStorage;
    }

    const { email, token } = getUserCredentials(isBrowser, session);
    if (!email || !token) {
      console.warn('user has insufficient credentials. preventing access')
      this.router.navigate([''])
      return false
    };
    return true;
  };
}

export const routeGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(PermissionsService).canActivate();
};
