package com.etracker.expensetracker.repository;

import com.etracker.expensetracker.model.Transaction;
import com.etracker.expensetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserOrderByDateDesc(User user);
}
