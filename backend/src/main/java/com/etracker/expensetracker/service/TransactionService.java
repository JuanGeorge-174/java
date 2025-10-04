package com.etracker.expensetracker.service;

import com.etracker.expensetracker.model.*;
import com.etracker.expensetracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository txRepo;
    private final AccountRepository accountRepo;

    @Transactional
    public Transaction createTransaction(User user, String type, Double amount, Long accountFromId, Long accountToId, String note) {
        if (amount == null || amount <= 0) throw new RuntimeException("Amount must be positive");
        if ("transfer".equalsIgnoreCase(type)) {
            if (accountFromId == null || accountToId == null) throw new RuntimeException("Both accounts required for transfer");
            Account from = accountRepo.findById(accountFromId).orElseThrow(() -> new RuntimeException("Account not found"));
            Account to = accountRepo.findById(accountToId).orElseThrow(() -> new RuntimeException("Account not found"));
            if (!from.getUser().getId().equals(user.getId()) || !to.getUser().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");

            from.setCurrentBalance(from.getCurrentBalance() - amount);
            to.setCurrentBalance(to.getCurrentBalance() + amount);
            accountRepo.save(from);
            accountRepo.save(to);

            Transaction tx = Transaction.builder()
                    .user(user)
                    .type("transfer")
                    .amount(amount)
                    .date(Instant.now())
                    .accountFrom(from)
                    .accountTo(to)
                    .note(note)
                    .build();
            return txRepo.save(tx);
        } else if ("expense".equalsIgnoreCase(type) || "income".equalsIgnoreCase(type)) {
            // treat accountFromId as the affected account
            if (accountFromId == null) throw new RuntimeException("Account required");
            Account acct = accountRepo.findById(accountFromId).orElseThrow(() -> new RuntimeException("Account not found"));
            if (!acct.getUser().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");

            double delta = "income".equalsIgnoreCase(type) ? amount : -amount;
            acct.setCurrentBalance(acct.getCurrentBalance() + delta);
            accountRepo.save(acct);

            Transaction tx = Transaction.builder()
                    .user(user)
                    .type(type)
                    .amount(amount)
                    .date(Instant.now())
                    .accountFrom(acct)
                    .note(note)
                    .build();
            return txRepo.save(tx);
        } else {
            throw new RuntimeException("Invalid transaction type");
        }
    }
}
