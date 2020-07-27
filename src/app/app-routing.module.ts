import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainDashboardComponent } from './modules/dashboard/components/main-dashboard/main-dashboard.component';
import { StyleguideComponent } from './styleguide/styleguide.component';
import { AuthGuardService as AuthGuard } from './modules/auth/services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: MainDashboardComponent, canActivate: [AuthGuard] },
  { path: 'styleguide', component: StyleguideComponent },
  { path: 'auth', loadChildren: './modules/auth/auth.module#AuthModule' },
  { path: 'tokens', loadChildren: './modules/tokens/tokens.module#TokensModule', canActivate: [AuthGuard] },
  { path: 'wallet', loadChildren: './modules/wallet/wallet.module#WalletModule', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
