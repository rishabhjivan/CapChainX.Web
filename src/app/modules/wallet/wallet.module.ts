import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { MomentModule } from 'angular2-moment';

import { WalletRoutingModule } from './wallet-routing.module';
import { SharedModule } from '@shared/shared.module';

import { WalletMainComponent } from './components/wallet-main/wallet-main.component';
import { SendTokensModalComponent } from './components/send-tokens-modal/send-tokens-modal.component';
import { ReceiveTokensModalComponent } from './components/receive-tokens-modal/receive-tokens-modal.component';
import { TokensModule } from '@tokens/tokens.module';
import { LedgerModule } from '@ledger/ledger.module';

@NgModule({
  declarations: [
    WalletMainComponent,
    SendTokensModalComponent,
    ReceiveTokensModalComponent
  ],
  imports: [
    WalletRoutingModule,
    CommonModule,
    NgbModule.forRoot(),
    FormsModule,
    ClipboardModule,
    SharedModule,
    MomentModule,
    TokensModule,
    LedgerModule
  ],
  entryComponents: [
    SendTokensModalComponent,
    ReceiveTokensModalComponent
  ]
})
export class WalletModule { }
