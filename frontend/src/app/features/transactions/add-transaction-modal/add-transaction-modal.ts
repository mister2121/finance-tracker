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
import { Category, CategoryType } from '../../../core/models/category.model';

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
  categories: Category[] = [];
  selectedType: TransactionType = TransactionType.EXPENSE;
  amount: number = 0;
  accountId = '';
  categoryId = '';
  transactionDate = new Date().toISOString().split('T')[0];
  note = '';
  toAccountId = '';

  // BŁĘDY WALIDACJI
  amountError = '';
  accountIdError = '';
  categoryIdError = '';
  transactionDateError = '';
  toAccountIdError = '';
  submitError = '';

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

  // czy formularz jest poprawny?
  validateTransactionForm(): boolean {
    this.amountError = '';
    this.accountIdError = '';
    this.categoryIdError = '';
    this.transactionDateError = '';
    this.toAccountIdError = '';
    this.submitError = '';

    let isValid = true;

    if (this.amount <= 0) {
      this.amountError = 'Kwota musi być większa od zera';
      isValid = false;
    }

    if (!this.accountId) {
      this.accountIdError = 'Konto jest wymagane';
      isValid = false;
    }

    if (!this.transactionDate) {
      this.transactionDateError = 'Data jest wymagana';
      isValid = false;
    }

    if (this.selectedType !== TransactionType.TRANSFER && !this.categoryId) {
      this.categoryIdError = 'Kategoria jest wymagana';
      isValid = false;
    }

    if (this.selectedType === TransactionType.TRANSFER) {
      if (!this.toAccountId) {
        this.toAccountIdError = 'Konto docelowe jest wymagane dla transferu';
        isValid = false;
      } else if (this.accountId && this.toAccountId === this.accountId) {
        this.toAccountIdError = 'Konto docelowe musi różnić się od konta źródłowego';
        isValid = false;
      }
    }

    return isValid;
  }

  clearAmountError() {
    this.amountError = '';
  }

  clearAccountIdError() {
    this.accountIdError = '';
  }

  clearCategoryIdError() {
    this.categoryIdError = '';
  }

  clearTransactionDateError() {
    this.transactionDateError = '';
  }

  clearToAccountIdError() {
    this.toAccountIdError = '';
  }

  onSubmit() {
    const formValid = this.validateTransactionForm();

    if (!formValid) {
      this.cdr.detectChanges();
      return;
    }

    const request: TransactionRequest = {
      type: this.selectedType,
      amount: this.amount as number,
      accountId: this.accountId,
      categoryId: this.selectedType === TransactionType.TRANSFER ? undefined : this.categoryId,
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
      error: () => {
        this.submitError = 'Nie udało się zapisać transakcji. Spróbuj ponownie.';
        this.cdr.detectChanges();
      },
    });

    alert('Transakcja zapisana.');
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

  get filteredCategories(): Category[] {
    if (this.selectedType === TransactionType.EXPENSE) {
      return this.categories.filter((c) => c.type === CategoryType.EXPENSE);
    }
    if (this.selectedType === TransactionType.INCOME) {
      return this.categories.filter((c) => c.type === CategoryType.INCOME);
    }
    return [];
  }
}
