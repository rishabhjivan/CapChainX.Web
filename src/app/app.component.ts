import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

import { AuthService } from './modules/auth/services/auth.service';
import { CompanyService } from './modules/shared/services/company.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService,
    private companyService: CompanyService) { }

  ngOnInit() {
    this.authService.getUserState().subscribe(state => {
      if (state && state.entity) {
        this.companyService.getCompany(state.entity.company_id);
      }
    });
  }

  isSignedIn() {
    return this.authService.getUser();
  }
}
