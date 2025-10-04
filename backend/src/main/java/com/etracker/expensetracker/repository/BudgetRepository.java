package com.etracker.expensetracker.repository;

import com.etracker.expensetracker.model.Budget;
import com.etracker.expensetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUser(User user);
    
    Optional<Budget> findByIdAndUser(Long id, User user);
}