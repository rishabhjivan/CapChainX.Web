import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { PlatformConfigs } from './../models/api/platform-configs';
import { Config } from './../services/config';

@Injectable()
export class PlatformConfigsService {

  private platformConfigs: PlatformConfigs;
  constructor(private http: HttpClient) { }

  getPlatformConfigs(): Observable<PlatformConfigs> {
    const url = `${Config.API_ENDPOINT}platform_configs/`;
    return this.http.get<PlatformConfigs>(url);
  }

}
