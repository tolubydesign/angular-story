import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { getUserCredentials } from "@shared/helpers/session.storage";

@Injectable({ providedIn: 'root' })
class UserToken { }

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  session: Storage = sessionStorage

  constructor(
    private router: Router
  ) { }

  canActivate(): boolean {
    // TODO: implement advanced security
    const { email, role, token, username } = getUserCredentials();
    if (!email || !role || !token || !username) {
      this.router.navigate([''])
      return false
    };
    return true;
  };
}

export const routeGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(PermissionsService).canActivate();
};
