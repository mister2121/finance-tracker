package com.financetracker.backend.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MonthlyAnalyticsResponse {
  private int month;
  private BigDecimal totalIncome;
  private BigDecimal totalExpenses;
  private BigDecimal balance;
}
