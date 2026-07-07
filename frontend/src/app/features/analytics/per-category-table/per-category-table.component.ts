import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MonthlyAnalytics, PerMonthAnalytics } from '../../../core/models/analytics.model';

@Component({
  selector: 'app-per-category-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './per-category-table.component.html',
})
export class PerCategoryTableComponent {
  @Input() categoryData: PerMonthAnalytics[] = [];

  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
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

  getRowTotal(row: PerMonthAnalytics): number {
    return Object.values(row.monthlyAmount).reduce((sum, val) => sum + val, 0);
  }

  getRowAverage(row: PerMonthAnalytics): number {
    const values = Object.values(row.monthlyAmount).filter((v) => v > 0);
    return values.length ? this.getRowTotal(row) / values.length : 0;
  }
}
