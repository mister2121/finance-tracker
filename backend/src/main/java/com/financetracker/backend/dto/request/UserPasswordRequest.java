package com.financetracker.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserPasswordRequest {

  @NotBlank(message = "Password is required")
  private String currentPassword;
  
  @Size(min = 8, message = "Password must be at least 8 characters long")
  private String newPassword;
}
