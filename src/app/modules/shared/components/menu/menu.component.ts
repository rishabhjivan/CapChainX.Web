import { Component, OnInit } from '@angular/core';
import { Store, State } from '@ngrx/store';

import { AuthService } from '@auth/services/auth.service';
import { CompanyService } from './../../services/company.service';
import { Company } from '@shared/models/api/company';
import { TokenStatus } from '@tokens/services/token-status';
import { Config } from '../../services/config';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public company: Company;
  public activeStatus = TokenStatus.ACTIVE;
  public etherScanHistoryUrl = Config.ETHERSCAN_URL + "/address/";
  constructor(
    private companyService: CompanyService,
    private store: Store<any>) { }

  ngOnInit() {
    this.companyService.getCompanyState().subscribe(state => {
      this.company = state.entity;
    });
  }

}
