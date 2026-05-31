package com.financetracker.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.financetracker.backend.model.CategoryType;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoryResponse {
  private UUID id;
  private String name;
  private CategoryType type;
  private boolean defaultCategory;
  private LocalDateTime createdAt;
}
