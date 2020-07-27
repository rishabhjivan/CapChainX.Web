import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Config } from '@shared/services/config';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

}
