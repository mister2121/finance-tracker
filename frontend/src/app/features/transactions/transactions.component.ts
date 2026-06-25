import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../core/services/transaction.service';
import {
  PagedResponse,
  TransactionRequest,
  TransactionResponse,
  TransactionType,
} from '../../core/models/transaction.model';
import { Subscription } from 'rxjs';
import { AddTransactionModal } from './add-transaction-modal/add-transaction-modal';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, AddTransactionModal],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit {
  private transactionService = inject(TransactionService);
  modalService = inject(ModalService);
  private cdr = inject(ChangeDetectorRef);
  private currentRequest?: Subscription;

  transactions: PagedResponse<TransactionResponse> | null = null;
  selectedDate = new Date();
  isModalOpen = false;
  selectedTransaction: TransactionResponse | null = null;

  constructor() {
    effect(() => {
      const saved = this.modalService.transactionSaved();
      if (saved > 0) {
        this.loadTransactions();
      }
    });
  }

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.currentRequest?.unsubscribe();

    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth() + 1;
    const page = 0;
    const size = 20;

    this.transactionService.getTransactions(year, month, page, size).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Failed to load transactions data. Please try again later.');
      },
    });
  }

  previousMonth() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() - 1,
      1,
    );
    this.loadTransactions();
  }

  nextMonth() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() + 1,
      1,
    );
    this.loadTransactions();
  }

  get selectedMonthLabel(): string {
    const label = this.selectedDate.toLocaleString('pl-PL', { month: 'long', year: 'numeric' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  getAmountPrefix(type: TransactionType): string {
    if (type === TransactionType.INCOME) return '+';
    if (type === TransactionType.EXPENSE) return '-';
    return '';
  }

  setColorBasedOnType(type: TransactionType): string {
    if (type === TransactionType.INCOME) return 'text-money-green';
    if (type === TransactionType.EXPENSE) return 'text-money-red';
    if (type === TransactionType.TRANSFER) return 'text-money-blue';
    return 'text-white';
  }

  deleteTransaction(id: string) {
    this.transactionService.deleteTransaction(id).subscribe({
      next: () => this.loadTransactions(),
      error: () => alert('Nie udao się usunąć transakcji.'),
    });
  }

  editTransaction(id: string, request: TransactionRequest) {
    this.transactionService.editTransaction(id, request).subscribe({
      next: () => this.loadTransactions(),
      error: () => alert('Nie udało się edytować transakcji.'),
    });
  }

  openEditModal(transaction: TransactionResponse) {
    this.modalService.openForEdit(transaction);
  }

  // dla wersji mobile, po kliknieciu pojawia sie maly modal z zapytaniem czy edytowac czy usunac transakcje
  openActionSheet(transaction: TransactionResponse) {
    this.selectedTransaction = transaction;
  }

  closeActionSheet() {
    this.selectedTransaction = null;
  }
}
