package com.etracker.expensetracker.service;

import com.etracker.expensetracker.model.Category;
import com.etracker.expensetracker.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(String name) {
        return categoryRepository.findByName(name)
            .orElseGet(() -> {
                Category category = new Category();
                category.setName(name);
                return categoryRepository.save(category);
            });
    }

    public void initializeDefaultCategories() {
        if (categoryRepository.count() == 0) {
            String[] defaultCategories = {
                "Groceries", "Dining", "Transportation", "Shopping", 
                "Coffee", "Entertainment", "Utilities", "Healthcare", 
                "Salary", "Investment", "Other"
            };
            for (String cat : defaultCategories) {
                createCategory(cat);
            }
        }
    }
}