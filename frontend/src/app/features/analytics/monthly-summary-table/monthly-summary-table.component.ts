import { Component, Input } from '@angular/core';
import { MonthlyAnalytics } from '../../../core/models/analytics.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monthly-summary-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-summary-table.component.html',
})
export class MonthlySummaryTableComponent {
  @Input() analytics: MonthlyAnalytics[] = [];

  monthShortNames = [
    'Sty',
    'Lut',
    'Mar',
    'Kwi',
    'Maj',
    'Cze',
    'Lip',
    'Sie',
    'Wrz',
    'Paź',
    'Lis',
    'Gru',
  ];
  monthLongNames = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ];

  get totalIncome(): number {
    return this.analytics.reduce((sum, row) => sum + row.totalIncome, 0);
  }

  get totalExpenses(): number {
    return this.analytics.reduce((sum, row) => sum + row.totalExpenses, 0);
  }

  get totalBalance(): number {
    return this.analytics.reduce((sum, row) => sum + row.balance, 0);
  }

  get avgIncome(): number {
    const nonZero = this.analytics.filter((row) => row.totalIncome > 0);
    return nonZero.length ? this.totalIncome / nonZero.length : 0;
  }

  get avgExpenses(): number {
    const nonZero = this.analytics.filter((row) => row.totalExpenses > 0);
    return nonZero.length ? this.totalExpenses / nonZero.length : 0;
  }

  get avgBalance(): number {
    const nonZero = this.analytics.filter((row) => row.balance !== 0);
    return nonZero.length ? this.totalBalance / nonZero.length : 0;
  }
}
