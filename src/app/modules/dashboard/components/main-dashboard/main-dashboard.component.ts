import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Chart } from 'chart.js';
import { Store, State } from '@ngrx/store';

import { AuthService } from '@auth/services/auth.service';
import { DashboardService } from './../../services/dashboard.service';
import { CompanyService } from '@shared/services/company.service';
import { Company } from '@shared/models/api/company';
import { WalletReadyConfirmComponent } from './../wallet-ready-confirm/wallet-ready-confirm.component';
import { WalletService } from '@shared/services/wallet.service';
import { Wallet } from '@shared/models/api/wallet';
import { TokenSale, TokenSaleStatus } from '@shared/models/api/token-sale';
import { TokenService } from '@shared/services/token.service';
import { TokenStatus } from '@tokens/services/token-status';
import { WalletTransaction } from '@shared/models/api/wallet-transaction';
import { PlatformConfigsService } from '@shared/services/platform-configs.service';
import { LedgerService } from '@ledger/services/ledger.service';
import { AlertsService } from '@alerts/services/alerts.service';
import { Config } from '@shared/services/config';
import { ShowAddressModalComponent } from '../show-address-modal/show-address-modal.component';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent implements OnInit, OnDestroy {

  public company: Company;
  public wallet: Wallet;
  public chart = [];
  public tokenSale: TokenSale;
  public tokenFinalizeStatus = 'Init';
  public showLedgerConfirm: boolean = false;
  public tokenSalesLoading: boolean = false;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('transferModal') transferModalDom: ElementRef;
  private initialized: boolean = false;
  private companySub: ISubscription;
  constructor(private dashboardService: DashboardService,
    private authService: AuthService,
    private companyService: CompanyService,
    private router: Router,
    private modalService: NgbModal,
    private platformConfigsService: PlatformConfigsService,
    private ledgerService: LedgerService,
    private walletService: WalletService,
    private tokenService: TokenService,
    private alertsService: AlertsService,
    private store: Store<any>) { }

  ngOnInit() {
    /*this.companyService.getCompany(this.authService.getUser().company_id)
      .subscribe(company => {
        this.company = company;
        this.onCompanySet();
      }, err => {
        this.alertsService.dispatchError('', err);
      });*/
    this.tokenSalesLoading = false;
    this.companySub = this.companyService.getCompanyState().subscribe(state => {
      this.company = state.entity;
      this.onCompanySet();
    });
    this.onCompanySet();
  }

  ngOnDestroy() {
    if (this.companySub)
      this.companySub.unsubscribe();
    if (this.checkTokenSaleTrxStatusTO)
      clearTimeout(this.checkTokenSaleTrxStatusTO);
  }

  onCompanySet() {
    if (this.company && this.company.token) {
      if (this.company.token.status == TokenStatus.ACTIVE) {
        this.walletService.getWallet()
          .subscribe(wallet => {
            this.wallet = wallet;
          }, err => {
            
          });
        if (this.company.token_sale_id) {
          this.tokenSalesLoading = true;
          this.tokenService.getTokenSale(this.company.token_sale_id).subscribe(
            (tokenSale) => {
              this.tokenSalesLoading = false;
              this.tokenSale = Object.assign(new TokenSale, tokenSale);
              if (this.tokenSale.status == TokenSaleStatus.FINALIZE_IN_PROGRESS) {
                this.tokenFinalizeStatus = 'Wait';
                this.modalService.open(this.transferModalDom);
                this.checkTokenSaleTrxStatus(this.tokenSale.id);
              }
              this.initChart();
            },
            (err) => {
              this.tokenSalesLoading = false;
            }
          );
        }
      } else {
        this.router.navigate(['/tokens/create']);
      }
    }
  }

  initChart() {
    if (this.canvas) {
      this.chart = new Chart(this.canvas.nativeElement.getContext('2d'), {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [
              this.tokenSale.total_raised,
              this.tokenSale.remaining_tokens
            ],
            backgroundColor: [
              '#006ab8',
              '#22c9ef',
            ],
            label: 'Dataset'
          }],
          labels: [
            'Tokens Sold',
            'Remaining Tokens'
          ]
        },
        options: {
          responsive: true,
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: false,
            text: 'Token Sales'
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    } else {
      setTimeout(() => {
        this.initChart();
      }, 1000);
    }
  }

  openWalletConfirm() {
    this.modalService.open(WalletReadyConfirmComponent).result.then((result) => {
      this.router.navigate(['/tokens/create']);
    }, (reason) => {
    });
  }

  goToICO() {
    this.router.navigate([`/tokens/${this.company.token.id}/ico`]);
  }

  openModal(modal) {
    this.tokenFinalizeStatus = 'Init';
    this.modalService.open(modal);
  }

  moveToWallet() {
    this.tokenFinalizeStatus = 'Wait';
    this.walletService.getSuggestedTrxParams(this.company.token.ticker).subscribe(trxParams => {
      this.platformConfigsService.getPlatformConfigs()
        .subscribe(configs => {
          var trx: WalletTransaction = new WalletTransaction;
          trx.currency = this.company.token.ticker;
          trx.from_address = this.company.corporate_wallet_public_address;
          trx.to_address = this.tokenSale.address;
          trx.data = '0x';
          trx.gas_limit = trxParams.suggested_gas_limit;
          trx.gas_price = trxParams.suggested_gas_price;
          trx.nonce = trxParams.suggested_nonce;
          trx.value = 0;
          this.showLedgerConfirm = true;
          this.ledgerService.signFinalizeSaleTx(trx, this.company.corporate_wallet_public_address, this.tokenSale.address, this.tokenSale.token_sale_params.token_sale_type).then(
            res => {
              this.showLedgerConfirm = false;
              trx.tx_hash = res;
              this.tokenService.updateTokenSale(this.tokenSale.id, {finalize_txnhash: res, status: TokenSaleStatus.FINALIZE_IN_PROGRESS}).subscribe(res => {
                this.tokenSale = Object.assign(new TokenSale, res);
                this.checkTokenSaleTrxStatus(this.tokenSale.id);
              }, err => {
                
              });
            },
            err => {
              this.showLedgerConfirm = false;
              this.tokenFinalizeStatus = 'Init';
              this.alertsService.dispatchError(err);
            }
          );
        }, cfgerr => {
          this.tokenFinalizeStatus = 'Init';
          this.alertsService.dispatchError('', cfgerr);
        });
    }, trxerr => {
      this.tokenFinalizeStatus = 'Init';
      this.alertsService.dispatchError('', trxerr);
    });
  }

  getEtherScanLink() {
    return Config.ETHERSCAN_URL + '/tx/' + this.tokenSale.finalize_txnhash;
  }

  checkTokenSaleTrxStatusTO: any;
  
  checkTokenSaleTrxStatus(tokenSaleId: number) {
    this.tokenService.getTokenSale(tokenSaleId).subscribe(tokenSaleUpdate => {
      this.tokenSale = Object.assign(new TokenSale, tokenSaleUpdate);
      if (tokenSaleUpdate.status == TokenSaleStatus.FINALIZED) {
        this.tokenFinalizeStatus = 'Done';
      }
      else {
        this.checkTokenSaleTrxStatusTO = setTimeout(() => {
          this.checkTokenSaleTrxStatus(tokenSaleId);
        }, 5000);
      }
    })
  }

  openTokenSaleModal() {
    const modal = this.modalService.open(ShowAddressModalComponent);
    modal.componentInstance.title = "Your Contract Address";
    modal.componentInstance.caption = "Share this with your investors to buy-in to your sale";
    modal.componentInstance.walletAddr = this.tokenSale.address;
  }

  openWalletModal() {
    const modal = this.modalService.open(ShowAddressModalComponent);
    modal.componentInstance.title = "Your Wallet Address";
    modal.componentInstance.walletAddr = this.company.corporate_wallet_public_address;
  }

}
