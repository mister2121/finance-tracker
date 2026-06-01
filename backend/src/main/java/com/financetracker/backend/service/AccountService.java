package com.financetracker.backend.service;

import com.financetracker.backend.dto.request.AccountRequest;
import com.financetracker.backend.dto.response.AccountResponse;
import com.financetracker.backend.exception.ResourceNotFoundException;
import com.financetracker.backend.exception.UnauthorizedException;
import com.financetracker.backend.model.Account;
import com.financetracker.backend.model.User;
import com.financetracker.backend.repository.AccountRepository;
import com.financetracker.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    // Pomocnicza metoda pobierająca aktualnie zalogowanego użytkownika z JWT
    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    // 1. TWORZENIE KONTA
    public AccountResponse createAccount(AccountRequest request) {
        User currentUser = getAuthenticatedUser();

        Account account = new Account();
        account.setName(request.getName());
        account.setType(request.getType());
        account.setCurrency(request.getCurrency());
        account.setBalance(request.getBalance());
        account.setUser(currentUser);

        Account savedAccount = accountRepository.saveAndFlush(account);
        return mapToResponse(savedAccount);
    }

    // 2. POBIERANIE WSZYSTKICH KONT UŻYTKOWNIKA
    @Transactional(readOnly = true)
    public List<AccountResponse> getAllUserAccounts() {
        User currentUser = getAuthenticatedUser();
        return accountRepository.findByUserId(currentUser.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 3. POBIERANIE JEDNEGO KONTA (Z ZABEZPIECZENIEM)
    @Transactional(readOnly = true)
    public AccountResponse getAccountById(UUID id) {
        User currentUser = getAuthenticatedUser();
        
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // czy konto należy do zalogowanego usera?
        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("No access to this account");
        }

        return mapToResponse(account);
    }

    // 4. AKTUALIZACJA KONTA
    public AccountResponse updateAccount(UUID id, AccountRequest request) {
        User currentUser = getAuthenticatedUser();
        
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("No access to this account");
        }

        account.setName(request.getName());
        account.setType(request.getType());
        account.setCurrency(request.getCurrency());
        account.setBalance(request.getBalance()); // W MVP pozwalamy edytować saldo bezpośrednio

        Account updatedAccount = accountRepository.save(account);
        return mapToResponse(updatedAccount);
    }

    // 5. USUNIĘCIE KONTA
    public void deleteAccount(UUID id) {
        User currentUser = getAuthenticatedUser();
        
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("No access to this account");
        }

        accountRepository.delete(account);
    }

    // Mapper z encji na DTO
    private AccountResponse mapToResponse(Account account) {
        return new AccountResponse(
                account.getId(),
                account.getName(),
                account.getType(),
                account.getBalance(),
                account.getCurrency(),
                account.getCreatedAt(),
                account.getUpdatedAt()
        );
    }
}