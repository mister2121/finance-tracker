package com.financetracker.backend.dto.response.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.financetracker.backend.model.TransactionType;

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
public class RecentTransactionResponse {
  private UUID id;
  private String note;
  private LocalDate transactionDate;
  private TransactionType type;
  private BigDecimal amount;
  private String categoryName;
  private String accountName;
  private String toAccountName;
}
