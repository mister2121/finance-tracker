package com.financetracker.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
  
  @NotBlank(message = "Email is required")
  @Email(message = "Email should be valid")
  private String email;

  @NotBlank(message = "Password is required")
  @Size(min = 8, message = "Password must be at least 8 characters long")
  private String password;

 @NotBlank(message = "First name is required")
  @Size(min = 1, message = "First name must be at least 1 characters long")
  private String firstName;
  
   @NotBlank(message = "Last name is required")
  @Size(min = 1, message = "Last name must be at least 1 characters long")
  private String lastName;
}
