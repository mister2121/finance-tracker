import { Pipe, PipeTransform } from '@angular/core';
import { TransactionType } from '../models/transaction.model';

@Pipe({
  name: 'transactionTypeLabel',
  standalone: true,
})
export class TransactionTypeLabelPipe implements PipeTransform {
  transform(type: TransactionType): string {
    switch (type) {
      case TransactionType.INCOME:
        return 'PRZYCHÓD';
      case TransactionType.EXPENSE:
        return 'WYDATEK';
      case TransactionType.TRANSFER:
        return 'TRANSFER';
      default:
        return type;
    }
  }
}
