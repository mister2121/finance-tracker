package com.financetracker.backend.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.financetracker.backend.model.Transaction;
import com.financetracker.backend.model.TransactionType;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
  List<Transaction> findByUserId(UUID userId);
  List<Transaction> findByUserIdAndAccountId(UUID userId, UUID accountId);
  List<Transaction> findByUserIdAndType(UUID userId, TransactionType type);

  @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type AND MONTH(t.transactionDate) = :month AND YEAR(t.transactionDate) = :year")
  BigDecimal findTotalAmountByTypeAndMonth(@Param("userId") UUID userId, @Param("type") TransactionType type, @Param("month") int month, @Param("year") int year);
  
  @Query("SELECT t.category.name, SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type AND YEAR(t.transactionDate) = :year GROUP BY t.category.name")
  List<Object[]> findExpensesPerCategory(@Param("userId") UUID userId, @Param("type") TransactionType type, @Param("year") int year);

  List<Transaction> findTop5ByUserIdOrderByTransactionDateDesc(UUID userId);

  @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.transactionDate BETWEEN :start AND :end")
  Page<Transaction> findByUserAndDateRange(@Param("userId") UUID userId, @Param("start") LocalDate start, @Param("end") LocalDate end, Pageable pageable);

  @Query("SELECT t.category.name, MONTH(t.transactionDate), SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type AND YEAR(t.transactionDate) = :year GROUP BY t.category.name, MONTH(t.transactionDate)")
  List<Object[]> findTotalExpensesPerCategory(@Param("userId") UUID userId, @Param("type") TransactionType type, @Param("year") int year);

}
