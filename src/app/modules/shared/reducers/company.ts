import { Action } from '@ngrx/store';
import { SET_COMPANY } from '../actions/company';
import { CompanyStore } from '../stores/company';

const initialState = {
  entity: null
};

export function companyReducer(
  state: CompanyStore = initialState,
  action
): CompanyStore {
  switch (action.type) {
    case SET_COMPANY:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
