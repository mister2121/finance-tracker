package com.financetracker.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.financetracker.backend.dto.response.analytics.MonthlyAnalyticsResponse;
import com.financetracker.backend.dto.response.analytics.PerCategoryResponse;
import com.financetracker.backend.service.AnalyticsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
  private final AnalyticsService analyticsService;

  @GetMapping
  public ResponseEntity<List<MonthlyAnalyticsResponse>> getYearlyAnalytics(@RequestParam int year) {
    return ResponseEntity.ok(analyticsService.getYearlyAnalytics(year));
  }

  @GetMapping("/categories")
  public ResponseEntity<List<PerCategoryResponse>>
  getPerCategoryAnalytics(@RequestParam int year) {
    return ResponseEntity.ok(analyticsService.getPerCategoryAnalytics(year));
  }
}
