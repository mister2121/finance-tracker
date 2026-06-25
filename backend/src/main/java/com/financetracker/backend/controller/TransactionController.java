package com.financetracker.backend.controller;

import java.util.UUID;


import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.financetracker.backend.dto.request.TransactionRequest;
import com.financetracker.backend.dto.response.PagedResponse;
import com.financetracker.backend.dto.response.TransactionResponse;
import com.financetracker.backend.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
  
  private final TransactionService transactionService;

  // @GetMapping
  // public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
  //   return ResponseEntity.ok(transactionService.getAllUserTransactions());
  // }

  @GetMapping("/{id}")
  public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable UUID id) {
    return ResponseEntity.ok(transactionService.getTransactionById(id));
  }

  @PostMapping
  public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request) {
    return new ResponseEntity<>(transactionService.createTransaction(request), HttpStatus.CREATED);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTransaction(@PathVariable UUID id) {
    transactionService.deleteTransaction(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping
  public ResponseEntity<PagedResponse<TransactionResponse>> getTransactions(
    @RequestParam int year,
    @RequestParam int month,
    @PageableDefault(size = 20, sort = "transactionDate", direction = Sort.Direction.DESC) Pageable pageable) {
      return ResponseEntity.ok(transactionService.getTransactionsForMonth(year, month, pageable));
    }

  @PutMapping("/{id}")
public ResponseEntity<TransactionResponse> editTransaction(
    @PathVariable UUID id,
    @Valid @RequestBody TransactionRequest request) {
  return ResponseEntity.ok(transactionService.editTransaction(id, request));
}
}
