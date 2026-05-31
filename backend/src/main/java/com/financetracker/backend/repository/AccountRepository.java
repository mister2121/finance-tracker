package com.financetracker.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.financetracker.backend.model.Account;
import com.financetracker.backend.model.User;

public interface AccountRepository extends JpaRepository<Account, UUID> {
  List<Account> findByUserId(UUID userId);
}
