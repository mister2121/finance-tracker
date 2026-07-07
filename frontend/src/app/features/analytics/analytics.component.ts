import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../core/services/analytics.service';
import { MonthlyAnalytics, PerMonthAnalytics } from '../../core/models/analytics.model';
import { MonthlySummaryTableComponent } from './monthly-summary-table/monthly-summary-table.component';
import { PerCategoryTableComponent } from './per-category-table/per-category-table.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MonthlySummaryTableComponent, PerCategoryTableComponent],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  private cdr = inject(ChangeDetectorRef);

  analytics: MonthlyAnalytics[] = [];
  categoryAnalytics: PerMonthAnalytics[] = [];
  selectedYear = new Date().getFullYear();

  ngOnInit() {
    this.analyticsService.getYearlyAnalytics(this.selectedYear).subscribe({
      next: (data) => {
        this.analytics = data;
        this.cdr.detectChanges();
      },
      error: () => {},
    });

    this.analyticsService.getPerCategoryAnalytics(this.selectedYear).subscribe({
      next: (data) => {
        this.categoryAnalytics = data;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }
}
