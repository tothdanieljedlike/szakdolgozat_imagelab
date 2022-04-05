import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {MaterializeModule} from 'angular2-materialize';
import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CardComponent } from './dashboard/download/card/card.component';
import { FooterComponent } from './footer/footer.component';
import { DownloadComponent } from './dashboard/download/download.component';
import { UploadComponent } from './dashboard/upload/upload.component';
import { LoginComponent } from './dashboard/login/login.component';
import { RegisterComponent } from './dashboard/register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { NotfoundComponent } from './dashboard/notfound/notfound.component';
import {CardService} from './dashboard/download/card/card.service';
import { MessageService } from './dashboard/message.service';
import {HttpClientModule} from '@angular/common/http';
import { DownloadListService } from './dashboard/download/download-list.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { LoaderComponent } from './dashboard/loader/loader.component';
import { RatingComponent } from './dashboard/download/card/rating/rating.component';
import { StarComponent } from './dashboard/download/card/rating/star/star.component';
import {AgmCoreModule} from '@agm/core';
import { ModalComponent } from './dashboard/download/modal/modal.component';
import { UserService } from './dashboard/users/user.service';
import {FormsModule} from '@angular/forms';
import {HttpDownload} from './HttpDownload';
import { MapComponent } from './dashboard/map/map.component';
import {AuthService} from './auth/auth.service';
import {AuthGuardService} from './auth/auth-guard.service';
import {JwtModule} from '@auth0/angular-jwt';
import {RoleGuardService} from './auth/role-guard.service';
import {RECAPTCHA_SETTINGS, RecaptchaModule, RecaptchaSettings} from 'ng-recaptcha';
import { LogoutComponent } from './dashboard/logout/logout.component';
import {MapService} from './dashboard/map/map.service';
import {OrganizationService} from './dashboard/organization/organization.service';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import { UsersComponent } from './dashboard/users/users.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { EmptyComponent } from './dashboard/empty/empty.component';
import { OrganizationComponent } from './dashboard/organization/organization.component';
import { ConfirmComponent } from './dashboard/confirm/confirm.component';
import { OrganizationEntityComponent } from './dashboard/organization/organization-entity/organization-entity.component';
import {tokenGetter} from './auth/token-getter';
import { AutofocusDirective } from './autofocus.directive';
import {RatingService} from './dashboard/download/card/rating/rating.service';
import {CommentService} from './dashboard/download/card/comment.service';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    DashboardComponent,
    CardComponent,
    FooterComponent,
    DownloadComponent,
    UploadComponent,
    LoginComponent,
    RegisterComponent,
    NotfoundComponent,
    LoaderComponent,
    RatingComponent,
    StarComponent,
    ModalComponent,
    MapComponent,
    LogoutComponent,
    UsersComponent,
    ProfileComponent,
    EmptyComponent,
    OrganizationComponent,
    ConfirmComponent,
    OrganizationEntityComponent,
    AutofocusDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    Ng2SearchPipeModule,
    MaterializeModule,
    AppRoutingModule,
    NgxPaginationModule,
    HttpClientModule,
    RecaptchaModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: environment.whitelistedDomains
      },
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAjSGfR23-4NqNZC22NLTsixPYtOIWGFWQ'
    })
  ],
  providers: [
    AuthService,
    AuthGuardService,
    RoleGuardService,
    CardService,
    MessageService,
    DownloadListService,
    MapService,
    OrganizationService,
    HttpDownload,
    RatingService,
    CommentService,
    UserService,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: environment.reCaptcha } as RecaptchaSettings,
    },
    {
      provide: 'origin',
      useValue: window.location.origin
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
