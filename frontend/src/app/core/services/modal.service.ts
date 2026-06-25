import { Injectable, signal } from '@angular/core';
import { TransactionResponse } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class ModalService {
  isAddTransactionOpen = signal(false);
  transactionSaved = signal(0);
  transactionToEdit = signal<TransactionResponse | null>(null);

  open() {
    this.transactionToEdit.set(null);
    this.isAddTransactionOpen.set(true);
  }
  close() {
    this.isAddTransactionOpen.set(false);
  }
  notifySaved() {
    this.transactionSaved.update((n) => n + 1);
  }

  openForEdit(transaction: TransactionResponse) {
    this.transactionToEdit.set(transaction);
    this.isAddTransactionOpen.set(true);
  }
}
