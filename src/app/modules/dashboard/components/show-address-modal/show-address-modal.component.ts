import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Config } from '@shared/services/config';

@Component({
  selector: 'app-show-address-modal',
  templateUrl: './show-address-modal.component.html',
  styleUrls: ['./show-address-modal.component.scss']
})
export class ShowAddressModalComponent implements OnInit {

  @Input() title: string;
  @Input() caption: string;
  @Input() walletAddr: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  getEtherScanLink() {
    return Config.ETHERSCAN_URL + '/address/' + this.walletAddr;
  }

  onAddrCopied() {
    
  }

}
