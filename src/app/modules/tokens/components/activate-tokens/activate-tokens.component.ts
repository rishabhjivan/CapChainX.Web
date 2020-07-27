import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TokenService } from '@shared/services/token.service';
import { TokenStatus } from './../../services/token-status';
import { Token } from '@shared/models/api/token';
import { Document } from '@shared/models/api/document';
import { AuthService } from '@auth/services/auth.service';
import { DocumentStatus } from '@shared/services/document-status';

@Component({
  selector: 'app-activate-tokens',
  templateUrl: './activate-tokens.component.html',
  styleUrls: ['./activate-tokens.component.scss']
})
export class ActivateTokensComponent implements OnInit {

  public loadingTokens: boolean = true;
  public token: Token;
  public companyId: number;
  private docs: any = {
    articles_of_incorporation: null,
    corporate_by_laws: null,
    board_of_directors_agreement: null
  };
  constructor(private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    var id;
    this.companyId = this.authService.getUser().company_id;
    this.route.params.subscribe( params => {
      id = params.id;
      this.tokenService.getToken(id)
        .subscribe(token => {
          if (token.status == TokenStatus.NEEDS_VERIFICATION) {
            this.token = token;
            this.loadingTokens = false;
          } else if (token.status == TokenStatus.NEEDS_ASSIGNMENT
            || token.status == TokenStatus.ASSIGNMENT_IN_PROGRESS) {
            this.router.navigate([`/tokens/${id}/assign`]);
          } else {
            this.router.navigate([`/tokens`]);
          }
        });
    });
  }

  artOfIncUploaded(doc: Document) {
    this.token.articles_of_incorporation.path = doc.path;
    this.token.articles_of_incorporation.name = doc.name;
    this.docs.articles_of_incorporation = doc;
  }

  corpByLawsUploaded(doc: Document) {
    this.token.corporate_by_laws.path = doc.path;
    this.token.corporate_by_laws.name = doc.name;
    this.docs.corporate_by_laws = doc;
  }

  bodAgreeUploaded(doc: Document) {
    this.token.board_of_directors_agreement.path = doc.path;
    this.token.board_of_directors_agreement.name = doc.name;
    this.docs.board_of_directors_agreement = doc;
  }

  onActivate(doc: Document, docType: string) {
    this.tokenService.activateDocument(this.token.id, doc)
      .subscribe(document => {
        console.log(document);
      })
  }

  setDocInProgress(uploadedDocument) {
    if (uploadedDocument.status == DocumentStatus.NOT_YET_UPLOADED
      || uploadedDocument.status == DocumentStatus.REJECTED)
      uploadedDocument.status = DocumentStatus.IN_PROGRESS;
  }

  isDocumentUnverified(uploadedDocument) {
    return uploadedDocument.status == DocumentStatus.NOT_YET_UPLOADED
      || uploadedDocument.status == DocumentStatus.REJECTED;
  }

  doVerifyDocs() {
    if (this.docs.articles_of_incorporation && this.isDocumentUnverified(this.token.articles_of_incorporation)) {
      this.setDocInProgress(this.token.articles_of_incorporation);
      this.tokenService.activateDocument(this.token.id, this.token.articles_of_incorporation)
        .subscribe(document => {
          this.docs.articles_of_incorporation = null;
        });
    }
    if (this.docs.corporate_by_laws && this.isDocumentUnverified(this.token.corporate_by_laws)) {
      this.setDocInProgress(this.token.corporate_by_laws);
      this.tokenService.activateDocument(this.token.id, this.token.corporate_by_laws)
        .subscribe(document => {
          this.docs.corporate_by_laws = null;
        });
    }
    if (this.docs.board_of_directors_agreement && this.isDocumentUnverified(this.token.board_of_directors_agreement)) {
      this.setDocInProgress(this.token.board_of_directors_agreement);
      this.tokenService.activateDocument(this.token.id, this.token.board_of_directors_agreement)
        .subscribe(document => {
          this.docs.board_of_directors_agreement = null;
        });
    }
  }

  allDocsVerified() {
    return this.token.articles_of_incorporation.status == DocumentStatus.VERIFIED
      && this.token.corporate_by_laws.status == DocumentStatus.VERIFIED
      && this.token.board_of_directors_agreement.status == DocumentStatus.VERIFIED;
  }

  doActivateTokens(form) {
    if (this.token.articles_of_incorporation.status == DocumentStatus.VERIFIED
      && this.token.corporate_by_laws.status == DocumentStatus.VERIFIED
      && this.token.board_of_directors_agreement.status == DocumentStatus.VERIFIED)
    this.router.navigate([`/tokens/${this.token.id}/assign`]);
  }

}
