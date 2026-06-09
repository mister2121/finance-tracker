import { DashboardAccount } from './account.model';
import { RecentTransaction } from './transaction.model';

export interface Dashboard {
  wealthSummary: WealthSummary;
  transactionSummary: TransactionSummary;
  recentTransactions: RecentTransaction[];
  expenseBreakdown: ExpenseBreakdown[];
}

export interface WealthSummary {
  totalNetWorth: number;
  accounts: DashboardAccount[];
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  transactionBalance: number;
}

export interface ExpenseBreakdown {
  categoryName: string;
  totalAmount: number;
  percentage: number;
}
