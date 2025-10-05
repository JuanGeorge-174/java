package com.etracker.expensetracker.service;

import com.etracker.expensetracker.dto.BudgetRequest;
import com.etracker.expensetracker.model.Budget;
import com.etracker.expensetracker.model.Category;
import com.etracker.expensetracker.model.User;
import com.etracker.expensetracker.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {
    private final BudgetRepository budgetRepository;
    private final CategoryService categoryService;

    public List<Budget> getAllBudgets(User user) {
        return budgetRepository.findByUser(user);
    }

    public Budget create(User user, Budget budget) {
        budget.setUser(user);
        return budgetRepository.save(budget);
    }

    public Budget update(Long id, BudgetRequest request, User user) {
        Budget budget = budgetRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        // Update category
        Category category = categoryService.createCategory(request.getName());
        
        budget.setName(request.getName());
        budget.setCategory(category);
        budget.setAmount(request.getAmount());
        
        if (request.getPeriod() != null) {
            budget.setPeriod(request.getPeriod());
        }
        
        if (request.getAlertThresholdPercent() != null) {
            budget.setAlertThresholdPercent(request.getAlertThresholdPercent());
        }
        
        return budgetRepository.save(budget);
    }

    public void delete(Long id, User user) {
        Budget budget = budgetRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Budget not found"));
        budgetRepository.delete(budget);
    }
}