import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { AccountService } from '../../core/services/account.service';
import { CommonModule } from '@angular/common';
import { AccountType, DashboardAccount } from '../../core/models/account.model';
import { ModalService } from '../../core/services/modal.service';
import { AddAccountModal } from './add-account-modal/add-account-modal';

@Component({
  selector: 'app-accounts',
  imports: [CommonModule, AddAccountModal],
  templateUrl: './accounts.component.html',
})
export class AccountsComponent implements OnInit {
  private accountService = inject(AccountService);
  modalService = inject(ModalService);
  private cdr = inject(ChangeDetectorRef);
  accounts: DashboardAccount[] = [];
  selectedAccount: DashboardAccount | null = null;

  constructor() {
    effect(() => {
      const saved = this.modalService.accountsSaved();

      if (saved > 0) {
        this.loadAccounts();
      }
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  deleteAccount(id: string) {
    this.accountService.deleteAccount(id).subscribe({
      next: () => {
        this.closeActionSheet;
        this.loadAccounts();
      },
      error: () => alert('Nie udało się usunąć konta.'),
    });
  }

  openEditModal(account: DashboardAccount) {
    this.modalService.openAccountForEdit(account);
    this.closeActionSheet();
  }

  openActionSheet(account: DashboardAccount) {
    this.selectedAccount = account;
  }

  closeActionSheet() {
    this.selectedAccount = null;
  }

  getAccountTypeLabel(type: AccountType): string {
    const labels: Record<AccountType, string> = {
      [AccountType.BANK]: 'Bankowe',
      [AccountType.CASH]: 'Gotówka',
      [AccountType.INVESTMENT]: 'Inwestycje',
      [AccountType.OTHER]: 'Inne',
    };

    return labels[type];
  }
}
