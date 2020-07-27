import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})
export class ShortNumberPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value == null)
      return "";
    if (value == 0)
      return "0";
    if (value < 1000)
      return value+"";

    //if !fractionSize || fractionSize < 0
    const fractionSize = 1;

    var abs = Math.abs(value);
    const rounder = Math.pow(10,fractionSize);
    const isNegative = value < 0;
    var key: string = '';
    const powers = [
      {key: "Q", value: Math.pow(10,15)},
      {key: "T", value: Math.pow(10,12)},
      {key: "B", value: Math.pow(10,9)},
      {key: "M", value: Math.pow(10,6)},
      {key: "k", value: 1000}
    ];

    var i = 0;
    while (i < powers.length) {
      i++;
      var reduced = abs / powers[i].value;
      reduced = Math.round(reduced * rounder) / rounder;
      if (reduced > 99)
        reduced = Math.abs(reduced);
      if (reduced >= 1) {
        abs = reduced;
        key = powers[i].key;
        break;
      }
    }

    return (isNegative ? '-' : '') + abs + key;
  }

}
