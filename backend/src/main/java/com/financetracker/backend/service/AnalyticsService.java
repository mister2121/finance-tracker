package com.financetracker.backend.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.financetracker.backend.dto.response.analytics.MonthlyAnalyticsResponse;
import com.financetracker.backend.dto.response.analytics.PerCategoryResponse;
import com.financetracker.backend.model.User;
import com.financetracker.backend.model.TransactionType;
import com.financetracker.backend.repository.TransactionRepository;
import com.financetracker.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AnalyticsService {
  private final TransactionService transactionService;
  private final UserRepository userRepository;
  private final TransactionRepository transactionRepository;

  // Pomocnicza metoda pobierająca aktualnie zalogowanego użytkownika z JWT
    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

  public List<MonthlyAnalyticsResponse> getYearlyAnalytics(int year) {
    UUID userId = getAuthenticatedUser().getId();
    List<MonthlyAnalyticsResponse> result = new ArrayList<>();

    for (int month = 1; month <= 12; month++) {
      BigDecimal income = transactionService.getTotalIncomeForMonth(userId, year, month);
      BigDecimal expenses = transactionService.getTotalExpensesForMonth(userId, year, month);
      BigDecimal balance = income.subtract(expenses);

      result.add(new MonthlyAnalyticsResponse(month, income, expenses, balance));
    }

    return result;
  }

  public List<PerCategoryResponse> getPerCategoryAnalytics(int year) {
    UUID userId = getAuthenticatedUser().getId();
    
    List<Object[]> rows = transactionRepository.findTotalExpensesPerCategory(userId, TransactionType.EXPENSE, year); 

    Map<String, Map<Integer, BigDecimal>> categoryMap = new HashMap<>();

    for (Object[] row : rows) {
      String categoryName = (String) row[0];
      Integer month = (Integer) row[1];
      BigDecimal amount = (BigDecimal) row[2];

      // Jeśli pierwszy raz widzimy tę kategorię, tworzymy dla niej pustą mapę miesięcy
      categoryMap.putIfAbsent(categoryName, new HashMap<>());
        
      // Dodajemy kwotę do odpowiedniego miesiąca w tej kategorii
      categoryMap.get(categoryName).put(month, amount);
    }
    
    List<PerCategoryResponse> result = new ArrayList<>();
    for (Map.Entry<String, Map<Integer, BigDecimal>> entry : categoryMap.entrySet()) {
      result.add(new PerCategoryResponse(entry.getKey(), entry.getValue()));
    }

    return result;
  }
}
