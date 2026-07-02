import { Injectable, signal } from '@angular/core';
import { TransactionResponse } from '../models/transaction.model';
import { DashboardAccount } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class ModalService {
  isAddTransactionOpen = signal(false);
  isAddAccountOpen = signal(false);

  accountsSaved = signal(0);
  transactionSaved = signal(0);

  accountToEdit = signal<DashboardAccount | null>(null);
  transactionToEdit = signal<TransactionResponse | null>(null);

  openTransactionModal() {
    this.transactionToEdit.set(null);
    this.isAddTransactionOpen.set(true);
  }

  closeTransactionModal() {
    this.isAddTransactionOpen.set(false);
  }

  openAccountModal() {
    this.accountToEdit.set(null);
    this.isAddAccountOpen.set(true);
  }

  closeAccountModal() {
    this.accountToEdit.set(null);
    this.isAddAccountOpen.set(false);
  }
  notifyTransactionSaved() {
    this.transactionSaved.update((n) => n + 1);
  }

  notifyAccountsSaved() {
    this.accountsSaved.update((n) => n + 1);
  }

  openTransactionForEdit(transaction: TransactionResponse) {
    this.transactionToEdit.set(transaction);
    this.isAddTransactionOpen.set(true);
  }
  openAccountForEdit(account: DashboardAccount) {
    this.accountToEdit.set(account);
    this.isAddAccountOpen.set(true);
  }
}
