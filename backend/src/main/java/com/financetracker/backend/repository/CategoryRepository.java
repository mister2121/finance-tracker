package com.financetracker.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.CategoryType;
import com.financetracker.backend.model.User;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
  List<Category> findByUserId(UUID userId);
  List<Category> findByUserIdAndType(UUID userId, CategoryType type);
  Optional<Category> findByIdAndUserId(UUID id, UUID userId);
  void deleteAllByUser(User user);
}
