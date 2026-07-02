import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AccountRequest, DashboardAccount } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);

  getAccounts() {
    return this.http.get<DashboardAccount[]>('http://localhost:8080/api/accounts');
  }

  createAccount(request: AccountRequest) {
    return this.http.post<DashboardAccount>('http://localhost:8080/api/accounts', request);
  }

  editAccount(id: string, request: AccountRequest) {
    return this.http.put<DashboardAccount>(`http://localhost:8080/api/accounts/${id}`, request);
  }

  deleteAccount(id: string) {
    return this.http.delete<DashboardAccount>(`http://localhost:8080/api/accounts/${id}`);
  }
}
