import { Component, OnInit } from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wallet-ready-confirm',
  templateUrl: './wallet-ready-confirm.component.html',
  styleUrls: ['./wallet-ready-confirm.component.scss']
})
export class WalletReadyConfirmComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
