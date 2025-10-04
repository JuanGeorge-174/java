package com.etracker.expensetracker.controller;

import com.etracker.expensetracker.dto.TransactionRequest;
import com.etracker.expensetracker.model.Transaction;
import com.etracker.expensetracker.model.User;
import com.etracker.expensetracker.service.TransactionService;
import com.etracker.expensetracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService txService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        User user = userService.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        
        List<Transaction> transactions = txService.getAllTransactions(user);
        return ResponseEntity.ok(transactions);
    }

    @PostMapping
    public ResponseEntity<Transaction> create(@Valid @RequestBody TransactionRequest req) {
        User user = userService.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));

        Transaction tx = txService.createTransaction(
            user, 
            req.getType(), 
            req.getAmount(), 
            req.getAccountFromId(), 
            req.getAccountToId(), 
            req.getNote()
        );
        return ResponseEntity.status(201).body(tx);
    }
}