import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {UserService} from './user.service';
import {User} from './user';
import {ConfirmComponent} from '../confirm/confirm.component';
import {AuthService} from '../../auth/auth.service';
import {MessageService} from '../message.service';
import {animatedScrollByWindow} from '../../utils/scroll';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  myID: number;
  users: User[] = [];
  term;
  currentPage = 1;
  searchVisible = false;
  loaded = false;
  @ViewChild('confirm') confirm: ConfirmComponent;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    authService: AuthService
  ) {
    this.myID = authService.getUserData().id;
  }

  @HostListener('window:scroll')
  scrollHandler() {
    if (window.pageYOffset > 100) {
      this.searchVisible = false;
    }
  }

  showSearch() {
    animatedScrollByWindow(0, () => {
      this.searchVisible = true;
    });
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.get().subscribe(res => {
      this.loaded = true;
      this.users = res;
    });
  }

  isAdmin(user: User) {
    return user.role === 'admin';
  }

  delete(user: User) {
    this.userService.delete(user).subscribe(() => this.getUsers());
  }

  changeRole(user: User) {
    if (user.role === 'user') {
      user.role = 'admin';
    } else {
      user.role = 'user';
    }
    this.userService.update(user).subscribe(res => console.log(res));
  }

  deleteRequest(user: User) {
    this.confirm.show(user, 'delete');
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
