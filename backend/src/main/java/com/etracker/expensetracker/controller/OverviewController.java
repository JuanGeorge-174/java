package com.etracker.expensetracker.controller;

import com.etracker.expensetracker.model.Account;
import com.etracker.expensetracker.model.Budget;
import com.etracker.expensetracker.model.Transaction;
import com.etracker.expensetracker.model.User;
import com.etracker.expensetracker.service.AccountService;
import com.etracker.expensetracker.service.BudgetService;
import com.etracker.expensetracker.service.TransactionService;
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
    private final TransactionService transactionService;
    private final AccountService accountService;
    private final UserService userService;

    // Helper method to extract category from transaction note
    private String extractCategoryFromNote(String note) {
        if (note == null || note.isEmpty()) {
            return null;
        }
        // Extract category from format: [Category] description
        if (note.startsWith("[")) {
            int endBracket = note.indexOf("]");
            if (endBracket > 1) {
                return note.substring(1, endBracket);
            }
        }
        return null;
    }

    @GetMapping("/home")
    public ResponseEntity<Map<String, Object>> home() {
        try {
            User user = userService.getCurrentUser()
                    .orElseThrow(() -> new RuntimeException("User not authenticated"));

            System.out.println("Fetching overview for user ID: " + user.getId());

            // Get all budgets
            List<Budget> budgets = budgetService.getAllBudgets(user);
            System.out.println("Found " + budgets.size() + " budgets");
            
            // Get all accounts
            List<Account> accounts = accountService.list(user);
            System.out.println("Found " + accounts.size() + " accounts");
            
            // Get all transactions
            List<Transaction> allTransactions = transactionService.getAllTransactions(user);
            System.out.println("Found " + allTransactions.size() + " total transactions");
            
            // Filter only expense transactions
            List<Transaction> expenseTransactions = allTransactions.stream()
                    .filter(t -> "expense".equalsIgnoreCase(t.getType()))
                    .collect(Collectors.toList());
            
            System.out.println("Found " + expenseTransactions.size() + " expense transactions");
            
            // Sort and get recent 8 expense transactions
            List<Map<String, Object>> recentExpenses = expenseTransactions.stream()
                    .sorted(Comparator.comparing(Transaction::getDate).reversed())
                    .limit(8)
                    .map(t -> {
                        Map<String, Object> expenseMap = new HashMap<>();
                        expenseMap.put("amount", t.getAmount());
                        expenseMap.put("date", t.getDate());
                        expenseMap.put("description", t.getNote());
                        expenseMap.put("note", t.getNote());
                        expenseMap.put("category", extractCategoryFromNote(t.getNote()));
                        return expenseMap;
                    })
                    .collect(Collectors.toList());

            System.out.println("Returning " + recentExpenses.size() + " recent expenses");

            // Calculate spending this month aggregated by category
            LocalDate now = LocalDate.now(ZoneOffset.UTC);
            Instant monthStart = now.withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);
            Instant monthEnd = now.plusMonths(1).withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);

            System.out.println("Current month: " + now.getMonth() + " " + now.getYear());
            System.out.println("Month range: " + monthStart + " to " + monthEnd);

            List<Transaction> monthExpenses = expenseTransactions.stream()
                    .filter(t -> t.getDate() != null)
                    .filter(t -> !t.getDate().isBefore(monthStart) && t.getDate().isBefore(monthEnd))
                    .collect(Collectors.toList());

            System.out.println("Found " + monthExpenses.size() + " expenses in current month");

            // Group expenses by category
            // Extract category from note format: [Category] description
            Map<String, Double> spendingByCategory = new HashMap<>();
            for (Transaction t : monthExpenses) {
                String cat = extractCategoryFromNote(t.getNote());
                if (cat == null || cat.isEmpty()) {
                    cat = "Uncategorized";
                }
                System.out.println("Transaction: " + t.getNote() + " -> Category: " + cat + ", Amount: " + t.getAmount());
                spendingByCategory.put(cat, spendingByCategory.getOrDefault(cat, 0.0) + t.getAmount());
            }

            System.out.println("Spending by category: " + spendingByCategory);

            // Build response
            Map<String, Object> resp = new HashMap<>();
            resp.put("budgets", budgets);
            resp.put("spendingThisMonth", spendingByCategory);
            resp.put("recentExpenses", recentExpenses);
            resp.put("accounts", accounts);
            resp.put("monthlyBudgetLimit", user.getMonthlyBudgetLimit());

            System.out.println("Response ready - Budgets: " + budgets.size() + 
                             ", Categories: " + spendingByCategory.size() + 
                             ", Recent: " + recentExpenses.size() +
                             ", Monthly Limit: " + user.getMonthlyBudgetLimit());

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