import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { AccountService } from '../../../core/services/account.service';
import { CategoryService } from '../../../core/services/category.service';
import {
  TransactionRequest,
  TransactionResponse,
  TransactionType,
} from '../../../core/models/transaction.model';
import { DashboardAccount } from '../../../core/models/account.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-add-transaction-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-transaction-modal.html',
})
export class AddTransactionModal {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);
  private categoryService = inject(CategoryService);
  modalService = inject(ModalService);
  private cdr = inject(ChangeDetectorRef);

  @Input() transactionToEdit: TransactionResponse | null = null;

  @Output() closed = new EventEmitter<void>();
  TransactionType = TransactionType;
  accounts: DashboardAccount[] = [];
  categories: { id: string; name: string }[] = [];
  selectedType: TransactionType = TransactionType.EXPENSE;
  amount: number = 0;
  accountId = '';
  categoryId = '';
  transactionDate = new Date().toISOString().split('T')[0];
  note = '';
  toAccountId = '';

  ngOnInit() {
    this.accountService.getAccounts().subscribe((data) => {
      this.accounts = data;
      if (this.transactionToEdit) {
        const match = data.find((a) => a.name === this.transactionToEdit!.accountName);
        if (match) {
          this.accountId = match.id;
          this.cdr.detectChanges();
        }
      }
    });

    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
      if (this.transactionToEdit) {
        const match = data.find((c) => c.name === this.transactionToEdit!.categoryName);
        if (match) {
          this.categoryId = match.id;
          this.cdr.detectChanges();
        }
      }
    });

    if (this.transactionToEdit) {
      this.selectedType = this.transactionToEdit.type;
      this.amount = this.transactionToEdit.amount;
      this.transactionDate = this.transactionToEdit.transactionDate;
      this.note = this.transactionToEdit.note ?? '';
    }
  }

  onSubmit() {
    const request: TransactionRequest = {
      type: this.selectedType,
      amount: this.amount,
      accountId: this.accountId,
      categoryId: this.categoryId || undefined,
      transactionDate: this.transactionDate,
      note: this.note || undefined,
      toAccountId: this.toAccountId,
    };

    const action = this.transactionToEdit
      ? this.transactionService.editTransaction(this.transactionToEdit.id, request)
      : this.transactionService.createTransaction(request);

    action.subscribe({
      next: () => {
        this.modalService.notifyTransactionSaved();
        this.closed.emit();
      },
      error: (err) => console.error(err),
    });
  }

  setColorBasedOnType(type: TransactionType): string {
    if (this.selectedType !== type) {
      return 'text-zinc-400 hover:bg-zinc-800 hover:text-white';
    }
    if (type === TransactionType.EXPENSE) {
      return 'bg-money-red/15 text-money-red';
    }
    if (type === TransactionType.INCOME) {
      return 'bg-money-green/15 text-money-green';
    }
    if (type === TransactionType.TRANSFER) {
      return 'bg-money-blue/15 text-money-blue';
    }
    return 'text-zinc-400';
  }
}
