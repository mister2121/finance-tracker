import { Pipe, PipeTransform } from '@angular/core';
import { AccountType } from '../models/account.model';

@Pipe({
  name: 'accountTypeLabel',
  standalone: true,
})
export class AccountTypeLabelPipe implements PipeTransform {
  transform(type: AccountType): string {
    switch (type) {
      case AccountType.BANK:
        return 'BANKOWE';
      case AccountType.CASH:
        return 'GOTÓWKA';
      case AccountType.INVESTMENT:
        return 'INWESTYCJE';
      case AccountType.OTHER:
        return 'INNE';
      default:
        return type;
    }
  }
}
