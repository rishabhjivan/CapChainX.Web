import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateStruct } from '../formatters/ngb-date-parser-formatters';

@Injectable()
export class UtilsService {

  constructor() { }

  static padNumber(value: number) {
    if (UtilsService.isNumber(value)) {
        return `0${value}`.slice(-2);
    } else {
        return "";
    }
  }

  static isNumber(value: any): boolean {
    return !isNaN(UtilsService.toInteger(value));
  }

  static toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }

  static toISODateString(value: CustomDateStruct): string {
    return value.year + "-" + UtilsService.padNumber(value.month) + "-" + UtilsService.padNumber(value.day);
  }

  static convertToHttpParams(classObj: any): HttpParams {
    var params = new HttpParams();
    let obj = Object.create(classObj);
    for (var key in obj) {
      if (key != 'constructor') {
        const val = classObj[key];
        params = params.append(key, val);
      }
    };
    return params;
  }

  static toCurrency(value: number): number {
    return Math.round(value * 100) / 100;
  }

}
