package com.etracker.expensetracker.service;

import com.etracker.expensetracker.model.*;
import com.etracker.expensetracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {
    private final BudgetRepository budgetRepo;
    private final ExpenseRepository expenseRepo;

    public List<Budget> list(User user) {
        return budgetRepo.findByUser(user);
    }

    @Transactional
    public Budget create(User user, Budget budget) {
        budget.setUser(user);
        if (budget.getStartDate() == null) budget.setStartDate(java.time.Instant.now());
        if (budget.getAlertThresholdPercent() == null) budget.setAlertThresholdPercent(80);
        return budgetRepo.save(budget);
    }

    public Budget findById(Long id) {
        return budgetRepo.findById(id).orElse(null);
    }
}
