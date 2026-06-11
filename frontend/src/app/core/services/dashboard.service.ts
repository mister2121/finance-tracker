import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Dashboard } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  getDashboard(year: number, month: number) {
    return this.http.get<Dashboard>('http://localhost:8080/api/dashboard', {
      params: { year, month },
    });
  }
}
