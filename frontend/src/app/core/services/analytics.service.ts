import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MonthlyAnalytics, PerMonthAnalytics } from '../models/analytics.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);

  getYearlyAnalytics(year: number) {
    return this.http.get<MonthlyAnalytics[]>(`${environment.apiUrl}/api/analytics`, {
      params: { year },
    });
  }

  getPerCategoryAnalytics(year: number) {
    return this.http.get<PerMonthAnalytics[]>(`${environment.apiUrl}/api/analytics/categories`, {
      params: { year },
    });
  }
}
