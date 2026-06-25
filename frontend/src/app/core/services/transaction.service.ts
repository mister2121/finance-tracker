import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  PagedResponse,
  TransactionRequest,
  TransactionResponse,
} from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);

  getTransactions(year: number, month: number, page: number, size: number) {
    return this.http.get<PagedResponse<TransactionResponse>>(
      'http://localhost:8080/api/transactions',
      {
        params: { year, month, page, size },
      },
    );
  }

  createTransaction(request: TransactionRequest) {
    return this.http.post<TransactionResponse>('http://localhost:8080/api/transactions', request);
  }

  deleteTransaction(id: string) {
    return this.http.delete(`http://localhost:8080/api/transactions/${id}`);
  }

  editTransaction(id: string, request: TransactionRequest) {
    return this.http.put<TransactionResponse>(
      `http://localhost:8080/api/transactions/${id}`,
      request,
    );
  }
}
