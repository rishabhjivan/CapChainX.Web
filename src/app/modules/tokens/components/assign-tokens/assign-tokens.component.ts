import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TokenService } from '@shared/services/token.service';
import { TokenStatus } from './../../services/token-status';
import { Token } from '@shared/models/api/token';
import { FeedbackModalComponent } from '@shared/components/feedback-modal/feedback-modal.component';
import { AuthService } from '@auth/services/auth.service';
import { LedgerService } from '@ledger/services/ledger.service';
import { AlertsService } from '@alerts/services/alerts.service';
import { CompanyService } from '@shared/services/company.service';
import { ModalState } from '@shared/models/view/modal-state';

@Component({
  selector: 'app-assign-tokens',
  templateUrl: './assign-tokens.component.html',
  styleUrls: ['./assign-tokens.component.scss']
})
export class AssignTokensComponent implements OnInit, OnDestroy {

  public loadingTokens: boolean = true;
  public assigningTokens: boolean = false;
  public token: Token;
  public companyId: number;
  public keyProvider: string = "LedgerNanoS";
  public ethereumAddress: string = "";
  public tokenAssignHash: string;
  constructor(private tokenService: TokenService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal,
    private ledgerService: LedgerService,
    private alertsService: AlertsService) { }

  ngOnInit() {
    var id;
    this.companyId = this.authService.getUser().company_id;
    this.route.params.subscribe( params => {
      id = params.id;
      this.tokenService.getToken(id)
        .subscribe(token => {
          if (token.status == TokenStatus.NEEDS_ASSIGNMENT
            || token.status == TokenStatus.ASSIGNMENT_IN_PROGRESS) {
            this.token = token;
            this.loadingTokens = false;
            if (token.status == TokenStatus.ASSIGNMENT_IN_PROGRESS) {
              this.assigningTokens = true;
              this.tokenAssignHash = token.token_assignment_txnhash;
              this.pollTokenStatus(this.token.id);
            } else {
              this.assigningTokens = false;
            }
          } else {
            this.router.navigate([`/tokens`]);
          }
        });
    });
  }

  ngOnDestroy() {
    if (this.checkTokenStatusTO)
      clearTimeout(this.checkTokenStatusTO);
  }

  retrieveAddress() {
    if (this.keyProvider=='LedgerNanoS')
      this.ledgerService.getAddress().then(
        addr => {
          this.ethereumAddress = addr
        },
        err => {
          this.alertsService.dispatchError(err);
        }
      );
  }

  doAssignTokens(form) {
    if (this.ethereumAddress) {
      this.assigningTokens = true;
      this.tokenService.assignToken(this.ethereumAddress)
        .subscribe(company => {
          this.tokenAssignHash = company.token.token_assignment_txnhash;
          this.checkTokenStatus(company.token);
        }, err => {
          var errMsg = err.corporate_wallet_public_address ? err.corporate_wallet_public_address[0] : err;
          this.assigningTokens = false;
        });
    }
  }

  pollTokenStatus(id) {
    this.tokenService.getToken(id)
      .subscribe(token => {
        this.checkTokenStatus(token);
      });
  }

  finalModal: ModalState = new ModalState();
  checkTokenStatusTO: any;

  checkTokenStatus(token: Token) {
    if (token.status == TokenStatus.ACTIVE) {
      this.companyService.updateCompanyStateToken(token);
      if (!this.finalModal.open) {
        this.finalModal.modal = this.modalService.open(FeedbackModalComponent);
        this.finalModal.modal.componentInstance.modalTitle = "Token Setup Complete!";
        this.finalModal.modal.componentInstance.showClose = true;
        this.finalModal.modal.componentInstance.bodyHtml = 'Congratulations! You have succesfully completed setting up your tokens. Now what to do with the tokens is up to you. You can conduct a Token Sale or manually distribute them to your colleagues or investors.<br /><br />What do you want to do?'
        this.finalModal.modal.componentInstance.orLinkLabel = "Go to your Wallet";
        this.finalModal.modal.componentInstance.rightBtnLabel = "Let’s do an ICO";
        this.finalModal.modal.result.then((result) => {
          if (result)
            this.router.navigate([`/tokens/ico`]);
          else
            this.router.navigate([`/wallet`]);
        }, (reason) => {
          this.router.navigate([`/dashboard`]);
        });
      }
    } else {
      this.checkTokenStatusTO = setTimeout(() => {
        this.pollTokenStatus(token.id);
      }, 5000);
    }
  }

}
