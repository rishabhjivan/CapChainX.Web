import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    AuthRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    CommonModule,
    SharedModule
  ],
  providers: [
    AuthService,
    AuthGuardService
  ]
})
export class AuthModule { }
