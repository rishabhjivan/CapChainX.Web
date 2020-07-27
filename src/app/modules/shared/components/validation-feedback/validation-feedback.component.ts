import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'validation-feedback',
  templateUrl: './validation-feedback.component.html',
  styleUrls: ['./validation-feedback.component.scss']
})
export class ValidationFeedbackComponent implements OnInit {

  @Input() field: any;
  @Input() msgRequired: string;
  @Input() msgPattern: string;
  @Input() msgEmail: string;
  @Input() msgUrl: string;
  @Input() msgFile: string;
  @Input() msgMin: string;
  @Input() msgMax: string;

  constructor() { }

  ngOnInit() {
  }

}
