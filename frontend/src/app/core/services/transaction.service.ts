import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PagedResponse, TransactionResponse } from '../models/transaction.model';

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
}
