package com.financetracker.backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.financetracker.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
  private final UserRepository userRepository;

  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    return userRepository.findByEmail(email)
    .map(user -> org.springframework.security.core.userdetails.User
      .withUsername(user.getEmail())
      .password(user.getPasswordHash())
      .authorities("ROLE_USER")
      .build())
        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
  }
}
