package com.financetracker.backend.dto.request;

import com.financetracker.backend.model.CategoryType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {
  @NotBlank(message = "Category name cannot be blank")
  private String name;

  @NotNull(message = "Category type is required")
  private CategoryType type;
}
