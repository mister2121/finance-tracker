package com.financetracker.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.financetracker.backend.dto.response.dashboard.DashboardResponse;
import com.financetracker.backend.dto.response.dashboard.NetWorthPointResponse;
import com.financetracker.backend.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
  private final DashboardService dashboardService;

  @GetMapping
  public ResponseEntity<DashboardResponse> getDashboardData(@RequestParam int year, @RequestParam int month) {
    return ResponseEntity.ok(dashboardService.getDashboard(year, month));
  }

  @GetMapping("/net-worth-history")
  public ResponseEntity<List<NetWorthPointResponse>> getNetWorthHistory(@RequestParam(defaultValue = "6") int months) {
    return ResponseEntity.ok(dashboardService.getNetWorthHistory(months));
  }
}
