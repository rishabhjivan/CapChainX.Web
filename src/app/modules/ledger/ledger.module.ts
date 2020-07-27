import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LedgerService } from './services/ledger.service';
import { ConnectLedgerModalComponent } from './components/connect-ledger-modal/connect-ledger-modal.component';
import { LedgerConfirmTrxComponent } from './components/ledger-confirm-trx/ledger-confirm-trx.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ConnectLedgerModalComponent, LedgerConfirmTrxComponent],
  exports: [ConnectLedgerModalComponent, LedgerConfirmTrxComponent],
  providers: [LedgerService],
  entryComponents: [ConnectLedgerModalComponent]
})
export class LedgerModule { }
