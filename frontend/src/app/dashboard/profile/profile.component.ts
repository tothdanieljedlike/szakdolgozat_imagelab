import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../users/user.service';
import {User} from '../users/user';
import {ConfirmComponent} from '../confirm/confirm.component';
import * as Materialize from 'materialize-css';
import {AuthService} from '../../auth/auth.service';
import * as owasp from 'owasp-password-strength-test';
import {Organization} from '../organization/organization';
import {OrganizationService} from '../organization/organization.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  me: User;
  tmpMe: User;
  editing = false;
  passwordErrors: string[] = [];
  organizations: Organization[] = [];
  @ViewChild('confirm') confirm: ConfirmComponent;
  @ViewChild('password') password: ElementRef;

  constructor(
    private userService: UserService,
    private authSerice: AuthService,
    private organizationService: OrganizationService
  ) { }

  ngOnInit() {
    this.getOrgs();
    this.getMe();
  }

  getMe() {
    this.userService.getMe().subscribe((res: User) => {
      this.me = res;
      this.me.password = '';
    });
  }

  async getOrgs() {
    try {
      this.organizations = await this.organizationService.get().toPromise();
    } catch (err) {
      console.error(err);
    }
  }

  deleteRequest() {
    this.confirm.show(this.me, 'delete');
  }

  delete(user: User) {
    this.userService.delete(user).subscribe(() => {
      this.authSerice.cleanToken();
    });
  }

  startEdit() {
    this.editing = true;
    this.tmpMe = Object.assign({}, this.me);
    setTimeout(Materialize.updateTextFields, 100);
  }

  stopEdit(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.editing = false;
    if (this.tmpMe.password === '') {
      this.tmpMe.password = undefined;
    }
    this.userService.update(this.tmpMe).subscribe(() => this.getMe());
  }

  getPasswordError() {
    return this.passwordErrors.length ? this.passwordErrors[this.passwordErrors.length - 1] : '';
  }

  isPasswordOK() {
    return this.getPasswordError() === '';
  }

  checkPassword() {
    this.passwordErrors = owasp.test(this.tmpMe.password).errors;
    this.password.nativeElement.setCustomValidity(this.getPasswordError());
  }

  checkPasswordValidity() {
    return this.password.nativeElement.checkValidity();
  }

  handleConfirm(request: {target: User, event: string}) {
    switch (request.event) {
      case 'delete':
        return this.delete(request.target);
      default:
        console.log('unknown event', event.target);
    }
  }
}
