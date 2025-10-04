package com.etracker.expensetracker.repository;

import com.etracker.expensetracker.model.Budget;
import com.etracker.expensetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUser(User user);
}
