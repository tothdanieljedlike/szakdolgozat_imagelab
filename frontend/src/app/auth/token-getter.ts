import {STORE_TOKEN} from './auth.service';

export function tokenGetter() {
  return localStorage.getItem(STORE_TOKEN) || 'JWT 123.123.123';
}
