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
