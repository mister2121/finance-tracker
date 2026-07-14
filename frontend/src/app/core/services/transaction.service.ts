import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  PagedResponse,
  TransactionRequest,
  TransactionResponse,
} from '../models/transaction.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);

  getTransactions(year: number, month: number, page: number, size: number) {
    return this.http.get<PagedResponse<TransactionResponse>>(
      `${environment.apiUrl}/api/transactions`,
      {
        params: { year, month, page, size },
      },
    );
  }

  createTransaction(request: TransactionRequest) {
    return this.http.post<TransactionResponse>(`${environment.apiUrl}/api/transactions`, request);
  }

  deleteTransaction(id: string) {
    return this.http.delete(`${environment.apiUrl}/api/transactions/${id}`);
  }

  editTransaction(id: string, request: TransactionRequest) {
    return this.http.put<TransactionResponse>(
      `${environment.apiUrl}/api/transactions/${id}`,
      request,
    );
  }
}
