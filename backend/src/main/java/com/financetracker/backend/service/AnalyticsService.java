package com.financetracker.backend.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.financetracker.backend.dto.response.MonthlyAnalyticsResponse;
import com.financetracker.backend.model.User;
import com.financetracker.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AnalyticsService {
  private final AccountService accountService;
  private final TransactionService transactionService;
  private final UserRepository userRepository;

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
}
