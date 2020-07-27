import { Action } from '@ngrx/store';
import { SET_USER } from '../actions/user';
import { UserStore } from '../stores/user';

const initialState = {
  entity: null
};

export function userReducer(
  state: UserStore = initialState,
  action
): UserStore {
  switch (action.type) {
    case SET_USER:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
