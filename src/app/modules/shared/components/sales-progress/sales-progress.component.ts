import { Component, OnInit, Input } from '@angular/core';
import { TokenSale } from '../../models/api/token-sale';
import * as moment from 'moment';
import { CustomDateStruct } from '../../formatters/ngb-date-parser-formatters';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'sales-progress',
  templateUrl: './sales-progress.component.html',
  styleUrls: ['./sales-progress.component.scss']
})
export class SalesProgressComponent implements OnInit {

  @Input()
  set tokenSale(sale: TokenSale) {
    if (sale) {
      this.status = sale.status;
      const ed = moment(sale.token_sale_params.end_date, "YYYY-MM-DD");
      const sd = moment(sale.token_sale_params.start_date, "YYYY-MM-DD");
      this.endDate = CustomDateStruct.FromMoment(ed);
      this.startDate = CustomDateStruct.FromMoment(sd);
      const currentDate = moment(new Date().getFullYear() + "-" + UtilsService.padNumber(new Date().getMonth() + 1) + "-" + UtilsService.padNumber(new Date().getDate()), "YYYY-MM-DD");
      let daysLeft = ed.diff(currentDate, 'days');
      const totalDays = ed.diff(sd, 'days');
      if (daysLeft == totalDays) {
        this.progressPct = 0;
      } else {
        if (daysLeft < 0)
          daysLeft = 0;
        this.progressPct = ((totalDays - daysLeft) / totalDays) * 100;
        if (this.progressPct < 2)
          this.progressPct = 2;
        else if (this.progressPct > 98 && this.progressPct < 100)
          this.progressPct = 98;
      }
    }
  }
  public status: string;
  public endDate: CustomDateStruct;
  public startDate: CustomDateStruct;
  public progressPct: number;
  public today = CustomDateStruct.FromMoment(moment(new Date()));
  
  constructor() { }

  ngOnInit() {
  }

}
