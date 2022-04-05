import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UploadComponent} from './dashboard/upload/upload.component';
import {DownloadComponent} from './dashboard/download/download.component';
import {LoginComponent} from './dashboard/login/login.component';
import {NotfoundComponent} from './dashboard/notfound/notfound.component';
import {RegisterComponent} from './dashboard/register/register.component';
import {MapComponent} from './dashboard/map/map.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { RoleGuardService as RoleGuard } from './auth/role-guard.service';
import {LogoutComponent} from './dashboard/logout/logout.component';
import {UsersComponent} from './dashboard/users/users.component';
import {ProfileComponent} from './dashboard/profile/profile.component';
import {OrganizationComponent} from './dashboard/organization/organization.component';

const routes: Routes = [
  { path: '', redirectTo: '/download', pathMatch: 'full' },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UsersComponent, canActivate: [RoleGuard], data: {
      expectedRole: 'admin'
    } },
  { path: 'download', component: DownloadComponent},
  { path: 'download/:id', component: DownloadComponent},
  { path: 'map', component: MapComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'organization', component: OrganizationComponent, canActivate: [RoleGuard], data: {
      expectedRole: 'admin'
    } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'register', component: RegisterComponent },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
