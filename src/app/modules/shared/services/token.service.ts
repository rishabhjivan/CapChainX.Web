import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthService } from '@auth/services/auth.service';
import { Token } from './../models/api/token';
import { NewToken } from './../models/view/new-token';
import { Config } from './config';
import { Document } from './../models/api/document';
import { Company } from '../models/api/company';
import { TokenSaleParams, TokenSaleBehavior, TokenSale } from '../models/api/token-sale';
import { UtilsService } from './utils.service';
import { WalletTransaction } from '../models/api/wallet-transaction';

@Injectable()
export class TokenService {

  private token;
  constructor(private authService: AuthService,
    private http: HttpClient) { }
  
  getToken(id: number): Observable<Token> {
    var companyId = this.authService.getUser().company_id;
    const url = `${Config.API_ENDPOINT}companies/${companyId}/tokens/${id}/`;
    return this.http.get<Token>(url);
  }

  postToken(token: NewToken): Observable<Token> {
    var companyId = this.authService.getUser().company_id;
    const url = `${Config.API_ENDPOINT}companies/${companyId}/tokens/`;
    return this.http.post<Token>(url, token);
  }

  activateDocument(tokenId: number, doc: Document) {
    var companyId = this.authService.getUser().company_id;
    const url = `${Config.API_ENDPOINT}companies/${companyId}/tokens/${tokenId}/documents/${doc.id}/`;
    return this.http.put<Document>(url, doc);
  }

  assignToken(corporate_wallet_public_address: string) {
    var companyId = this.authService.getUser().company_id;
    const url = `${Config.API_ENDPOINT}companies/${companyId}/`;
    return this.http.put<Company>(url, { corporate_wallet_public_address: corporate_wallet_public_address });
  }
  
  getSuggestedTokenSaleParams(saleParams: TokenSaleParams): Observable<TokenSaleParams> {
    var companyId = this.authService.getUser().company_id;
    const url = `${Config.API_ENDPOINT}companies/${companyId}/tokensales/suggested_params`;
    const httpParams: HttpParams = UtilsService.convertToHttpParams(saleParams);
    return this.http.get<TokenSaleParams>(url, { params: httpParams });
  }
  
  getTokenSaleBehavior(saleParams: TokenSaleParams): Observable<TokenSaleBehavior> {
    var companyId = this.authService.getUser().company_id;
    const url = `${Config.API_ENDPOINT}companies/${companyId}/tokensales/sale_behavior/`;
    return this.http.post<TokenSaleBehavior>(url, saleParams);
  }
  
  postTokenSale(saleParams: any): Observable<TokenSale> {
    var companyId = this.authService.getUser().company_id;
    const url = `${Config.API_ENDPOINT}companies/${companyId}/tokensales/`;
    return this.http.post<TokenSale>(url, saleParams);
  }

  postTokenSaleTransaction(trx: WalletTransaction, saleId: number): Observable<WalletTransaction> {
    var companyId = this.authService.getUser().company_id;
    const url = `${Config.API_ENDPOINT}companies/${companyId}/tokensales/${saleId}/transfertxn/`;
    return this.http.post<WalletTransaction>(url, trx);
  }
  
  getTokenSale(saleId: number): Observable<TokenSale> {
    var companyId = this.authService.getUser().company_id;
    const url = `${Config.API_ENDPOINT}companies/${companyId}/tokensales/${saleId}/`;
    return this.http.get<TokenSale>(url);
  }
  
  updateTokenSale(saleId: number, model: any): Observable<TokenSale> {
    var companyId = this.authService.getUser().company_id;
    const url = `${Config.API_ENDPOINT}companies/${companyId}/tokensales/${saleId}/`;
    return this.http.put<TokenSale>(url, model);
  }

}
