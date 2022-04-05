import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-logout',
  template: '',
  styleUrls: []
})
export class LogoutComponent implements OnInit {

  constructor(auth: AuthService) {
    auth.cleanToken();
  }

  ngOnInit() {}

}
