package com.financetracker.backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.financetracker.backend.dto.request.UserDeleteRequest;
import com.financetracker.backend.dto.request.UserPasswordRequest;
import com.financetracker.backend.dto.request.UserProfileRequest;
import com.financetracker.backend.dto.response.UserResponse;
import com.financetracker.backend.model.User;
import com.financetracker.backend.repository.AccountRepository;
import com.financetracker.backend.repository.CategoryRepository;
import com.financetracker.backend.repository.TransactionRepository;
import com.financetracker.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final TransactionRepository transactionRepository;
  private final AccountRepository accountRepository;
  private final CategoryRepository categoryRepository;

   // Pomocnicza metoda pobierająca aktualnie zalogowanego użytkownika z JWT
    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    // 1. Aktualizacja danych profilowych (Imię, Nazwisko)
    public UserResponse updateProfile(UserProfileRequest request) {
      User currentUser = getAuthenticatedUser();

      if (!currentUser.getEmail().equalsIgnoreCase(request.getEmail())) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email " + request.getEmail() + " is already taken");
        }
        currentUser.setEmail(request.getEmail());
      }

      currentUser.setFirstName(request.getFirstName());
      currentUser.setLastName(request.getLastName());

      User updatedUser = userRepository.saveAndFlush(currentUser);
      return mapToResponse(updatedUser);
    }

    // 2. Bezpieczna zmiana hasła
    public void changePassword(UserPasswordRequest request) {
      User currentUser = getAuthenticatedUser();

      // Czy stare hasło pasuje do tego w bazie danych?
      if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPasswordHash())) {
        throw new IllegalArgumentException("Current password is incorrect");
      }

      // Jeśli tak, szyfrujemy nowe hasło przed dodaniem 
      currentUser.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
      userRepository.saveAndFlush(currentUser);
    }


    // 3. usuniecie konta
   public void deleteAccount(UserDeleteRequest request) {
    User currentUser = getAuthenticatedUser();

    if (!passwordEncoder.matches(request.getPassword(), currentUser.getPasswordHash())) {
        throw new IllegalArgumentException("Incorrect password");
    }

    transactionRepository.deleteAllByUser(currentUser);
    accountRepository.deleteAllByUser(currentUser);
    categoryRepository.deleteAllByUser(currentUser);
    userRepository.delete(currentUser);
    }

     // Mapper z encji na DTO
    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );
    }
}
