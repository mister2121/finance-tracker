package com.financetracker.backend.dto.response.dashboard;

import java.math.BigDecimal;
import java.util.UUID;

import com.financetracker.backend.model.AccountType;

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
public class DashboardAccountResponse {
  private UUID id;
  private String name;
  private AccountType type;
  private String currency;
  private BigDecimal balance;
}
