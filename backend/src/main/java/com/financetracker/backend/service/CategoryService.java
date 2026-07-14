package com.financetracker.backend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.financetracker.backend.dto.request.CategoryRequest;
import com.financetracker.backend.dto.response.CategoryResponse;
import com.financetracker.backend.exception.ResourceNotFoundException;
import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.CategoryType;
import com.financetracker.backend.model.User;
import com.financetracker.backend.repository.CategoryRepository;
import com.financetracker.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {
  private final CategoryRepository categoryRepository;
  private final UserRepository userRepository;

  private User getAuthenticatedUser() {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
  }

  public void seedDefaultCategories(User user) {
    List<String[]> defaults = List.of(
      new String[]{"Mieszkanie", "EXPENSE"},
      new String[]{"Wypłata", "INCOME"}
    );

    List<Category> categories = defaults.stream().map(entry -> {
      Category category = new Category();
      category.setName(entry[0]);
      category.setType(CategoryType.valueOf(entry[1]));
      category.setDefaultCategory(true);
      category.setUser(user);
      return category;
    }).collect(Collectors.toList());

    categoryRepository.saveAll(categories);
  }


  public List<CategoryResponse> getAllUserCategories() {
    User user = getAuthenticatedUser();
    return categoryRepository.findByUserId(user.getId()).stream()
      .map(this::mapToResponse)
      .collect(Collectors.toList());
  }

  public CategoryResponse createCategory(CategoryRequest request) {
    User user = getAuthenticatedUser();

    Category category = new Category();
    category.setName(request.getName());
    category.setType(request.getType());
    category.setDefaultCategory(false);
    category.setUser(user);

    Category savedCategory = categoryRepository.saveAndFlush(category);
    return mapToResponse(savedCategory);
  }


  public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
    User user = getAuthenticatedUser();

    Category category = categoryRepository.findByIdAndUserId(id, user.getId())
      .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

    category.setName(request.getName());
    category.setType(request.getType());

    return mapToResponse(categoryRepository.save(category));
  }


  public void deleteCategory(UUID id) {
    User user = getAuthenticatedUser();
    Category category = categoryRepository.findByIdAndUserId(id, user.getId())
      .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

    if (category.isDefaultCategory()) {
      throw new RuntimeException("Cannot delete default category");
    }

    categoryRepository.delete(category);
  }

  private CategoryResponse mapToResponse(Category category) {
    return new CategoryResponse(
      category.getId(),
      category.getName(),
      category.getType(),
      category.isDefaultCategory(),
      category.getCreatedAt()
    );
  }
}
