export interface MonthlyAnalytics {
  month: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface PerMonthAnalytics {
  categoryName: string;
  monthlyAmount: { [key: number]: number };
}
