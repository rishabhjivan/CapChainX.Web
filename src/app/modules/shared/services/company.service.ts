import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/shareReplay';

import { Company } from './../models/api/company';
import { Config } from './../services/config';
import { SetCompany } from '../actions/company';
import { Token } from '../models/api/token';

@Injectable()
export class CompanyService {
  constructor(private http: HttpClient, private store: Store<any>) {
    store.select(state => state.company).subscribe(state => {
      CompanyService.returned.next(state);
    });
  }

  public static returned: BehaviorSubject<any> = new BehaviorSubject({
    entity: null
  });

  getCompanyState() {
    return CompanyService.returned;
  }

  getCompany(id: number): Observable<Company> {
    const url = `${Config.API_ENDPOINT}companies/${id}/`;
    let resp = this.http.get<Company>(url).shareReplay();
    resp.subscribe(
      co => {
        this.store.dispatch(new SetCompany({entity: co}));
      }
    );
    return resp;
  }

  updateCompanyStateToken(token: Token) {
    this.store.select(state => state.company).subscribe(state => {
      state.entity.token = token;
      CompanyService.returned.next(state);
    });
  }

}
