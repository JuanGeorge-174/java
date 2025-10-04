// OverviewController.java - COMPLETE UPDATED VERSION
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
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class OverviewController {
    private final BudgetService budgetService;
    private final ExpenseService expenseService;
    private final AccountService accountService;
    private final UserService userService;

    @GetMapping("/home")
    public ResponseEntity<Map<String, Object>> home() {
        try {
            User user = userService.getCurrentUser()
                    .orElseThrow(() -> new RuntimeException("User not authenticated"));

            // Get all budgets
            List<Budget> budgets = budgetService.getAllBudgets(user);
            
            // Get all accounts
            List<Account> accounts = accountService.list(user);
            
            // Get all expenses
            List<Expense> allExpenses = expenseService.list(user);
            
            // Sort and get recent 8 expenses
            List<Expense> recent = allExpenses.stream()
                    .sorted(Comparator.comparing(Expense::getDate).reversed())
                    .limit(8)
                    .collect(Collectors.toList());

            // Calculate spending this month aggregated by category
            LocalDate now = LocalDate.now(ZoneOffset.UTC);
            Instant monthStart = now.withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);
            Instant monthEnd = now.plusMonths(1).withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);

            List<Expense> monthExpenses = allExpenses.stream()
                    .filter(e -> e.getDate() != null)
                    .filter(e -> !e.getDate().isBefore(monthStart) && e.getDate().isBefore(monthEnd))
                    .collect(Collectors.toList());

            // Group expenses by category
            Map<String, Double> spendingByCategory = new HashMap<>();
            for (Expense e : monthExpenses) {
                String cat = (e.getCategory() == null || e.getCategory().isEmpty()) 
                        ? "Uncategorized" 
                        : e.getCategory();
                spendingByCategory.put(cat, spendingByCategory.getOrDefault(cat, 0.0) + e.getAmount());
            }

            // Build response
            Map<String, Object> resp = new HashMap<>();
            resp.put("budgets", budgets);
            resp.put("spendingThisMonth", spendingByCategory);
            resp.put("recentExpenses", recent);
            resp.put("accounts", accounts);

            return ResponseEntity.ok(resp);
            
        } catch (Exception e) {
            System.err.println("Error in /api/overview/home: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResp = new HashMap<>();
            errorResp.put("error", e.getMessage());
            errorResp.put("details", e.getClass().getSimpleName());
            return ResponseEntity.status(500).body(errorResp);
        }
    }
}