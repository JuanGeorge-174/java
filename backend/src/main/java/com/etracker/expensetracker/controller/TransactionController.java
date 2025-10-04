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

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService txService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Transaction> create(@Valid @RequestBody TransactionRequest req) {
        User user = userService.getCurrentUser();
        Transaction tx = txService.createTransaction(user, req.getType(), req.getAmount(), req.getAccountFromId(), req.getAccountToId(), req.getNote());
        return ResponseEntity.status(201).body(tx);
    }
}
