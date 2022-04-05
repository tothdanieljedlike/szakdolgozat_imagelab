import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../users/user.service';
import {MessageService, TOAST} from '../message.service';
import {AuthService} from '../../auth/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import * as Materialize from 'materialize-css';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  @ViewChild('form') form = HTMLFormElement;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService) {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['download']);
    } else {
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.email = params.get('email');
        setTimeout(Materialize.updateTextFields, 100);
        const validation = params.get('validation') || '';
        switch (validation.toLocaleLowerCase()) {
          case 'ok':
            this.messageService.add('Successfully validated', TOAST.LONG);
            break;
          case 'invalid':
            this.messageService.add('Validation failed: Invalid token.', TOAST.LONG);
            break;
          case 'error':
            this.messageService.add('Validation failed. Something went wrong.', TOAST.LONG);
            break;
          case 'sent':
            this.messageService.add('Validation email sent. Please check your mailbox.', TOAST.LONG);
            break;
        }
      });
    }
  }

  ngOnInit() {}

  isEmailValid(): boolean {
    return this.email && this.email.length > 3 && this.email.indexOf('@') > 0;
  }

  async sendReminder() {
    if (!this.isEmailValid()) {
      return this.messageService.add('invalid email address');
    }

    try {
      const res = await this.userService.get('/reminder?email=' + this.email).toPromise();
      if (!Array.isArray(res)) {
        this.messageService.add('email sent');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async login(event: Event) {
    event.preventDefault();
    try {
      const response = await this.userService.auth(this.email, this.password).toPromise();
      this.auth.setToken(response.token);
      const me = await this.userService.getMe().toPromise();
      this.messageService.add(`Logged in. Welcome ${me.firstName}!`);
      this.router.navigate(['download']);
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        this.messageService.add('Login failed');
      } else {
        throw err;
      }
    }
  }

}
