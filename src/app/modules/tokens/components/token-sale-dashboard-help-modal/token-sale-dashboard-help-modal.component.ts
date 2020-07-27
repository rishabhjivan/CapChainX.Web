import { Component, OnInit } from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-token-sale-dashboard-help-modal',
  templateUrl: './token-sale-dashboard-help-modal.component.html',
  styleUrls: ['./token-sale-dashboard-help-modal.component.scss']
})
export class TokenSaleDashboardHelpModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
