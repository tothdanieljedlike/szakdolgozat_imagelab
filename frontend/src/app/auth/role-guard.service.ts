import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router, private jwtHelper: JwtHelperService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;

    if (!this.auth.isAuthenticated() ||  !this.canAccess(expectedRole)) {
      this.router.navigate(['/download']);
      return false;
    }
    return true;
  }

  public canModify(email: string) {
    if (!this.auth.isAuthenticated()) { return false; }

    const token = localStorage.getItem('token');

    // decode the token to get its payload
    const tokenPayload = this.jwtHelper.decodeToken(token);
    return tokenPayload.username === email || tokenPayload.role === 'admin';
  }


  public canAccess(role: string) {
    const token = localStorage.getItem('token');

    // decode the token to get its payload
    const tokenPayload = this.jwtHelper.decodeToken(token);

    return role === tokenPayload.role;
  }

}
