import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthService } from '@auth/services/auth.service';
import { Config } from './config';
import { Wallet } from '../models/api/wallet';
import { WalletTransaction } from '../models/api/wallet-transaction';
import { SuggestedTrxParams } from '../models/api/suggested-trx-params';

@Injectable()
export class WalletService {

  constructor(private authService: AuthService,
    private http: HttpClient) { }

  getWallet(): Observable<Wallet> {
    var companyId = this.authService.getUser().company_id;
    const url = `${Config.API_ENDPOINT}companies/${companyId}/wallet/`;
    return this.http.get<Wallet>(url);
  }

  getTransactions(): Observable<WalletTransaction[]> {
    var companyId = this.authService.getUser().company_id;
    const url = `${Config.API_ENDPOINT}companies/${companyId}/wallet/transactions/`;
    return this.http.get<WalletTransaction[]>(url);
  }

  getSuggestedTrxParams(currency): Observable<SuggestedTrxParams> {
    var companyId = this.authService.getUser().company_id;
    const url = `${Config.API_ENDPOINT}companies/${companyId}/wallet/suggested_txn_params?currency=${currency}`;
    return this.http.get<SuggestedTrxParams>(url);
  }

  postTransaction(trx: WalletTransaction): Observable<WalletTransaction> {
    var companyId = this.authService.getUser().company_id;
    const url = `${Config.API_ENDPOINT}companies/${companyId}/wallet/transactions/`;
    return this.http.post<WalletTransaction>(url, trx);
  }

}
