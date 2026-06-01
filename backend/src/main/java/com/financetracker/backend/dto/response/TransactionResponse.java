package com.financetracker.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.financetracker.backend.model.TransactionType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TransactionResponse {
  private UUID id;
  private String accountName;
  private String toAccountName;
  private BigDecimal amount;
  private TransactionType type;
  private String categoryName;
  private String note;
  private LocalDate transactionDate;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
