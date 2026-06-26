import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { Dashboard } from '../../core/models/dashboard.model';
import { CommonModule } from '@angular/common';
import { TransactionType } from '../../core/models/transaction.model';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  modalService = inject(ModalService);
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef); // i dont know why but this is necessary

  dashboard: Dashboard | null = null;

  constructor() {
    effect(() => {
      const saved = this.modalService.transactionSaved();
      if (saved > 0) {
        this.loadDashboard();
      }
    });
  }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    this.dashboardService.getDashboard(year, month).subscribe({
      next: (dashboard) => {
        this.dashboard = dashboard;
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Failed to load dashboard data. Please try again later.');
      },
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getAmountPrefix(type: TransactionType): string {
    if (type === TransactionType.INCOME) return '+';
    if (type === TransactionType.EXPENSE) return '-';
    return '';
  }
}
