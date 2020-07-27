import { Component, OnInit } from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tokens-tos-modal',
  templateUrl: './tokens-tos-modal.component.html',
  styleUrls: ['./tokens-tos-modal.component.scss']
})
export class TokensTosModalComponent implements OnInit {

  public tosAccepted: boolean = false;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
