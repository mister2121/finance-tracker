import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AccountRequest, DashboardAccount } from '../models/account.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);

  getAccounts() {
    return this.http.get<DashboardAccount[]>(`${environment.apiUrl}/api/accounts`);
  }

  createAccount(request: AccountRequest) {
    return this.http.post<DashboardAccount>(`${environment.apiUrl}/api/accounts`, request);
  }

  editAccount(id: string, request: AccountRequest) {
    return this.http.put<DashboardAccount>(`${environment.apiUrl}/api/accounts/${id}`, request);
  }

  deleteAccount(id: string) {
    return this.http.delete<DashboardAccount>(`${environment.apiUrl}/api/accounts/${id}`);
  }
}
