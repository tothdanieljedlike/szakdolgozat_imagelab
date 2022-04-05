import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Router} from '@angular/router';

export const STORE_TOKEN = 'token';

@Injectable()
export class AuthService {

  constructor(
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  public isAuthenticated(): boolean {
    if (this.jwtHelper.tokenGetter() === 'JWT 123.123.123') { return false; }
    return !this.jwtHelper.isTokenExpired();
  }

  public getToken() {
    return this.jwtHelper.tokenGetter();
  }

  public setToken(token: string) {
    localStorage.setItem(STORE_TOKEN, token);
  }

  public cleanToken() {
    localStorage.removeItem(STORE_TOKEN);
    return this.router.navigateByUrl('/download');
  }

  public getUserData() {
    const tokenPayload = this.jwtHelper.decodeToken(this.getToken());
    return {
      id: tokenPayload.id,
      email: tokenPayload.username,
      role: tokenPayload.role,
    };
  }

}
