package com.financetracker.backend.dto.response.analytics;

import java.math.BigDecimal;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PerCategoryResponse {
  private String categoryName;
  private Map<Integer, BigDecimal> monthlyAmount;
}
