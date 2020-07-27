import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'message-spinner',
  templateUrl: './message-spinner.component.html',
  styleUrls: ['./message-spinner.component.scss']
})
export class MessageSpinnerComponent implements OnInit {

  @Input() message: string = "";

  constructor() { }

  ngOnInit() {
  }

}
