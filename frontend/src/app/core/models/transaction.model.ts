export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export interface RecentTransaction {
  id: string;
  note: string;
  transactionDate: string;
  type: TransactionType;
  amount: number;
  categoryName: string;
  accountName: string;
  toAccountName: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TransactionRequest {
  accountId: string;
  toAccountId?: string;
  categoryId?: string;
  type: TransactionType;
  amount: number;
  transactionDate: string;
  note?: string;
}

export interface TransactionResponse {
  id: string;
  accountName: string;
  toAccountName: string | null;
  amount: number;
  type: TransactionType;
  categoryName: string | null;
  note: string | null;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}
