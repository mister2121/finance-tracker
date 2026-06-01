package com.financetracker.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.financetracker.backend.dto.request.TransactionRequest;
import com.financetracker.backend.dto.response.TransactionResponse;
import com.financetracker.backend.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
  
  private final TransactionService transactionService;

  @GetMapping
  public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
    return ResponseEntity.ok(transactionService.getAllUserTransactions());
  }

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
}
