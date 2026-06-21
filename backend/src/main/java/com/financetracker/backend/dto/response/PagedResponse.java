package com.financetracker.backend.dto.response;

import java.util.List;

public record PagedResponse<T>(
  List<T> content,
  int page,
  int size,
   long totalElements,
   int totalPages
) {}
