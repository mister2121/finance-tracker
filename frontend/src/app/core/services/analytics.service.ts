import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MonthlyAnalytics, PerMonthAnalytics } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);

  getYearlyAnalytics(year: number) {
    return this.http.get<MonthlyAnalytics[]>(`http://localhost:8080/api/analytics`, {
      params: { year },
    });
  }

  getPerCategoryAnalytics(year: number) {
    return this.http.get<PerMonthAnalytics[]>(`http://localhost:8080/api/analytics/categories`, {
      params: { year },
    });
  }
}
