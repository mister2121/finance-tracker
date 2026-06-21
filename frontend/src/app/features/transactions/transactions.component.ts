import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { TransactionService } from '../../core/services/transaction.service';
import { PagedResponse, TransactionResponse } from '../../core/models/transaction.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private cdr = inject(ChangeDetectorRef);

  transactions: PagedResponse<TransactionResponse> | null = null;
  currentYear: string = new Date().toLocaleString('pl-PL', { year: 'numeric' });
  currentMonth: string = new Date().toLocaleString('pl-PL', { month: 'long' });

  ngOnInit() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const page = 0;
    const size = 20;

    this.transactionService.getTransactions(year, month, page, size).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.cdr.detectChanges(); // i dont know why but this is necessary
      },
      error: () => {
        alert('Failed to load transactions data. Please try again later.');
      },
    });
  }
}
