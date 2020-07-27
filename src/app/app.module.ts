import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { StyleguideComponent, NgbdModalContent } from './styleguide/styleguide.component';
import { SharedModule } from './modules/shared/shared.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuthModule } from './modules/auth/auth.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { alertsReducer } from './modules/alerts/reducer/alerts';
import { AuthInterceptor } from './modules/auth/services/auth.interceptor';
import { RequestInterceptor } from './modules/auth/services/request.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    StyleguideComponent,
    NgbdModalContent
  ],
  entryComponents: [NgbdModalContent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    HttpClientModule,
    StoreModule.forRoot(alertsReducer),
    SharedModule,
    DashboardModule,
    AuthModule,
    AlertsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
