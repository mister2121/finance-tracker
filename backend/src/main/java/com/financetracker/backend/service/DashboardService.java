package com.financetracker.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.financetracker.backend.dto.response.AccountResponse;
import com.financetracker.backend.dto.response.dashboard.DashboardAccountResponse;
import com.financetracker.backend.dto.response.dashboard.DashboardResponse;
import com.financetracker.backend.dto.response.dashboard.ExpenseBreakdownResponse;
import com.financetracker.backend.dto.response.dashboard.NetWorthPointResponse;
import com.financetracker.backend.dto.response.dashboard.RecentTransactionResponse;
import com.financetracker.backend.dto.response.dashboard.TransactionSummaryResponse;
import com.financetracker.backend.dto.response.dashboard.WealthSummaryResponse;
import com.financetracker.backend.model.TransactionType;
import com.financetracker.backend.model.User;
import com.financetracker.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class DashboardService {
  private final AccountService accountService;
  private final TransactionService transactionService;
  private final UserRepository userRepository;

   // Pomocnicza metoda pobierająca aktualnie zalogowanego użytkownika z JWT
    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

  public DashboardResponse getDashboard(int year, int month) {
    UUID userId = getAuthenticatedUser().getId(); // Pobieramy ID aktualnie zalogowanego użytkownika

    // SEKCJA 1 - MAJĄTEK
    List<AccountResponse> accounts = accountService.getAllUserAccounts();
    BigDecimal totalNetWorth = accounts.stream()
      .map(AccountResponse::getBalance)
      .reduce(BigDecimal.ZERO, BigDecimal::add);
    List<DashboardAccountResponse> dashboardAccounts = accounts.stream()
    .map(a -> new DashboardAccountResponse(a.getId(), a.getName(), a.getType(), a.getCurrency(), a.getBalance()))
    .toList(); 
    WealthSummaryResponse wealthSummary = new WealthSummaryResponse(totalNetWorth, dashboardAccounts);
    
    // SEKCJA 2 - BILANS TRANSAKCJI
    BigDecimal totalIncome = transactionService.getTotalIncomeForMonth(userId, year, month);
    BigDecimal totalExpenses = transactionService.getTotalExpensesForMonth(userId, year, month);
    BigDecimal transactionBalance = totalIncome.subtract(totalExpenses);
    TransactionSummaryResponse transactionSummary = new TransactionSummaryResponse(totalIncome, totalExpenses, transactionBalance);

    // SEKCJA 3 - STRUKTURA WYDATKÓW
    List<ExpenseBreakdownResponse> expenseBreakdown = transactionService.getExpensesPerCategory(userId, year);

    // SEKCJA 4 - TOP 5 OSTATNICH TRANSAKCJI
    List<RecentTransactionResponse> recentTransactions = transactionService.getRecentTransactions(userId);

    return new DashboardResponse(wealthSummary, transactionSummary, recentTransactions, expenseBreakdown);
  }

  // SEKCJA 5 - HISTORIA MAJĄTKU (DO WYKRESU)
  public List<NetWorthPointResponse> getNetWorthHistory(int months) {
    UUID userId = getAuthenticatedUser().getId();

    List<AccountResponse> accounts = accountService.getAllUserAccounts();
    BigDecimal currentNetWorth = accounts.stream()
      .map(AccountResponse::getBalance)
      .reduce(BigDecimal.ZERO, BigDecimal::add);

    List<NetWorthPointResponse> history = new ArrayList<>();
    LocalDate now = LocalDate.now();

    for (int i = months - 1; i >= 0; i--) {
      LocalDate monthDate = now.minusMonths(i);
      LocalDate monthEnd = monthDate.with(TemporalAdjusters.lastDayOfMonth());

      BigDecimal incomeAfter = transactionService.getSumByTypeAfterDate(userId, TransactionType.INCOME, monthEnd);
      BigDecimal expenseAfter = transactionService.getSumByTypeAfterDate(userId, TransactionType.EXPENSE, monthEnd);

      BigDecimal netWorthAtMonthEnd = currentNetWorth.subtract(incomeAfter).add(expenseAfter);

      String label = monthDate.getMonth().getDisplayName(TextStyle.SHORT, new Locale("pl"));
      label = label.substring(0, 1).toUpperCase() + label.substring(1);

      history.add(new NetWorthPointResponse(label, netWorthAtMonthEnd));
    }

    return history;
  }
}
