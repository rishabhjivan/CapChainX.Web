import { Component, OnInit, Input } from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { WalletTransaction } from '@shared/models/api/wallet-transaction';
import { LedgerService } from '@ledger/services/ledger.service';
import { WalletService } from '@shared/services/wallet.service';
import { SuggestedTrxParams } from '@shared/models/api/suggested-trx-params';
import { PlatformConfigsService } from '@shared/services/platform-configs.service';
import { PlatformConfigs } from '@shared/models/api/platform-configs';
import { FeedbackModalComponent } from '@shared/components/feedback-modal/feedback-modal.component';
import { AlertsService } from '@alerts/services/alerts.service';

@Component({
  selector: 'app-send-tokens-modal',
  templateUrl: './send-tokens-modal.component.html',
  styleUrls: ['./send-tokens-modal.component.scss']
})
export class SendTokensModalComponent implements OnInit {

  @Input() currency: string;
  @Input() tokenAddr: string;
  public deviceConnected: boolean = false;
  public deviceType: string;
  public model: WalletTransaction = new WalletTransaction;
  public trxParams: SuggestedTrxParams;
  public showAdvanced: boolean = false;
  public loading: boolean = true;
  public doConfirm: boolean = false;
  public sending: boolean = false;
  public confirming: boolean = false;

  constructor(public activeModal: NgbActiveModal,
    private ledgerService: LedgerService,
    private walletService: WalletService,
    private platformConfigsService: PlatformConfigsService,
    private modalService: NgbModal,
    private alertsService: AlertsService) { }

  ngOnInit() {
    this.model.data = '0x';
    this.loading = true;
    this.doConfirm = false;
    this.sending = false;
    this.confirming = false;
  }

  connectLedger() {
    this.deviceConnected = true;
    this.deviceType = "Ledger";
    this.loading = true;
    this.ledgerService.getAddress().then(
      addr => {
        this.walletService.getSuggestedTrxParams(this.currency).subscribe(params => {
          this.trxParams = params;
          this.model.gas_limit = this.trxParams.suggested_gas_limit;
          this.model.gas_price = this.trxParams.suggested_gas_price;
          this.model.nonce = this.trxParams.suggested_nonce;
          this.loading = false;
        }, trxerr => {
          this.deviceConnected = false;
          this.loading = false;
          this.alertsService.dispatchError('', trxerr);
        });
      },
      err => {
        this.deviceConnected = false;
        this.loading = false;
        this.alertsService.dispatchError(err);
      }
    );
  }

  createSendConfirm() {
    const modal = this.modalService.open(FeedbackModalComponent);
    modal.componentInstance.modalTitle = "Are you sure?";
    modal.componentInstance.bodyHtml = 'Are you sure you wish to confirm this transfer? This process is final and cannot be reversed.'
    modal.componentInstance.leftBtnLabel = "No";
    modal.componentInstance.rightBtnLabel = "Yes";
    return modal;
  }

  confirmSend(form) {
    if (!form.valid) return;
    this.doConfirm = true;
  }

  sendEther(form) {
    if (!form.valid) return;
    this.doConfirm = false;
    this.sending = true;
    this.model.currency = this.currency;
    this.confirming = true;
    this.ledgerService.signEthTx(this.model.toEthTransaction()).then(
      res => {
        this.confirming = false;
        this.model.tx_hash = res;
        this.walletService.postTransaction(this.model).subscribe(res => {
          this.sending = false;
          this.activeModal.close();
        }, err => {
          this.sending = false;
          this.activeModal.close();
        });
      },
      err => {
        this.confirming = false;
        this.sending = false;
        if (err && !JSON.stringify(err).includes("(0x6985)")) {
          this.alertsService.dispatchError(err);
        }
      }
    );
  }

  doSendTokens(form) {
    if (!form.valid) return;
    this.doConfirm = false;
    this.sending = true;
    this.model.currency = this.currency;
    this.platformConfigsService.getPlatformConfigs()
      .subscribe(configs => {
        this.confirming = true;
        this.ledgerService.signTokenTx(this.model, this.tokenAddr, configs.token_decimal).then(
          res => {
            this.confirming = false;
            this.model.tx_hash = res;
            this.walletService.postTransaction(this.model).subscribe(res => {
              this.sending = false;
              this.activeModal.close();
            }, err => {
              this.sending = false;
              this.activeModal.close();
            });
          },
          err => {
            this.confirming = false;
            this.sending = false;
            if (err && !JSON.stringify(err).includes("(0x6985)")) {
              this.alertsService.dispatchError(err);
            }
          }
        );
      });
  }

  connectMetamask() {
    this.deviceConnected = true;
    this.deviceType = "Metamask";
  }

}
