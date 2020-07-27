import { Component, OnInit } from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transfer-ledger-modal',
  templateUrl: './transfer-ledger-modal.component.html',
  styleUrls: ['./transfer-ledger-modal.component.scss']
})
export class TransferLedgerModalComponent implements OnInit {

  public transferAmount: number;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
