package com.financetracker.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.CategoryType;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
  List<Category> findByUserId(UUID userId);
  List<Category> findByUserIdAndType(UUID userId, CategoryType type);
}
