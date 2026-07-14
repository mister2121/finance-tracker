import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account.service';
import { AccountRequest, AccountType, DashboardAccount } from '../../../core/models/account.model';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-add-account-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-account-modal.html',
})
export class AddAccountModal implements OnInit {
  private accountService = inject(AccountService);
  modalService = inject(ModalService);

  AccountType = AccountType;
  name = '';
  selectedType: AccountType | null = null;
  currency = 'PLN';
  balance = 0;

  // błędy:
  nameError = '';
  selectedTypeError = '';
  balanceError = '';

  @Input() accountToEdit: DashboardAccount | null = null;

  validateAccountForm(): boolean {
    this.nameError = '';
    this.selectedTypeError = '';
    this.balanceError = '';

    let isValid = true;

    if (!this.name.trim()) {
      this.nameError = 'Nazwa jest wymagana';
      isValid = false;
    }

    if (!this.selectedType) {
      this.selectedTypeError = 'Typ konta jest wymagany';
      isValid = false;
    }

    if (this.balance === null || this.balance === undefined || isNaN(this.balance)) {
      this.balanceError = 'Saldo jest wymagane';
      isValid = false;
    } else if (this.balance < 0) {
      this.balanceError = 'Saldo nie może być ujemne';
      isValid = false;
    }

    return isValid;
  }

  ngOnInit() {
    if (this.accountToEdit) {
      this.name = this.accountToEdit.name;
      this.selectedType = this.accountToEdit.type;
      this.currency = this.accountToEdit.currency;
      this.balance = this.accountToEdit.balance;
    }
  }

  onSubmit() {
    if (!this.validateAccountForm()) {
      return;
    }

    const request: AccountRequest = {
      name: this.name,
      type: this.selectedType!,
      currency: this.currency,
      balance: this.balance,
    };

    const action = this.accountToEdit
      ? this.accountService.editAccount(this.accountToEdit.id, request)
      : this.accountService.createAccount(request);

    action.subscribe({
      next: (account) => {
        this.modalService.notifyAccountsSaved();
        this.modalService.closeAccountModal();
      },
      error: (error) => {
        console.error('Błąd podczas zapisywania konta:', error);
      },
    });
  }
}
