import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';
import { ClickOutsideModule } from 'ng-click-outside';

import { TokensRoutingModule } from './tokens-routing.module';
import { SharedModule } from '@shared/shared.module';

import { CreateTokenComponent } from './components/create-token/create-token.component';
import { CreateIcoComponent } from './components/create-ico/create-ico.component';
import { TokensTosModalComponent } from './components/tokens-tos-modal/tokens-tos-modal.component';
import { ActivateTokensComponent } from './components/activate-tokens/activate-tokens.component';
import { AssignTokensComponent } from './components/assign-tokens/assign-tokens.component';
import { CreateIcoConfirmComponent } from './components/create-ico-confirm/create-ico-confirm.component';
import { WalletModule } from '@wallet/wallet.module';
import { LedgerModule } from '@ledger/ledger.module';
import { TokenSaleDashboardHelpModalComponent } from './components/token-sale-dashboard-help-modal/token-sale-dashboard-help-modal.component';

/*

Stripe Test Keys
Publishable key:  pk_test_dmaTHWfkDAMvAkfIoNr5J5to
Secret key:  sk_test_L4gLf1tmCU16BiKLuLbLhOFd

*/

@NgModule({
  declarations: [
    CreateTokenComponent,
    CreateIcoComponent,
    TokensTosModalComponent,
    ActivateTokensComponent,
    AssignTokensComponent,
    CreateIcoConfirmComponent,
    TokenSaleDashboardHelpModalComponent
  ],
  entryComponents: [TokensTosModalComponent, CreateIcoConfirmComponent, TokenSaleDashboardHelpModalComponent],
  imports: [
    TokensRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    CommonModule,
    NgxStripeModule.forRoot('pk_test_6pRNASCoBOKtIshFeQd4XMUh'),
    SharedModule,
    ClickOutsideModule,
    LedgerModule
  ]
})
export class TokensModule { }
