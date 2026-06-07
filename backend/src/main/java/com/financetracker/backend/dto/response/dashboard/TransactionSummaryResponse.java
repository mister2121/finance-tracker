package com.financetracker.backend.dto.response.dashboard;

import java.math.BigDecimal;

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
public class TransactionSummaryResponse {
  private BigDecimal totalIncome;
  private BigDecimal totalExpenses;
  private BigDecimal transactionBalance;
}
