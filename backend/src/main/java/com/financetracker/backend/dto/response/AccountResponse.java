package com.financetracker.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.financetracker.backend.model.AccountType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
  private UUID id;
  private String name;
  private AccountType type;
  private BigDecimal balance;
  private String currency;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
