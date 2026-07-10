package com.financetracker.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.financetracker.backend.dto.request.UserDeleteRequest;
import com.financetracker.backend.dto.request.UserPasswordRequest;
import com.financetracker.backend.dto.request.UserProfileRequest;
import com.financetracker.backend.dto.response.UserResponse;
import com.financetracker.backend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  @PutMapping("/me")
  public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UserProfileRequest request) {
    return ResponseEntity.ok(userService.updateProfile(request));
  }

  @PostMapping("/me/change-password")
  public ResponseEntity<Void> changePassword(@Valid @RequestBody UserPasswordRequest request) {
    userService.changePassword(request);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/me")
  public ResponseEntity<Void> deleteAccount(@Valid @RequestBody UserDeleteRequest request) {
    userService.deleteAccount(request);
    return ResponseEntity.noContent().build();
  }
}
