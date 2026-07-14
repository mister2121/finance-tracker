import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Dashboard, NetWorthPoint } from '../models/dashboard.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  getDashboard(year: number, month: number) {
    return this.http.get<Dashboard>(`${environment.apiUrl}/api/dashboard`, {
      params: { year, month },
    });
  }

  getNetWorthHistory(months: number = 6) {
    return this.http.get<NetWorthPoint[]>(`${environment.apiUrl}/api/dashboard/net-worth-history`, {
      params: { months },
    });
  }
}
