import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SendTokensModalComponent } from '../send-tokens-modal/send-tokens-modal.component';
import { CompanyService } from '@shared/services/company.service';
import { Company } from '@shared/models/api/company';
import { AuthService } from '@auth/services/auth.service';
import { WalletService } from '@shared/services/wallet.service';
import { Wallet } from '@shared/models/api/wallet';
import { WalletTransaction } from '@shared/models/api/wallet-transaction';
import { WalletTransactionStatus } from '../../services/wallet-transaction-status';
import { ReceiveTokensModalComponent } from '../receive-tokens-modal/receive-tokens-modal.component';
import { Config } from '@shared/services/config';

@Component({
  selector: 'app-wallet-main',
  templateUrl: './wallet-main.component.html',
  styleUrls: ['./wallet-main.component.scss']
})
export class WalletMainComponent implements OnInit, OnDestroy {

  public company: Company;
  public walletAddr: string;
  public wallet: Wallet;
  public transactions: WalletTransaction[];
  public loading = true;
  public etherScanHistoryUrl = "";

  constructor(private authService: AuthService,
    private companyService: CompanyService,
    private walletService: WalletService,
    private modalService: NgbModal,
    private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.etherScanHistoryUrl = Config.ETHERSCAN_URL + "/tx/";
    this.companyService.getCompany(this.authService.getUser().company_id)
      .subscribe(company => {
        this.company = company;
        this.walletAddr = company.corporate_wallet_public_address;
        this.fetchTransactions(false);
      });
  }

  ngOnDestroy() {
    if (this.fetchTransactionsTO)
      clearTimeout(this.fetchTransactionsTO);
  }

  fetchTransactionsTO: any;
  
  fetchTransactions(expectNew: boolean) {
    this.walletService.getWallet()
      .subscribe(wallet => {
        this.wallet = wallet;
        this.loading = false;
      }, err => {
        this.router.navigate(['/dashboard']);
      });
    this.walletService.getTransactions()
      .subscribe(arr => {
        this.transactions = arr;
        const inProg = this.transactions.filter(trx => trx.status == WalletTransactionStatus.IN_PROGRESS).length;
        if (expectNew && inProg)
          expectNew = false;
        if (expectNew && !inProg || !expectNew && inProg) {
          this.fetchTransactionsTO = setTimeout(() => {
            this.fetchTransactions(expectNew);
          }, 5000);
        }
      });
  }

  getTransactionStatusLabel(statusKey) {
    return WalletTransactionStatus[statusKey];
  }

  sendTokens() {
    const modal = this.modalService.open(SendTokensModalComponent);
    modal.componentInstance.currency = this.company.token.ticker;
    modal.componentInstance.tokenAddr = this.company.token.address;
    modal.componentInstance.model.from_address = this.walletAddr;
    modal.result.then((result) => {
      this.fetchTransactions(true);
    }, (reason) => {
    });
  }

  sendEther() {
    const modal = this.modalService.open(SendTokensModalComponent);
    modal.componentInstance.currency = "ETH";
    modal.componentInstance.tokenAddr = this.company.token.address;
    modal.componentInstance.model.from_address = this.walletAddr;
    modal.result.then((result) => {
      this.fetchTransactions(true);
    }, (reason) => {
    });
  }

  receiveTokens() {
    const modal = this.modalService.open(ReceiveTokensModalComponent);
    modal.componentInstance.currency = this.company.token.ticker;
    modal.componentInstance.walletAddr = this.walletAddr;
    modal.result.then((result) => {
      
    }, (reason) => {
    });
  }

  receiveEther() {
    const modal = this.modalService.open(ReceiveTokensModalComponent);
    modal.componentInstance.currency = "ETH";
    modal.componentInstance.walletAddr = this.walletAddr;
    modal.result.then((result) => {
      
    }, (reason) => {
    });
  }

}
