import { Pipe, PipeTransform } from '@angular/core';
import { CustomDateStruct, DateUtils } from '../../formatters/ngb-date-parser-formatters';

@Pipe({
  name: 'shortDate'
})
export class ShortDatePipe implements PipeTransform {

  transform(value: CustomDateStruct, args?: any): any {
    return DateUtils.MonthNames[value.month - 1] + " " + value.day;
  }

}
