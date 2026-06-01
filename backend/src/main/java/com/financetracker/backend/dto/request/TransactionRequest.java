package com.financetracker.backend.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.financetracker.backend.model.TransactionType;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionRequest {
  
  @NotNull(message = "Account ID is required")
  private UUID accountId;

  private UUID toAccountId;
  private UUID categoryId;

  @NotNull(message = "Transaction type is required")
  private TransactionType type;
  
  @NotNull(message = "Amount is required")
  private BigDecimal amount;

  @NotNull(message = "Transaction date is required")
  private LocalDate transactionDate;

  private String note;
}
