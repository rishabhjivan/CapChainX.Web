import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LottieAnimationViewModule } from 'ng-lottie';
import { FileDropModule } from 'ngx-file-drop';
import { StoreModule } from '@ngrx/store';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { CompanyService } from './services/company.service';
import { PlatformConfigsService } from './services/platform-configs.service';
import { ValidationFeedbackComponent } from './components/validation-feedback/validation-feedback.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { TokenWaitComponent } from './components/token-wait/token-wait.component';
import { FeedbackModalComponent } from './components/feedback-modal/feedback-modal.component';
import { SafePipe } from './pipes/safe/safe.pipe';
import { ProgressIndicatorComponent } from './components/progress-indicator/progress-indicator.component';
import { PricingScheduleComponent } from './components/pricing-schedule/pricing-schedule.component';
import { UtilsService } from './services/utils.service';
import { ShortDatePipe } from './pipes/short-date/short-date.pipe';
import { TransferLedgerModalComponent } from './components/transfer-ledger-modal/transfer-ledger-modal.component';
import { TokenService } from './services/token.service';
import { WalletService } from './services/wallet.service';
import { ShortNumberPipe } from './pipes/short-number/short-number.pipe';
import { SalesProgressComponent } from './components/sales-progress/sales-progress.component';
import { MessageSpinnerComponent } from './components/message-spinner/message-spinner.component';
import { SafeHtmlPipe } from './pipes/safe-html/safe-html.pipe';
import { CustomMinValidatorDirective } from './directives/custom-min-validator.directive';
import { CustomMaxValidatorDirective } from './directives/custom-max-validator.directive';
import { companyReducer } from './reducers/company';
import { userReducer } from './reducers/user';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    MenuComponent,
    ValidationFeedbackComponent,
    DocumentUploadComponent,
    TokenWaitComponent,
    FeedbackModalComponent,
    SafePipe,
    ProgressIndicatorComponent,
    PricingScheduleComponent,
    ShortDatePipe,
    TransferLedgerModalComponent,
    ShortNumberPipe,
    SalesProgressComponent,
    MessageSpinnerComponent,
    SafeHtmlPipe,
    CustomMinValidatorDirective,
    CustomMaxValidatorDirective
  ],
  imports: [
    NgbModule.forRoot(),
    StoreModule.forFeature('company', companyReducer),
    StoreModule.forFeature('user', userReducer),
    LottieAnimationViewModule.forRoot(),
    FormsModule,
    CommonModule,
    RouterModule,
    FileDropModule,
    ClickOutsideModule
  ],
  exports : [
    FooterComponent,
    HeaderComponent,
    MenuComponent,
    ValidationFeedbackComponent,
    DocumentUploadComponent,
    TokenWaitComponent,
    FeedbackModalComponent,
    SafePipe,
    SafeHtmlPipe,
    ProgressIndicatorComponent,
    PricingScheduleComponent,
    ShortDatePipe,
    TransferLedgerModalComponent,
    ShortNumberPipe,
    SalesProgressComponent,
    MessageSpinnerComponent,
    CustomMinValidatorDirective,
    CustomMaxValidatorDirective
  ],
  providers: [
    CompanyService,
    PlatformConfigsService,
    UtilsService,
    TokenService,
    WalletService
  ],
  entryComponents: [FeedbackModalComponent, TransferLedgerModalComponent]
})
export class SharedModule { }
