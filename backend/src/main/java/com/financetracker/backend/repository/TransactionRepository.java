package com.financetracker.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.financetracker.backend.model.Transaction;
import com.financetracker.backend.model.TransactionType;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
  List<Transaction> findByUserId(UUID userId);
  List<Transaction> findByUserIdAndAccountId(UUID userId, UUID accountId);
  List<Transaction> findByUserIdAndType(UUID userId, TransactionType type);
}
