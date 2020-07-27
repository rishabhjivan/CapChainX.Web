import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from "ngx-stripe";

import { TokensTosModalComponent } from './../tokens-tos-modal/tokens-tos-modal.component';
import { NewToken } from '@shared/models/view/new-token';
import { TokenService } from '@shared/services/token.service';
import { TokenStatus } from './../../services/token-status';
import { PlatformConfigsService } from '@shared/services/platform-configs.service';
import { PlatformConfigs } from '@shared/models/api/platform-configs';
import { CompanyService } from '@shared/services/company.service';
import { AuthService } from '@auth/services/auth.service';
import { FeedbackModalComponent } from '@shared/components/feedback-modal/feedback-modal.component';
import { AlertsService } from '@alerts/services/alerts.service';

@Component({
  selector: 'app-create-token',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.scss']
})
export class CreateTokenComponent implements OnInit, OnDestroy {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  public model: NewToken;
  public configs: PlatformConfigs;
  public numTokens: number;
  public creatingTokens: boolean = false;
  public loadingTokens: boolean = true;
  public cardErrors;
  public tokenCreationHash: string = "";
  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#495056',
        color: '#495056',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#ccc'
        }
      }
    }
  };
  constructor(private tokenService: TokenService,
    private router: Router,
    private modalService: NgbModal,
    private stripeService: StripeService,
    private platformConfigsService: PlatformConfigsService,
    private companyService: CompanyService,
    private authService: AuthService,
    private alertsService: AlertsService) { }

  ngOnInit() {
    this.model = new NewToken;
    this.companyService.getCompany(this.authService.getUser().company_id)
      .subscribe(company => {
        if (company.token) {
          if (company.token.status == TokenStatus.CREATION_IN_PROGRESS) {
            this.loadingTokens = false;
            this.creatingTokens = true;
            this.tokenCreationHash = company.token.token_creation_txnhash;
            setTimeout(() => {
              this.pollTokenStatus(company.token.id);
            }, 5000);
          } else if (company.token.status == TokenStatus.NEEDS_VERIFICATION
            || company.token.status == TokenStatus.VERIFICATION_IN_PROGRESS) {
            this.router.navigate([`/tokens/${company.token.id}/activate`]);
          } else if (company.token.status == TokenStatus.NEEDS_ASSIGNMENT
            || company.token.status == TokenStatus.ASSIGNMENT_IN_PROGRESS) {
            this.router.navigate([`/tokens/${company.token.id}/assign`]);
          } else if (company.token.status == TokenStatus.ACTIVE) {
            this.router.navigate(['/dashboard']);
          } else if (company.token.status == TokenStatus.CREATION_FAILED) {
            console.log("Failed to create tokens");
          }
        } else {
          this.platformConfigsService.getPlatformConfigs()
            .subscribe(configs => {
              this.configs = configs;
              if (this.model.equity_percentage_to_tokenize)
                this.setNumTokens(this.model.equity_percentage_to_tokenize);
              this.model.name = company.name;
              this.model.ticker = company.name.substring(0, 3).toUpperCase();
              this.loadingTokens = false;
            });
        }
      });
  }

  ngOnDestroy() {
    if (this.pollTokenStatusTO)
      clearTimeout(this.pollTokenStatusTO);
  }

  setNumTokens(percentage_to_tokenize) {
    this.numTokens = percentage_to_tokenize ?
      Math.round((percentage_to_tokenize / 0.01) * this.configs.tokens_per_basis_point) :
      0;
  }

  doCreateTokens(form) {
    if (!form.valid) return;
    this.modalService.open(TokensTosModalComponent, { backdrop:'static', size:'lg' }).result.then((result) => {
      this.creatingTokens = true;
      this.cardErrors = null;
      this.stripeService
        .createToken(this.card.getCard(), { })
        .subscribe(result => {
          if (result.token) {
            // Use the token to create a charge or a customer
            // https://stripe.com/docs/charges
            this.model.stripe_token_id = result.token.id;
            this.tokenService.postToken(this.model).subscribe(token => {
              this.tokenCreationHash = token.token_creation_txnhash;
              this.companyService.updateCompanyStateToken(token);
              if (token.status == TokenStatus.NEEDS_VERIFICATION) {
                this.router.navigate([`/tokens/${token.id}/activate`]);
              } else {
                setTimeout(() => {
                  this.pollTokenStatus(token.id);
                }, 5000);
              }
            }, error => {
              this.creatingTokens = false;
              this.alertsService.dispatchError(error.message);
            });
          } else if (result.error) {
            // Error creating the token
            this.cardErrors = result.error;
            this.creatingTokens = false;
            console.log(result.error.message);
          }
        });
    }, (reason) => {
    });
    return false;
  }

  pollTokenStatusTO: any;
  
  pollTokenStatus(id) {
    this.tokenService.getToken(id)
      .subscribe(token => {
        if (token.status == TokenStatus.NEEDS_VERIFICATION) {
          this.companyService.updateCompanyStateToken(token);
          this.router.navigate([`/tokens/${id}/activate`]);
        } else {
          this.pollTokenStatusTO = setTimeout(() => {
            this.pollTokenStatus(id);
          }, 5000);
        }
      });
  }

  cancelCreate() {
    const modal = this.modalService.open(FeedbackModalComponent);
    modal.componentInstance.modalTitle = "Are you sure you want to cancel?";
    modal.componentInstance.showClose = true;
    modal.componentInstance.bodyHtml = 'By cancelling, any data you have input will not be saved. Click Yes if you want to cancel. Otherwise, click No to continue creation process.'
    modal.componentInstance.leftBtnLabel = "No";
    modal.componentInstance.rightBtnLabel = "Yes";
    modal.result.then((result) => {
      if (result)
        this.router.navigate([`/dashboard`]);
    }, (reason) => {
    });
  }

}
