import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TokenSalePricePoint, TokenSaleTier, TokenSaleTierView, TokenSaleParamsView } from '../../models/api/token-sale';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbLongDateParserFormatter, CustomDateStruct } from '../../formatters/ngb-date-parser-formatters';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'pricing-schedule',
  templateUrl: './pricing-schedule.component.html',
  styleUrls: ['./pricing-schedule.component.scss'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbLongDateParserFormatter}]
})
export class PricingScheduleComponent implements OnInit {

  @Input() count: number;
  @Input() step: number;
  @Input() priceLabel: string;
  @Input() soldLabel: string;
  @Input() dateLabel: string;
  @Input() saleType: string;
  @Input() editable: boolean = false;
  @Input() endDate: CustomDateStruct;
  @Output() onSave = new EventEmitter();

  private _pricePoints: TokenSalePricePoint[];
  @Input()
  set pricePoints(pricePoints: TokenSalePricePoint[]) {
    this._pricePoints = pricePoints;
    this.doPricePointsStepArray();
  }
  get pricePoints(): TokenSalePricePoint[] { return this._pricePoints; }
  
  private _saleTiers: TokenSaleTierView[];
  @Input()
  set saleTiers(saleTiers: TokenSaleTierView[]) {
    this._saleTiers = saleTiers;
    this.doSaleTiersStepArray();
  }
  get saleTiers(): TokenSaleTierView[] { return this._saleTiers; }

  public stepArray: any;
  public inEdit: boolean = false;

  constructor() { }

  ngOnInit() {
    
  }

  doPricePointsStepArray() {
    if (this._pricePoints) {
      this.stepArray = new Array(this._pricePoints.length);
      const spacing = 90 / (this._pricePoints.length - 1);
      for (var i = 0; i < this._pricePoints.length; i++)
        this.stepArray[i] = {step: i + 1, posleft: 10 + (i * spacing)};
    }
  }

  doSaleTiersStepArray() {
    if (this._saleTiers) {
      this.stepArray = new Array(this._saleTiers.length + 1);
      const spacing = 90 / this._saleTiers.length;
      var runningSupply = 0;
      this._saleTiers.forEach((element, i) => {
        const posL = 10 + (i * spacing);
        const posLNext = 10 + ((i + 1) * spacing);
        const posM = (posL + posLNext) / 2;
        this.stepArray[i] = {
          step: i + 1,
          posleft: posL,
          posmid: posM,
          date: element.start_date,
          discount: UtilsService.toCurrency(element.token_discount),
          supply: runningSupply
        };
        runningSupply += element.token_allocation;
      });
      this.stepArray[this._saleTiers.length] = {
        step: this._saleTiers.length + 1,
        posleft: 100,
        posmid: 0,
        date: this.endDate,
        supply: runningSupply
      };
    }
  }

  doEdit() {
    this.inEdit = true;
  }

  cancelEdit() {
    this.doSaleTiersStepArray();
    this.inEdit = false;
  }

  onSaveClick() {
    if (this.stepArray && this.stepArray.length) {
      var params: TokenSaleParamsView = new TokenSaleParamsView;
      params.start_date = this.stepArray[0].date;
      params.end_date = this.stepArray[this.stepArray.length - 1].date;
      params.token_sale_tiers = new Array<TokenSaleTierView>();
      this.stepArray.forEach((element, i) => {
        if (i < this.stepArray.length - 1) {
          var tier: TokenSaleTierView = new TokenSaleTierView;
          tier.start_date = element.date;
          this._saleTiers[i].start_date = element.date;
          tier.token_discount = element.discount;
          this._saleTiers[i].token_discount = element.discount;
          params.token_sale_tiers.push(tier);
        }
      });
      this.endDate = params.end_date;
      this.onSave.emit(params);
    }
    this.inEdit = false;
  }

}
