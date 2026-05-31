package com.financetracker.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.financetracker.backend.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
  List<Transaction> findByUserId(UUID userId);
}
