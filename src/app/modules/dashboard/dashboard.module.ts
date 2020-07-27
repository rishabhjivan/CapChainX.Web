import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from 'ngx-clipboard';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { AuthModule } from '@auth/auth.module';
import { SharedModule } from '@shared/shared.module';

import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { DashboardService } from './services/dashboard.service';
import { WalletReadyConfirmComponent } from './components/wallet-ready-confirm/wallet-ready-confirm.component';
import { TokensModule } from '@tokens/tokens.module';
import { AlertsModule } from '@alerts/alerts.module';
import { LedgerModule } from '@ledger/ledger.module';
import { ShowAddressModalComponent } from './components/show-address-modal/show-address-modal.component';

@NgModule({
  declarations: [
    MainDashboardComponent,
    WalletReadyConfirmComponent,
    ShowAddressModalComponent
  ],
  entryComponents: [WalletReadyConfirmComponent, ShowAddressModalComponent],
  imports: [
    DashboardRoutingModule,
    AuthModule,
    SharedModule,
    NgbModule.forRoot(),
    CommonModule,
    RouterModule,
    TokensModule,
    AlertsModule,
    LedgerModule,
    ClipboardModule
  ],
  providers: [
    DashboardService
  ]
})
export class DashboardModule { }
