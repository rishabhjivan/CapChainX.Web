import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrls: ['./progress-indicator.component.scss']
})
export class ProgressIndicatorComponent implements OnInit {

  @Input() count: number;
  @Input() step: number;
  public stepArray: any;

  constructor() { }

  ngOnInit() {
    this.stepArray = new Array(this.count);
    const spacing = 100 / (this.count - 1);
    for (var i = 0; i < this.count; i++)
      this.stepArray[i] = {step: i + 1, posleft: i * spacing};
  }

}
