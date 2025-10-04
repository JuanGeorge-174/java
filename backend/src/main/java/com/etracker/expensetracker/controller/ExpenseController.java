package com.etracker.expensetracker.controller;

import com.etracker.expensetracker.dto.ExpenseRequest;
import com.etracker.expensetracker.model.Expense;
import com.etracker.expensetracker.model.User;
import com.etracker.expensetracker.service.ExpenseService;
import com.etracker.expensetracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService expenseService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Expense>> list() {
       User user = userService.getCurrentUser()
                      .orElseThrow(() -> new RuntimeException("User not authenticated"));
        return ResponseEntity.ok(expenseService.list(user));
    }

    @PostMapping
    public ResponseEntity<Expense> create(@Valid @RequestBody ExpenseRequest req) {
        User user = userService.getCurrentUser()
                      .orElseThrow(() -> new RuntimeException("User not authenticated"));

        Expense saved = expenseService.createExpense(user, req.getAccountId(), req.getAmount(), req.getCategory(), req.getDescription(), req.getBudgetId(), req.getDate());
        return ResponseEntity.status(201).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        User user = userService.getCurrentUser()
                      .orElseThrow(() -> new RuntimeException("User not authenticated"));

        expenseService.deleteExpense(id, user);
        return ResponseEntity.noContent().build();
    }
}
