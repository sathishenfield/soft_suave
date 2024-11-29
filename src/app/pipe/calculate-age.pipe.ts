import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'calculateAge'
})
export class CalculateAgePipe implements PipeTransform {

  transform(dob: string | Date): number {
    if (!dob) {
      return 0;
    }
    const birthDate = moment(dob);
    const currentDate = moment(new Date());
    return currentDate.diff(birthDate, 'years');
  }

}
