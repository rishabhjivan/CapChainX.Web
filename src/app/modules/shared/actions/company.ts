import { Action } from '@ngrx/store';
import { CompanyStore } from '../stores/company';

export const SET_COMPANY = 'SET_COMPANY';

export class SetCompany implements Action {
  readonly type = SET_COMPANY;
  constructor(public payload: CompanyStore) {}
}
