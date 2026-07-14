import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { Dashboard, NetWorthPoint } from '../../core/models/dashboard.model';
import { CommonModule } from '@angular/common';
import { TransactionType } from '../../core/models/transaction.model';
import { ModalService } from '../../core/services/modal.service';
import { Chart, registerables } from 'chart.js';
import { AccountTypeLabelPipe } from '../../core/pipes/account-type.pipe';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, AccountTypeLabelPipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private authService = inject(AuthService);
  modalService = inject(ModalService);
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  // wykres laczny majatek
  @ViewChild('netWorthChart') netWorthChartRef?: ElementRef<HTMLCanvasElement>;
  private chartInstance: Chart | null = null;

  // wykres pie chart wydatki per kategoria
  @ViewChild('expenseChart') expenseChartRef?: ElementRef<HTMLCanvasElement>;
  private expenseChartInstance: Chart | null = null;

  dashboard: Dashboard | null = null;
  netWorthHistory: NetWorthPoint[] = [];

  constructor() {
    effect(() => {
      const saved = this.modalService.transactionSaved();
      if (saved > 0) {
        this.loadDashboard();
        this.loadNetWorthHistory();
      }
    });
  }

  ngOnInit() {
    this.loadDashboard();
    this.loadNetWorthHistory();
  }

  ngAfterViewInit() {
    if (this.netWorthHistory.length) {
      setTimeout(() => this.renderChart());
    }
    if (this.dashboard) {
      setTimeout(() => this.renderExpenseChart());
    }
  }

  loadDashboard() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    this.dashboardService.getDashboard(year, month).subscribe({
      next: (dashboard) => {
        this.dashboard = dashboard;
        this.cdr.detectChanges();
        setTimeout(() => this.renderExpenseChart());
      },
      error: () => {},
    });
  }

  loadNetWorthHistory() {
    this.dashboardService.getNetWorthHistory(12).subscribe({
      next: (data) => {
        this.netWorthHistory = data;
        this.cdr.detectChanges();
        setTimeout(() => this.renderChart());
      },
      error: () => {},
    });
  }

  // WYKRES HISTORIA MAJATKU
  renderChart() {
    if (!this.netWorthChartRef?.nativeElement) return;

    this.chartInstance?.destroy();

    const ctx = this.netWorthChartRef.nativeElement.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.35)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.netWorthHistory.map((p) => p.monthLabel),
        datasets: [
          {
            data: this.netWorthHistory.map((p) => p.netWorth),
            borderColor: '#8b5cf6',
            backgroundColor: gradient,
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointBackgroundColor: '#8b5cf6',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 4,
            bottom: 4,
            left: 0,
            right: 0,
          },
        },
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#71717a' },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#71717a' },
          },
        },
      },
    });
  }

  // PIE CHART
  renderExpenseChart() {
    if (!this.expenseChartRef?.nativeElement || !this.dashboard) return;

    this.expenseChartInstance?.destroy();

    const breakdown = this.dashboard.expenseBreakdown;
    if (!breakdown.length) return;

    const ctx = this.expenseChartRef.nativeElement.getContext('2d')!;

    this.expenseChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: breakdown.map((e) => e.categoryName),
        datasets: [
          {
            data: breakdown.map((e) => e.percentage),
            backgroundColor: breakdown.map((_, i) => this.getCategoryColor(i, breakdown.length)),
            borderColor: '#18181b',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.formattedValue}%`,
            },
          },
        },
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

  getBalanceColorClass(balance: number): string {
    if (balance > 0) return 'text-money-green';
    if (balance < 0) return 'text-money-red';
    return 'text-white';
  }

  getBalancePrefix(balance: number): string {
    return balance > 0 ? '+' : '';
  }

  get largestAccount(): { name: string } | null {
    if (!this.dashboard?.wealthSummary.accounts?.length) return null;
    return this.dashboard.wealthSummary.accounts.reduce((max, acc) =>
      acc.balance > max.balance ? acc : max,
    );
  }

  get monthOverMonthChange(): number | null {
    if (this.netWorthHistory.length < 2) return null;
    const prev = this.netWorthHistory[this.netWorthHistory.length - 2].netWorth;
    const current = this.netWorthHistory[this.netWorthHistory.length - 1].netWorth;
    if (prev === 0) return null;
    return ((current - prev) / Math.abs(prev)) * 100;
  }

  getChangeColorClass(change: number): string {
    if (change > 0) return 'text-money-green';
    if (change < 0) return 'text-money-red';
    return 'text-white';
  }

  // pie chart wykres wydatki wg kategorii
  private readonly baseCategoryColors = [
    '#8b5cf6', // brand-purple
    '#ef4444', // money-red
    '#22c55e', // money-green
    '#3b82f6', // money-blue
    '#f59e0b',
    '#ec4899',
    '#14b8a6',
    '#a855f7',
  ];

  getCategoryColor(index: number, total: number): string {
    // najpierw uzywamy naszych stworzonych 8 kolorow
    if (total <= this.baseCategoryColors.length) {
      return this.baseCategoryColors[index];
    }

    // jezeli uzytkownik stworzy wiecej kategorii, generujemy ich kolory w HSL
    const hue = (index * (360 / total)) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  }
}
