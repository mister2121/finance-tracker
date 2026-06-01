package com.financetracker.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.financetracker.backend.dto.request.TransactionRequest;
import com.financetracker.backend.dto.response.TransactionResponse;
import com.financetracker.backend.exception.ResourceNotFoundException;
import com.financetracker.backend.exception.UnauthorizedException;
import com.financetracker.backend.model.Account;
import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.Transaction;
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
