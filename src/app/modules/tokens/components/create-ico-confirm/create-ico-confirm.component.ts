import { Component, OnInit } from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'create-ico-confirm',
  templateUrl: './create-ico-confirm.component.html',
  styleUrls: ['./create-ico-confirm.component.scss']
})
export class CreateIcoConfirmComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
