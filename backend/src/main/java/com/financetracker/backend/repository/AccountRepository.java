package com.financetracker.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.financetracker.backend.model.Account;

public interface AccountRepository extends JpaRepository<Account, UUID> {
  List<Account> findByUserId(UUID userId);
}
