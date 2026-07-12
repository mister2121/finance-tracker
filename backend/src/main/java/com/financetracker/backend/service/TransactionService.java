package com.financetracker.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.financetracker.backend.dto.request.TransactionRequest;
import com.financetracker.backend.dto.response.PagedResponse;
import com.financetracker.backend.dto.response.TransactionResponse;
import com.financetracker.backend.dto.response.dashboard.ExpenseBreakdownResponse;
import com.financetracker.backend.dto.response.dashboard.RecentTransactionResponse;
import com.financetracker.backend.exception.ResourceNotFoundException;
import com.financetracker.backend.exception.UnauthorizedException;
import com.financetracker.backend.model.Account;
import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.Transaction;
import com.financetracker.backend.model.TransactionType;
import com.financetracker.backend.model.User;
import com.financetracker.backend.repository.AccountRepository;
import com.financetracker.backend.repository.CategoryRepository;
import com.financetracker.backend.repository.TransactionRepository;
import com.financetracker.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class TransactionService {
  private final TransactionRepository transactionRepository;
  private final AccountRepository accountRepository;
  private final CategoryRepository categoryRepository;
  private final UserRepository userRepository;

  private User getAuthenticatedUser() {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByEmail(email)
      .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }

  // 1. POBIERANIE WSZYSTKICH TRANSAKCJI UŻYTKOWNIKA
  public List<TransactionResponse> getAllUserTransactions() {
    User user = getAuthenticatedUser();
    return transactionRepository.findByUserId(user.getId()).stream()
      .map(this::mapToResponse)
      .toList();
  }
  
  // 2. POBIERANIE TRANSAKCJI PO ID
  public TransactionResponse getTransactionById(UUID transactionId) {
    User user = getAuthenticatedUser();

    Transaction transaction = transactionRepository.findById(transactionId)
      .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

    if (!transaction.getUser().getId().equals(user.getId())) {
      throw new UnauthorizedException("No access to this transaction");
    }

    return mapToResponse(transaction);
  }


  // 3. TWORZENIE TRANSAKCJI
  public TransactionResponse createTransaction(TransactionRequest request) {
    User user = getAuthenticatedUser();

    Account account = accountRepository.findById(request.getAccountId())
      .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

    if (!account.getUser().getId().equals(user.getId())) {
        throw new UnauthorizedException("No access to this account");
    }

    Category category = null;
    if (request.getCategoryId() != null) {
      category = categoryRepository.findById(request.getCategoryId())
        .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    Transaction transaction = new Transaction();
    transaction.setUser(user);
    transaction.setAccount(account);
    transaction.setCategory(category);
    transaction.setType(request.getType());
    transaction.setAmount(request.getAmount());
    transaction.setTransactionDate(request.getTransactionDate());
    transaction.setNote(request.getNote());

    switch (request.getType()) {
      case INCOME -> account.setBalance(account.getBalance().add(request.getAmount()));
      case EXPENSE -> account.setBalance(account.getBalance().subtract(request.getAmount()));
      case TRANSFER -> {
        if (request.getToAccountId() == null) {
          throw new IllegalArgumentException("Target account is required for transfer");
        } else {
          Account toAccount = accountRepository.findById(request.getToAccountId())
                  .orElseThrow(() -> new ResourceNotFoundException("Target account not found"));
          account.setBalance(account.getBalance().subtract(request.getAmount()));
          toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));
          accountRepository.save(account);
          accountRepository.save(toAccount);
          transaction.setToAccount(toAccount);
        }
      }
    }
    
    Transaction savedTransaction = transactionRepository.saveAndFlush(transaction);
    return mapToResponse(savedTransaction);
  }


  // 4. USUWANIE TRANSAKCJI
  public void deleteTransaction(UUID id) {
    User user = getAuthenticatedUser();

    Transaction transaction = transactionRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

    if (!transaction.getUser().getId().equals(user.getId())) {
      throw new UnauthorizedException("No access to this transaction");
    }

     switch (transaction.getType()) {
      case INCOME -> transaction.getAccount().setBalance(transaction.getAccount().getBalance().subtract(transaction.getAmount()));
      case EXPENSE -> transaction.getAccount().setBalance(transaction.getAccount().getBalance().add(transaction.getAmount()));
      case TRANSFER -> {
        if (transaction.getToAccount() == null) {
          throw new IllegalArgumentException("Target account is required for transfer");
        } else {
          Account toAccount = accountRepository.findById(transaction.getToAccount().getId())
                  .orElseThrow(() -> new ResourceNotFoundException("Target account not found"));
          transaction.getAccount().setBalance(transaction.getAccount().getBalance().add(transaction.getAmount()));
          toAccount.setBalance(toAccount.getBalance().subtract(transaction.getAmount()));
          accountRepository.save(transaction.getAccount());
          accountRepository.save(toAccount);
          transaction.setToAccount(toAccount);
        }
      }
    }

    transactionRepository.delete(transaction);
  }

  // 5. EDYCJA TRANSAKCJI
  public TransactionResponse editTransaction(UUID id, TransactionRequest request) {
    User user = getAuthenticatedUser();
    Transaction transaction = transactionRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

    if (!transaction.getUser().getId().equals(user.getId())) {
      throw new UnauthorizedException("No access to this transaction");
    }

    Account account = accountRepository.findById(request.getAccountId())
    .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

    Category category = request.getCategoryId() != null 
      ? categoryRepository.findById(request.getCategoryId())
        .orElseThrow(() -> new ResourceNotFoundException("Category not found"))
      : null;

    transaction.setUser(user);
    transaction.setAccount(account);
    transaction.setCategory(category);
    transaction.setType(request.getType());
    transaction.setAmount(request.getAmount());
    transaction.setTransactionDate(request.getTransactionDate());
    transaction.setNote(request.getNote());
    
    Transaction savedTransaction = transactionRepository.saveAndFlush(transaction);
    return mapToResponse(savedTransaction);
  }

  // 6. DODATKOWE METODY DO DASHBOARDU - SUMA WYDATKÓW, PRZYCHODÓW, PODZIAŁ WYDATKÓW NA KATEGORIE, OSTATNIE TRANSAKCJE
  public BigDecimal getTotalExpensesForMonth(UUID userId, int year, int month) {
    BigDecimal result = transactionRepository.findTotalAmountByTypeAndMonth(userId, TransactionType.EXPENSE, month, year);
    return result != null ? result : BigDecimal.ZERO;
  }

  public BigDecimal getTotalIncomeForMonth(UUID userId, int year, int month) {
    BigDecimal result = transactionRepository.findTotalAmountByTypeAndMonth(userId, TransactionType.INCOME, month, year);
    return result != null ? result : BigDecimal.ZERO;
}

  public List<ExpenseBreakdownResponse> getExpensesPerCategory(UUID userId, int year) {
    List<Object[]> rows = transactionRepository.findExpensesPerCategory(userId, TransactionType.EXPENSE, year);
    BigDecimal total = rows.stream()
      .map(row -> (BigDecimal) row[1])
      .reduce(BigDecimal.ZERO, BigDecimal::add);
    return rows.stream()
        .map(row -> {
        BigDecimal amount = (BigDecimal) row[1];
        BigDecimal percentage = amount
        .multiply(BigDecimal.valueOf(100))
        .divide(total, 2, RoundingMode.HALF_UP);
        return new ExpenseBreakdownResponse((String) row[0], amount, percentage);
    })
    .toList();
  }

  public List<RecentTransactionResponse> getRecentTransactions(UUID userId) {
    return transactionRepository.findTop5ByUserIdOrderByTransactionDateDesc(userId).stream()
        .map(t -> new RecentTransactionResponse(
            t.getId(),
            t.getNote(),
            t.getTransactionDate(),
            t.getType(),
            t.getAmount(),
            t.getCategory() != null ? t.getCategory().getName() : null,
            t.getAccount().getName(),
            t.getToAccount() != null ? t.getToAccount().getName() : null
        ))
        .toList();
  }


  // wykres laczny majatek
  public BigDecimal getSumByTypeAfterDate(UUID userId, TransactionType type, LocalDate date) {
    BigDecimal result = transactionRepository.findSumByTypeAfterDate(userId, type, date);
    return result != null ? result : BigDecimal.ZERO;
  }


  // 7. PAGINACJA W TRANSAKCJI W ZAKLADCE "TRANSAKCJE"
  public PagedResponse<TransactionResponse> getTransactionsForMonth(int year, int month, Pageable pageable) {
    User user = getAuthenticatedUser();
    LocalDate start = LocalDate.of(year, month, 1);
    LocalDate end = start.with(TemporalAdjusters.lastDayOfMonth());

    Page<Transaction> transactions = transactionRepository.findByUserAndDateRange(user.getId(), start, end, pageable);

    Page<TransactionResponse> page = transactions.map(this::mapToResponse);

    return new PagedResponse<>(
      page.getContent(),
      page.getNumber(),
      page.getSize(),
      page.getTotalElements(),
      page.getTotalPages()
    );
  }


  private TransactionResponse mapToResponse(Transaction transaction) {
    return new TransactionResponse(
      transaction.getId(),
      transaction.getAccount().getName(),
      transaction.getToAccount() != null ? transaction.getToAccount().getName() : null,
      transaction.getAmount(),
      transaction.getType(),
      transaction.getCategory() != null ? transaction.getCategory().getName() : null,
      transaction.getNote(),
      transaction.getTransactionDate(),
      transaction.getCreatedAt(),
      transaction.getUpdatedAt()
    );
  }
}
