package com.etracker.expensetracker.service;

import com.etracker.expensetracker.model.*;
import com.etracker.expensetracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepo;
    private final AccountRepository accountRepo;
    private final TransactionRepository txRepo;
    private final BudgetRepository budgetRepo;

    public List<Expense> list(User user) {
        return expenseRepo.findByUserOrderByDateDesc(user);
    }

    @Transactional
    public Expense createExpense(User user, Long accountId, Double amount, String category, String description, Long budgetId, Instant date) {
        Account account = accountRepo.findById(accountId).orElseThrow(() -> new RuntimeException("Account not found"));
        if (!account.getUser().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");

        if (amount == null || amount <= 0) throw new RuntimeException("Amount must be positive");

        Budget budget = null;
        if (budgetId != null) {
            budget = budgetRepo.findById(budgetId).orElse(null);
        }

        Expense e = Expense.builder()
                .user(user)
                .account(account)
                .amount(amount)
                .category(category)
                .description(description)
                .date(date == null ? Instant.now() : date)
                .budget(budget)
                .build();

        Expense saved = expenseRepo.save(e);

        // deduct from account balance
        account.setCurrentBalance(account.getCurrentBalance() - amount);
        accountRepo.save(account);

        // transaction record
        Transaction tx = Transaction.builder()
                .user(user)
                .type("expense")
                .amount(amount)
                .date(e.getDate())
                .accountFrom(account)
                .note(description)
                .build();
        txRepo.save(tx);

        return saved;
    }

    @Transactional
    public void deleteExpense(Long expenseId, User user) {
        Expense e = expenseRepo.findById(expenseId).orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!e.getUser().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        Account account = e.getAccount();
        account.setCurrentBalance(account.getCurrentBalance() + e.getAmount()); // restore
        accountRepo.save(account);
        expenseRepo.delete(e);
        // optionally remove transaction(s)
    }
}
