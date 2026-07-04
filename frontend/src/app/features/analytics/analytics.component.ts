import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../core/services/analytics.service';
import { MonthlyAnalytics } from '../../core/models/analytics.model';
import { MonthlySummaryTableComponent } from './monthly-summary-table/monthly-summary-table.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MonthlySummaryTableComponent],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  private cdr = inject(ChangeDetectorRef);

  analytics: MonthlyAnalytics[] = [];
  selectedYear = new Date().getFullYear();

  ngOnInit() {
    this.analyticsService.getYearlyAnalytics(this.selectedYear).subscribe({
      next: (data) => {
        this.analytics = data;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }
}
