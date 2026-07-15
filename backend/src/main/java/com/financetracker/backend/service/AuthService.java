package com.financetracker.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.financetracker.backend.dto.request.LoginRequest;
import com.financetracker.backend.dto.request.RegisterRequest;
import com.financetracker.backend.dto.response.AuthResponse;
import com.financetracker.backend.exception.UserAlreadyExistsException;
import com.financetracker.backend.model.User;
import com.financetracker.backend.repository.UserRepository;
import com.financetracker.backend.security.JwtService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final CategoryService categoryService;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new UserAlreadyExistsException("Email is already in use");
    }

    User user = new User();
    user.setEmail(request.getEmail());
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());

    userRepository.save(user);

    categoryService.seedDefaultCategories(user);

    String token = jwtService.generateToken(user.getEmail());
    return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName());
  }

  public AuthResponse login(LoginRequest request) {
    authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(
        request.getEmail(), 
        request.getPassword())
    );

    User user = userRepository.findByEmail(request.getEmail())
      .orElseThrow(() -> new RuntimeException("User not found"));

    String token = jwtService.generateToken(user.getEmail());
    return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName());  
  }
}
