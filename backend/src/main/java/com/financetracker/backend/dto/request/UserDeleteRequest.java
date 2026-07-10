package com.financetracker.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDeleteRequest {
    @NotBlank(message = "Password is required")
    private String password;
}