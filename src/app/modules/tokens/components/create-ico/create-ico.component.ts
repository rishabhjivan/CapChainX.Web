import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { NgbModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TokenSaleParams, TokenSaleBehavior, TokenSaleParamsView, TokenSaleTierView, TokenSaleTier, TokenSale, TokenSaleStatus } from '@shared/models/api/token-sale';
import { NgbLongDateParserFormatter, CustomDateStruct } from '@shared/formatters/ngb-date-parser-formatters';
import { TokenService } from '@shared/services/token.service';
import { CreateIcoConfirmComponent } from '../create-ico-confirm/create-ico-confirm.component';
import { Company } from '@shared/models/api/company';
import { AuthService } from '@auth/services/auth.service';
import { CompanyService } from '@shared/services/company.service';
import { ConnectLedgerModalComponent } from '@ledger/components/connect-ledger-modal/connect-ledger-modal.component';
import { TransferLedgerModalComponent } from '@shared/components/transfer-ledger-modal/transfer-ledger-modal.component';
import { LedgerService } from '@ledger/services/ledger.service';
import { WalletTransaction } from '@shared/models/api/wallet-transaction';
import { WalletService } from '@shared/services/wallet.service';
import { PlatformConfigsService } from '@shared/services/platform-configs.service';
import { FeedbackModalComponent } from '@shared/components/feedback-modal/feedback-modal.component';
import { UtilsService } from '@shared/services/utils.service';
import * as moment from 'moment';
import { AlertsService } from '@alerts/services/alerts.service';
import { TokenSaleDashboardHelpModalComponent } from '../token-sale-dashboard-help-modal/token-sale-dashboard-help-modal.component';
import { ModalState } from '@shared/models/view/modal-state';

@Component({
  selector: 'app-create-ico',
  templateUrl: './create-ico.component.html',
  styleUrls: ['./create-ico.component.scss'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbLongDateParserFormatter}]
})
export class CreateIcoComponent implements OnInit, OnDestroy {

  public model: TokenSaleParamsView;
  public behavior: TokenSaleBehavior;
  public company: Company;
  public creatingIco: boolean = false;
  public transferringTokens: boolean = false;
  public saleComplete: boolean = false;
  public loading = true;
  private saleTypeResponse: any;
  public fetchingSaleType: boolean = false;
  public creationHash: string;
  public transferHash: string;
  public icoFormPosted: boolean = false;
  @ViewChild('ledgerConfirmBlock') ledgerConfirmModalDom: ElementRef;
  constructor(private tokenService: TokenService,
    private modalService: NgbModal,
    private authService: AuthService,
    private companyService: CompanyService,
    private ledgerService: LedgerService,
    private walletService: WalletService,
    private platformConfigsService: PlatformConfigsService,
    private router: Router,
    private alertsService: AlertsService) { }

