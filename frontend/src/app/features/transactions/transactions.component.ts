import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../core/services/transaction.service';
import {
  PagedResponse,
  TransactionResponse,
  TransactionType,
} from '../../core/models/transaction.model';
import { Subscription } from 'rxjs';
import { AddTransactionModal } from './add-transaction-modal/add-transaction-modal';
import { ModalService } from '../../core/services/modal.service';
import { TransactionTypeLabelPipe } from '../../core/pipes/transaction-type.pipe';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, AddTransactionModal, TransactionTypeLabelPipe],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit {
  private transactionService = inject(TransactionService);
  modalService = inject(ModalService);
  private cdr = inject(ChangeDetectorRef);
  private currentRequest?: Subscription;

  transactions: PagedResponse<TransactionResponse> | null = null;
  selectedDate = new Date();
  selectedTransaction: TransactionResponse | null = null;

  currentPage = 0;
  pageSize = 8;

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

    this.transactionService
      .getTransactions(year, month, this.currentPage, this.pageSize)
      .subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.cdr.detectChanges();
        },
        error: () => {},
      });
  }

  previousMonth() {
    this.currentPage = 0;
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() - 1,
      1,
    );
    this.loadTransactions();
  }

  nextMonth() {
    this.currentPage = 0;
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

  getDotColorClass(type: TransactionType): string {
    if (type === TransactionType.INCOME) return 'bg-money-green';
    if (type === TransactionType.EXPENSE) return 'bg-money-red';
    if (type === TransactionType.TRANSFER) return 'bg-money-blue';
    return 'bg-zinc-500';
  }

  deleteTransaction(id: string) {
    const confirmed = confirm(
      'Czy na pewno chcesz usunąć transakcję? Tej operacji nie można cofnąć.',
    );
    if (!confirmed) {
      return;
    }

    this.transactionService.deleteTransaction(id).subscribe({
      next: () => {
        this.loadTransactions();
        alert('Transakcja usunięta.');
      },
      error: () => alert('Nie udao się usunąć transakcji.'),
    });
  }

  openEditModal(transaction: TransactionResponse) {
    this.modalService.openTransactionForEdit(transaction);
  }

  // dla wersji mobile, po kliknieciu pojawia sie maly modal z zapytaniem czy edytowac czy usunac transakcje
  openActionSheet(transaction: TransactionResponse) {
    this.selectedTransaction = transaction;
  }

  closeActionSheet() {
    this.selectedTransaction = null;
  }

  // paginacja
  nextPage() {
    if (this.transactions && this.currentPage < this.transactions.totalPages - 1) {
      this.currentPage++;
      this.loadTransactions();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTransactions();
    }
  }
}
