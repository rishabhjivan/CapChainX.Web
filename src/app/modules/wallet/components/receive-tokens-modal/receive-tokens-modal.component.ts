import { Component, OnInit, Input } from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-receive-tokens-modal',
  templateUrl: './receive-tokens-modal.component.html',
  styleUrls: ['./receive-tokens-modal.component.scss']
})
export class ReceiveTokensModalComponent implements OnInit {

  @Input() currency: string;
  @Input() walletAddr: string;
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  onAddrCopied() {
    
  }

}
