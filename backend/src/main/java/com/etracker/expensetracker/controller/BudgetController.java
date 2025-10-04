package com.etracker.expensetracker.controller;

import com.etracker.expensetracker.dto.BudgetRequest;
import com.etracker.expensetracker.model.Budget;
import com.etracker.expensetracker.model.User;
import com.etracker.expensetracker.service.BudgetService;
import com.etracker.expensetracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetService budgetService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Budget>> list() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(budgetService.list(user));
    }

    @PostMapping
    public ResponseEntity<Budget> create(@Valid @RequestBody BudgetRequest req) {
        User user = userService.getCurrentUser();
        Budget budget = Budget.builder()
                .name(req.getName())
                .amount(req.getAmount())
                .period(req.getPeriod() == null ? "monthly" : req.getPeriod())
                .categories(req.getCategories())
                .alertThresholdPercent(req.getAlertThresholdPercent() == null ? 80 : req.getAlertThresholdPercent())
                .build();
        Budget saved = budgetService.create(user, budget);
        return ResponseEntity.status(201).body(saved);
    }
}
