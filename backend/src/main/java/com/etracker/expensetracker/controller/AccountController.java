package com.etracker.expensetracker.controller;

import com.etracker.expensetracker.dto.AccountRequest;
import com.etracker.expensetracker.model.Account;
import com.etracker.expensetracker.model.User;
import com.etracker.expensetracker.service.AccountService;
import com.etracker.expensetracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Account>> list() {
        User user = userService.getCurrentUser()
                      .orElseThrow(() -> new RuntimeException("User not authenticated"));

        return ResponseEntity.ok(accountService.list(user));
    }

    @PostMapping
    public ResponseEntity<Account> create(@Valid @RequestBody AccountRequest req) {
        User user = userService.getCurrentUser()
                      .orElseThrow(() -> new RuntimeException("User not authenticated"));

        Account account = Account.builder()
                .name(req.getName())
                .currency(req.getCurrency())
                .initialAmount(req.getInitialAmount())
                .note(req.getNote())
                .build();
        Account saved = accountService.create(user, account);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Account> update(@PathVariable Long id, @Valid @RequestBody AccountRequest req) {
        User user = userService.getCurrentUser()
                      .orElseThrow(() -> new RuntimeException("User not authenticated"));

        Account updated = Account.builder()
                .name(req.getName())
                .note(req.getNote())
                .build();
        return ResponseEntity.ok(accountService.update(id, updated, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        User user = userService.getCurrentUser()
                      .orElseThrow(() -> new RuntimeException("User not authenticated"));

        accountService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
