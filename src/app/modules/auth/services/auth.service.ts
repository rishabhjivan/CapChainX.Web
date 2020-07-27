import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

import { User } from '@shared/models/api/user';
import { Login } from '@shared/models/view/login';
import { Config } from '@shared/services/config';
import { AuthToken } from '@shared/models/api/auth-token';
import { SetUser } from '@shared/actions/user';
import { SetCompany } from '@shared/actions/company';

@Injectable()
export class AuthService {

  private user;
  private cachedRequests: Array<HttpRequest<any>> = [];
  constructor(private http: HttpClient, private store: Store<any>) {
    store.select(state => state.user).subscribe(state => {
      if ((!state || !state.entity) && this.getUser()) {
        AuthService.returned.next({entity: this.getUser()});
      } else {
        AuthService.returned.next(state);
      }
    });
  }

  public static returned: BehaviorSubject<any> = new BehaviorSubject({
    entity: null
  });

  getUserState() {
    return AuthService.returned;
  }

  getUser() {
    return <User>JSON.parse(localStorage.getItem("AuthUser"));
  }

  public async signIn(login: Login): Promise<any> {
    const url = `${Config.API_ENDPOINT}api-token-auth/`;
    var res = await new Promise((resolve, reject) => {
      let response = this.http.post<AuthToken>(url, login).shareReplay();
      response.subscribe(
        res => {
          localStorage.setItem("AuthToken", res.token);
          const userUrl = `${Config.API_ENDPOINT}users/`;
          this.http.get<User>(userUrl).shareReplay().subscribe(
            userResp => {
              this.user = userResp;
              localStorage.setItem("AuthUser", JSON.stringify(this.user));
              this.store.dispatch(new SetUser({entity: userResp}));
              resolve(this.user);
            }
          );
        },
        err => {
          reject('You have entered the wrong username or password');
        }
      );
    }) as any;
    return res;
  }

  signOut() {
    localStorage.removeItem("AuthUser");
    localStorage.removeItem("AuthToken");
    this.store.dispatch(new SetUser({entity: null}));
    this.store.dispatch(new SetCompany({entity: null}));
  }

  public collectFailedRequest(request): void {
    this.cachedRequests.push(request);
  }

  public retryFailedRequests(): void {
    // retry the requests. this method can
    // be called after the token is refreshed
  }

}
