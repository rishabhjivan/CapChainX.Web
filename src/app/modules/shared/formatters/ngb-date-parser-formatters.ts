import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { UtilsService } from "../services/utils.service";
import * as moment from 'moment';

export class CustomDateStruct implements NgbDateStruct {
  public year: number;
  public month: number;
  public day: number;
  constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
  }
  static FromMoment(d: moment.Moment) {
    return new CustomDateStruct(d.year(), d.month() + 1, d.date());
  }
  static ToMoment(d: CustomDateStruct): moment.Moment {
    return moment(d.year + "-" + d.month + "-" + d.day, 'YYYY-MM-DD');
  }
}

export class DateUtils {
  static MonthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
}

@Injectable()
export class NgbIntlDateParserFormatter extends NgbDateParserFormatter {
    parse(value: string): CustomDateStruct {
        if (value) {
            const dateParts = value.trim().split('/');
            return new CustomDateStruct(UtilsService.toInteger(dateParts[2]), UtilsService.toInteger(dateParts[1]), UtilsService.toInteger(dateParts[0]));
        }   
        return null;
    }

    format(date: CustomDateStruct): string {
        let stringDate: string = ""; 
        if(date) {
            stringDate += UtilsService.isNumber(date.day) ? UtilsService.padNumber(date.day) + "/" : "";
            stringDate += UtilsService.isNumber(date.month) ? UtilsService.padNumber(date.month) + "/" : "";
            stringDate += date.year;
        }
        return stringDate;
    }
}

@Injectable()
export class NgbUSDateParserFormatter extends NgbDateParserFormatter {
    parse(value: string): CustomDateStruct {
        if (value) {
            const dateParts = value.trim().split('/');
            return new CustomDateStruct(UtilsService.toInteger(dateParts[2]), UtilsService.toInteger(dateParts[0]), UtilsService.toInteger(dateParts[1]));
        }   
        return null;
    }

    format(date: CustomDateStruct): string {
        let stringDate: string = ""; 
        if(date) {
            stringDate += UtilsService.isNumber(date.month) ? UtilsService.padNumber(date.month) + "/" : "";
            stringDate += UtilsService.isNumber(date.day) ? UtilsService.padNumber(date.day) + "/" : "";
            stringDate += date.year;
        }
        return stringDate;
    }
}

@Injectable()
export class NgbLongDateParserFormatter extends NgbDateParserFormatter {
    parse(value: string): CustomDateStruct {
        if (value) {
            var d = new Date(value);
            return new CustomDateStruct(d.getFullYear(), d.getMonth(), d.getDay());
        }   
        return null;
    }

    format(date: CustomDateStruct): string {
        let stringDate: string = "";
        if(date) {
            stringDate += UtilsService.isNumber(date.month) ? DateUtils.MonthNames[date.month-1] + " " : "";
            stringDate += UtilsService.isNumber(date.day) ? UtilsService.padNumber(date.day) + ", " : "";
            stringDate += date.year;
        }
        return stringDate;
    }
}