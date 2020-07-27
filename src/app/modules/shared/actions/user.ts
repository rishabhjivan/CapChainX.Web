import { Action } from '@ngrx/store';
import { UserStore } from '../stores/user';

export const SET_USER = 'SET_USER';

export class SetUser implements Action {
  readonly type = SET_USER;
  constructor(public payload: UserStore) {}
}
