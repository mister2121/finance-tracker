package com.financetracker.backend.dto.request;

import java.math.BigDecimal;

import com.financetracker.backend.model.AccountType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountRequest {
  @NotBlank(message = "Name is required")
  private String name;

  @NotNull(message = "Account type is required")
  private AccountType type;

  @NotBlank(message = "Currency is required")
  @Size(min = 3, max = 3, message = "Currency must be a 3-letter code")
  private String currency;

  @NotNull(message = "Balance is required")
  private BigDecimal balance;
}
