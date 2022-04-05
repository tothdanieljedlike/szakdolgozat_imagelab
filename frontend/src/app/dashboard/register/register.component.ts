import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../users/user.service';
import {User} from '../users/user';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {RecaptchaComponent} from 'ng-recaptcha';
import {OrganizationService} from '../organization/organization.service';
import {Organization} from '../organization/organization';
import * as owasp from 'owasp-password-strength-test';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  newUser: User = {id: null, firstName: '', lastName: '', email: '', organization: {id: null, name: ''}, password: '', role: null};
  reCaptcha: string;
  passwordErrors: string[];
  orgs: {[id: number]: number} = [];
  autocompleteInit = {
    data: {},
    minLength: 3,
    onAutocomplete: (val) => {
      this.newUser.organization.id = this.orgs[val];
    },
  };
  inProgress = false;
  @ViewChild('captcha') captchaElement: RecaptchaComponent;
  @ViewChild('password') password: ElementRef;

  constructor(
    private userService: UserService,
    private organizationService: OrganizationService,
    private auth: AuthService,
    private router: Router
  ) {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['download']);
    }
    this.organizationService.get().toPromise()
      .then((res: Organization[]) => {
        if (Array.isArray(res)) {
          res.forEach((one: Organization) => {
            this.orgs[one.name] = one.id;
            this.autocompleteInit.data[one.name] = null;
          });
        }
      })
      .catch(err => console.error(err));
  }

  ngOnInit() {
    this.checkPassword();
  }

  getPasswordError() {
    return this.passwordErrors.length ? this.passwordErrors[this.passwordErrors.length - 1] : '';
  }

  isPasswordOK() {
    return this.getPasswordError() === '';
  }

  checkPassword() {
    this.passwordErrors = owasp.test(this.newUser.password).errors;
    this.password.nativeElement.setCustomValidity(this.getPasswordError());
  }

  async register(ev: Event) {
    ev.preventDefault();

    if (!this.newUser.organization.id) {
      this.newUser.organization.id = this.orgs[this.newUser.organization.name] || null;
    }
    this.inProgress = true;
    try {
      const response: User = await this.userService.register(this.newUser, this.reCaptcha).toPromise();
      if (response) {
        this.router.navigate(['login', {email: response.email, validation: 'sent'}]);
      } else {
        this.captchaElement.reset();
      }
    } catch (err) {
      console.error(err);
      this.captchaElement.reset();
    }
    this.inProgress = false;
  }
}
