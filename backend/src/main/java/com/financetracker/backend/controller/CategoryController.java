package com.financetracker.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.financetracker.backend.dto.request.CategoryRequest;
import com.financetracker.backend.dto.response.CategoryResponse;
import com.financetracker.backend.service.CategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
  private final CategoryService categoryService;

  @GetMapping
  public ResponseEntity<List<CategoryResponse>> getAllCategories() {
    return ResponseEntity.ok(categoryService.getAllUserCategories());
  }

  @PostMapping
  public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
    return new ResponseEntity<>(categoryService.createCategory(request), HttpStatus.CREATED);
  }

  @PutMapping("/{id}")
  public ResponseEntity<CategoryResponse> updateCategory(
    @PathVariable UUID id,
    @Valid @RequestBody CategoryRequest request) {
      return ResponseEntity.ok(categoryService.updateCategory(id, request));
  }


  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
    categoryService.deleteCategory(id);
    return ResponseEntity.noContent().build();
  }

}