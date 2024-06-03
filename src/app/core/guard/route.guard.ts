import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

@Injectable()
class UserToken {}

@Injectable()
class PermissionsService {
  canActivate(currentUser: UserToken, userId: string): boolean {
    return true;
  }
  canMatch(currentUser: UserToken): boolean {
    return true;
  }
}

export const routeGuard: CanActivateFn = (route: ActivatedRouteSnapshot,  state: RouterStateSnapshot) => {
  // return true;
  console.log('route guard: route', route);
  console.log('route guard: state', state);
  console.log('route guard: session storage', sessionStorage.length)
  
  return inject(PermissionsService).canActivate(inject(UserToken), route.params['id']);
};
