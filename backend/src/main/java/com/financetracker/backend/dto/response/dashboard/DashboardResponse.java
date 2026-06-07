package com.financetracker.backend.dto.response.dashboard;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
  private WealthSummaryResponse wealthSummary;
  private TransactionSummaryResponse transactionSummary;
  private List<RecentTransactionResponse> recentTransactions;
  private List<ExpenseBreakdownResponse> expenseBreakdown;
}