  ngOnInit() {
    this.loading = true;
    this.creatingIco = false;
    this.transferringTokens = false;
    this.saleTypeResponse = null;
    this.fetchingSaleType = false;
    this.icoFormPosted = false;
    this.model = new TokenSaleParamsView;
    this.companyService.getCompany(this.authService.getUser().company_id)
      .subscribe(company => {
        this.company = company;
        if (this.company.token_sale_id) {
          this.tokenService.getTokenSale(this.company.token_sale_id).subscribe((tokenSale) => {
            this.loading = false;
            if (tokenSale.status == TokenSaleStatus.CREATION_IN_PROGRESS) {
              this.creatingIco = true;
              this.creationHash = tokenSale.token_sale_creation_txnhash;
              this.checkTokenSaleStatus(tokenSale);
            } else if (tokenSale.status == TokenSaleStatus.NEEDS_TOKENS) {
              this.creatingIco = true;
              this.onNeedTokens(tokenSale);
            } else if (tokenSale.status == TokenSaleStatus.ASSIGNMENT_IN_PROGRESS) {
              this.transferringTokens = true;
              this.checkTokenSaleTrxStatus(tokenSale.id);
            } else {
              this.onTokensReady();
            }
          });
        } else {
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    if (this.checkTokenSaleStatusTO)
      clearTimeout(this.checkTokenSaleStatusTO);
    if (this.checkTokenSaleTrxStatusTO)
      clearTimeout(this.checkTokenSaleTrxStatusTO);
  }

  startDateSelected(ev) {
    const today = moment(new Date());
    if (CustomDateStruct.ToMoment(this.model.start_date).isBefore(today))
      this.model.start_date = CustomDateStruct.FromMoment(today);
    if (this.model.end_date)
      this.validateEndDate();
  }

  endDateSelected(ev) {
    if (this.model.start_date)
      this.validateEndDate();
    else {
      const today = moment(new Date());
      if (CustomDateStruct.ToMoment(this.model.end_date).isBefore(today))
        this.model.end_date = CustomDateStruct.FromMoment(today.add(1, 'day'));
    }
  }

  validateEndDate() {
    if (!CustomDateStruct.ToMoment(this.model.end_date).isAfter(CustomDateStruct.ToMoment(this.model.start_date)))
      this.model.end_date = CustomDateStruct.FromMoment(CustomDateStruct.ToMoment(this.model.start_date).add(1, 'day'));
  }

  onSaleTypeClick(type, form) {
    if (!form.valid) {
      this.alertsService.dispatchError('Please fill in all the required information');
      return;
    }
    this.icoFormPosted = false;
    this.model.token_sale_type = type;
    this.fetchingSaleType = true;
    this.tokenService.getSuggestedTokenSaleParams(this.model.toTokenSaleParams()).subscribe(
      res => {
        this.icoFormPosted = true;
        this.saleTypeResponse = res;
        this.model.token_price = UtilsService.toCurrency(res.token_price);
        if (type == 'tiered') {
          this.model.num_rounds = res.num_rounds;
          this.model.token_sale_tiers = new Array<TokenSaleTierView>();
          res.token_sale_tiers.forEach(element => {
            this.model.token_sale_tiers.push(TokenSaleTier.toTokenSaleTierView(element));
          });
        }
        this.tokenService.getTokenSaleBehavior(this.model.toTokenSaleParams()).subscribe(res => {
          this.behavior = res;
        });
        this.fetchingSaleType = false;
      }, err => {
        this.fetchingSaleType = false;
        if (this.model.token_sale_tiers && this.model.token_sale_tiers.length) {
          this.icoFormPosted = true;
        }
        if (err.status == 412) {
          const days = this.model.num_rounds ? this.model.num_rounds : 5;
          this.alertsService.dispatchError(`The duration of the sale should be at least ${days} days`);
        } else {
          this.alertsService.dispatchError('', err);
        }
      }
    );
  }

  updateNumRounds(form) {
    if (this.model.num_rounds != this.saleTypeResponse.num_rounds) {
      const modal = this.modalService.open(FeedbackModalComponent);
      modal.componentInstance.modalTitle = "Are you sure!";
      modal.componentInstance.showClose = false;
      modal.componentInstance.bodyHtml = 'Changing the number of rounds will erase any custom values that you may have entered. Are you sure you wish to continue?'
      modal.componentInstance.leftBtnLabel = "No";
      modal.componentInstance.rightBtnLabel = "Yes";
      modal.result.then((result) => {
        if (result) {
          this.onSaleTypeClick('tiered', form);
        } else {
          this.model.num_rounds = this.saleTypeResponse.num_rounds;
        }
      }, (reason) => {
        this.model.num_rounds = this.saleTypeResponse.num_rounds;
      });
    }
  }

  onTieredSave(params: TokenSaleParamsView) {
    this.model.start_date = params.start_date;
    this.model.end_date = params.end_date;
    for (var i = 0; i < this.model.token_sale_tiers.length; i++) {
      this.model.token_sale_tiers[i].start_date = params.token_sale_tiers[i].start_date;
      this.model.token_sale_tiers[i].token_discount = params.token_sale_tiers[i].token_discount;
    }
    this.tokenService.getTokenSaleBehavior(this.model.toTokenSaleParams()).subscribe(res => {
      this.behavior = res;
    });
  }

  doSetup(form) {
    if (!form.valid || !this.model.token_sale_type) return;
    this.modalService.open(CreateIcoConfirmComponent).result.then((result) => {
      this.creatingIco = true;
      this.tokenService.postTokenSale({token_sale_params: this.model.toTokenSaleParams()}).subscribe(tokenSale => {
        this.creationHash = tokenSale.token_sale_creation_txnhash;
        this.companyService.getCompany(this.company.id);
        this.checkTokenSaleStatus(tokenSale);
      });
    }, (reason) => {
      this.creatingIco = false;
    });
  }

  checkTokenSaleStatusTO: any;

  checkTokenSaleStatus(tokenSale: TokenSale) {
    if (tokenSale.status == TokenSaleStatus.NEEDS_TOKENS) {
      this.companyService.getCompany(this.company.id);
      this.onNeedTokens(tokenSale);
    }
    else {
      const tokenSaleId = tokenSale.id;
      this.checkTokenSaleStatusTO = setTimeout(() => {
        this.tokenService.getTokenSale(tokenSaleId).subscribe(tokenSaleUpdate => {
          this.checkTokenSaleStatus(tokenSaleUpdate);
        })
      }, 5000);
    }
  }

  checkTokenSaleTrxStatusTO: any;

  checkTokenSaleTrxStatus(tokenSaleId: number) {
    this.tokenService.getTokenSale(tokenSaleId).subscribe(tokenSaleUpdate => {
      this.transferHash = tokenSaleUpdate.token_transfer_txnhash;
      if (tokenSaleUpdate.status == TokenSaleStatus.READY) {
        this.onTokensReady();
      }
      else {
        this.checkTokenSaleTrxStatusTO = setTimeout(() => {
          this.checkTokenSaleTrxStatus(tokenSaleId);
        }, 5000);
      }
    })
  }

  onNeedTokens(tokenSale: TokenSale) {
    this.modalService.open(ConnectLedgerModalComponent).result.then((result) => {
      this.openTransferModal(tokenSale);
    }, (reason) => {

    });
  }

  openTransferModal(tokenSale: TokenSale) {
    const transferModal = this.modalService.open(TransferLedgerModalComponent);
    transferModal.componentInstance.transferAmount = tokenSale.token_sale_params.num_tokens_for_sale;
    transferModal.result.then((result) => {
      this.doTokenTransfer(tokenSale);
    }, (reason) => {

    });
  }

  doTokenTransfer(tokenSale: TokenSale) {
    this.creatingIco = false;
    this.transferringTokens = true;
    this.walletService.getSuggestedTrxParams(this.company.token.ticker).subscribe(trxParams => {
      this.platformConfigsService.getPlatformConfigs()
        .subscribe(configs => {
          var trx: WalletTransaction = new WalletTransaction;
          trx.currency = this.company.token.ticker;
          trx.from_address = this.company.corporate_wallet_public_address;
          trx.to_address = tokenSale.address;
          trx.data = '0x';
          trx.gas_limit = trxParams.suggested_gas_limit;
          trx.gas_price = trxParams.suggested_gas_price;
          trx.nonce = trxParams.suggested_nonce;
          trx.value = tokenSale.token_sale_params.num_tokens_for_sale;
          let confirmModal = this.modalService.open(this.ledgerConfirmModalDom);
          this.ledgerService.signTokenTx(trx, this.company.token.address, configs.token_decimal).then(
            res => {
              confirmModal.close();
              trx.tx_hash = res;
              this.tokenService.postTokenSaleTransaction(trx, tokenSale.id).subscribe(res => {
                this.companyService.getCompany(this.company.id);
                this.checkTokenSaleTrxStatus(tokenSale.id);
              }, err => {
                
              });
            },
            err => {
              confirmModal.close();
              this.openTransferModal(tokenSale);
              if (err && !JSON.stringify(err).includes("(0x6985)")) {
                this.alertsService.dispatchError(err);
              }
              this.creatingIco = true;
              this.transferringTokens = false;
            }
          );
        });
    });
  }

  finalModal: ModalState = new ModalState();

  onTokensReady() {
    this.transferringTokens = false;
    this.saleComplete = true;
    if (!this.finalModal.open) {
      this.finalModal.modal = this.modalService.open(FeedbackModalComponent);
      this.finalModal.modal.componentInstance.modalTitle = "ICO Setup Complete!";
      this.finalModal.modal.componentInstance.showClose = false;
      this.finalModal.modal.componentInstance.bodyHtml = 'Congratulations! You have succesfully completed setting up your ICO. Refer to your dashboard to monitor your token sales. Use your wallet to send and receive tokens and Ether.<br /><br />What do you want to do?'
      this.finalModal.modal.componentInstance.orLinkLabel = "Go to your Wallet";
      this.finalModal.modal.componentInstance.rightBtnLabel = "Exit to Dashboard";
      this.finalModal.modal.result.then((result) => {
        if (result) {
          this.modalService.open(TokenSaleDashboardHelpModalComponent);
          this.companyService.getCompany(this.company.id);
          this.router.navigate([`/dashboard`]);
        } else
          this.router.navigate([`/wallet`]);
      }, (reason) => {
      });
    }
  }

}
