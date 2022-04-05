import {Component, EventEmitter, OnInit} from '@angular/core';
import {RoleGuardService} from '../auth/role-guard.service';
import {AuthService} from '../auth/auth.service';
import {MaterializeAction} from 'angular2-materialize';
import * as $ from 'jquery';

export interface IMenuItem {
  name?: string;
  route: string;
  needAuth?: boolean;
  adminOnly?: boolean;
  isButton?: boolean;
  icon?: string;
}

const MenuItems: IMenuItem[] = [{

  name: 'Map',
  route: '/map',
  // icon: 'map',
  }, {
  name: 'Download',
  route: '/download',
  // icon: 'file_download',
}, {
  name: 'Upload',
  route: '/upload',
  // icon: 'file_upload',
  needAuth: true
}, {
  name: 'Users',
  route: '/user',
  needAuth: true,
  adminOnly: true,
}, {
  name: 'Login',
  route: '/login',
  isButton: true,
  // icon: 'account_box',
  needAuth: false
}, {
  name: 'Organization',
  route: '/organization',
  needAuth: true,
  adminOnly: true
}, {
  name: 'Profile',
  route: '/profile',
  // icon: 'account_circle',
  needAuth: true,
}, {
  name: 'Logout',
  route: '/logout',
  isButton: true,
  icon: 'exit_to_app',
  needAuth: true
}];

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  navOptions = new EventEmitter<string|MaterializeAction>();
  constructor(private roles: RoleGuardService, protected auth: AuthService) { }

  ngOnInit() {
    $(() => {
      this.navOptions.emit({action: 'sideNav', params: [{closeOnClick: true}]});
    });
  }

  get menuItems() {
    return MenuItems;
  }

  isAdmin(onlyAdmin: boolean) {
    return !onlyAdmin || (onlyAdmin && this.roles.canAccess('admin'));
  }

  isVisible(needAuth: boolean) {
    const loggedIn = this.auth.isAuthenticated();
    return needAuth === undefined || (!needAuth && !loggedIn) || (needAuth && loggedIn);
  }
}
