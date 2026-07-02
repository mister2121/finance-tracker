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

  @Input() accountToEdit: DashboardAccount | null = null;

  ngOnInit() {
    if (this.accountToEdit) {
      this.name = this.accountToEdit.name;
      this.selectedType = this.accountToEdit.type;
      this.currency = this.accountToEdit.currency;
      this.balance = this.accountToEdit.balance;
    }
  }

  onSubmit() {
    if (!this.selectedType) {
      return;
    }

    const request: AccountRequest = {
      name: this.name,
      type: this.selectedType,
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
