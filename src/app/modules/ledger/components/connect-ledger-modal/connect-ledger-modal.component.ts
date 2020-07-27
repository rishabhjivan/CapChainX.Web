import { Component, OnInit } from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from '@alerts/services/alerts.service';
import { LedgerService } from '@ledger/services/ledger.service';

@Component({
  selector: 'app-connect-ledger-modal',
  templateUrl: './connect-ledger-modal.component.html',
  styleUrls: ['./connect-ledger-modal.component.scss']
})
export class ConnectLedgerModalComponent implements OnInit {

  connecting: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private alertsService: AlertsService,
    private ledgerService: LedgerService
  ) { }

  ngOnInit() {
    this.connecting = false;
  }

  connect() {
    this.connecting = true;
    this.ledgerService.getAddress().then(
      addr => {
        this.connecting = false;
        this.activeModal.close();
      },
      err => {
        this.connecting = false;
        this.alertsService.dispatchError(err);
      }
    );
  }

}
