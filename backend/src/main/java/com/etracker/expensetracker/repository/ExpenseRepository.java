package com.etracker.expensetracker.repository;

import com.etracker.expensetracker.model.Expense;
import com.etracker.expensetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserOrderByDateDesc(User user);
    List<Expense> findByUserAndDateBetweenOrderByDateDesc(User user, Instant from, Instant to);
}
