import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DashboardAccount } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);

  getAccounts() {
    return this.http.get<DashboardAccount[]>('http://localhost:8080/api/accounts');
  }
}
