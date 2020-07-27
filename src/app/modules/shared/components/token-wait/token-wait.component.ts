import { Component, OnInit, Input } from '@angular/core';
import { Config } from '../../services/config';

@Component({
  selector: 'token-wait',
  templateUrl: './token-wait.component.html',
  styleUrls: ['./token-wait.component.scss']
})
export class TokenWaitComponent implements OnInit {

  @Input() waitMessage: string;
  @Input() txHash: string;

  public lottieConfig: Object;
  public anim: any;
  constructor() {
    this.lottieConfig = {
      path: 'assets/lottie/smiley_stack.json',
      autoplay: true,
      loop: true
    };
  }

  ngOnInit() {
  }

  handleAnimation(anim: any) {
      this.anim = anim;
  }

  getEtherScanLink() {
    return Config.ETHERSCAN_URL + '/tx/' + this.txHash;
  }

}
