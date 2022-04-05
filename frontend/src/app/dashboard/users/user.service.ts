import { Injectable } from '@angular/core';
import {HttpCrud} from '../../HttpCrud';
import {User} from './user';
import {Observable} from 'rxjs/Observable';
import {HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';

interface Token {
  token: string;
  expires: Date;
  user: string;
}

@Injectable()
export class UserService extends HttpCrud<User> {
  apiUrl = '/api/user';

  auth (email: string, password: string): Observable<Token> {
    return this.http.post<Token>(`${this.url}/login`, {email, password});
  }

  register(data: User, captcha: string): Observable<User> {
    const outData: any = data;
    outData['g-recaptcha-response'] = captcha;
    return this.http.post<User>(this.url, outData).pipe(
      tap(() => this.log(`added`)),
      catchError(this.handleError<User>('add')));
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.url}/me`).pipe(
      catchError(this.handleError<User>('get me')));
  }
}
