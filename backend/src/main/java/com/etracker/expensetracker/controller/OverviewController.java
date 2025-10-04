package com.etracker.expensetracker.controller;

import com.etracker.expensetracker.model.Account;
import com.etracker.expensetracker.model.Budget;
import com.etracker.expensetracker.model.Expense;
import com.etracker.expensetracker.model.User;
import com.etracker.expensetracker.service.AccountService;
import com.etracker.expensetracker.service.BudgetService;
import com.etracker.expensetracker.service.ExpenseService;
import com.etracker.expensetracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/overview")
@RequiredArgsConstructor
public class OverviewController {
    private final BudgetService budgetService;
    private final ExpenseService expenseService;
    private final AccountService accountService;
    private final UserService userService;

    @GetMapping("/home")
    public ResponseEntity<Map<String, Object>> home() {
        User user = userService.getCurrentUser();

        List<Budget> budgets = budgetService.list(user);
        List<Account> accounts = accountService.list(user);
        List<Expense> recent = expenseService.list(user).stream().limit(8).collect(Collectors.toList());

        // Spending this month aggregated by category
        LocalDate now = LocalDate.now(ZoneOffset.UTC);
        Instant monthStart = now.withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant monthEnd = now.plusMonths(1).withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);

        List<Expense> monthExpenses = expenseService.list(user).stream()
                .filter(e -> !e.getDate().isBefore(monthStart) && e.getDate().isBefore(monthEnd))
                .collect(Collectors.toList());

        Map<String, Double> spendingByCategory = new HashMap<>();
        for (Expense e : monthExpenses) {
            String cat = e.getCategory() == null ? "Uncategorized" : e.getCategory();
            spendingByCategory.put(cat, spendingByCategory.getOrDefault(cat, 0.0) + e.getAmount());
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("budgets", budgets);
        resp.put("spendingThisMonth", spendingByCategory);
        resp.put("recentExpenses", recent);
        resp.put("accounts", accounts);

        return ResponseEntity.ok(resp);
    }
}
