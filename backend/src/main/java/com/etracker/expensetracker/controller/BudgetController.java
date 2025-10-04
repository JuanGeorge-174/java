package com.etracker.expensetracker.controller;

import com.etracker.expensetracker.dto.BudgetRequest;
import com.etracker.expensetracker.model.Budget;
import com.etracker.expensetracker.model.User;
import com.etracker.expensetracker.service.BudgetService;
import com.etracker.expensetracker.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetService budgetService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets() {
        User user = userService.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        return ResponseEntity.ok(budgetService.getAllBudgets(user));
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(@Valid @RequestBody BudgetRequest request) {
        User user = userService.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        
        Budget budget = new Budget();
        budget.setUser(user);
        budget.setName(request.getName());
        budget.setAmount(request.getAmount());
        budget.setPeriod(request.getPeriod() != null ? request.getPeriod() : "monthly");
        budget.setCategories(request.getCategories());
        budget.setStartDate(Instant.now());
        budget.setAlertThresholdPercent(request.getAlertThresholdPercent() != null ? request.getAlertThresholdPercent() : 80);
        
        Budget saved = budgetService.create(user, budget);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(
        @PathVariable Long id, 
        @Valid @RequestBody BudgetRequest request
    ) {
        User user = userService.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        
        Budget updated = budgetService.update(id, request, user);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        User user = userService.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        budgetService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}