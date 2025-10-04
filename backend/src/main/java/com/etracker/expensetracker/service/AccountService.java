package com.etracker.expensetracker.service;

import com.etracker.expensetracker.model.Account;
import com.etracker.expensetracker.model.User;
import com.etracker.expensetracker.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepo;

    public List<Account> list(User user) {
        return accountRepo.findByUser(user);
    }

    @Transactional
    public Account create(User user, Account account) {
        account.setUser(user);
        if (account.getInitialAmount() == null) account.setInitialAmount(0.0);
        account.setCurrentBalance(account.getInitialAmount());
        return accountRepo.save(account);
    }

    @Transactional
    public Account update(Long id, Account updated, User user) {
        Account acc = accountRepo.findById(id).orElseThrow(() -> new RuntimeException("Account not found"));
        if (!acc.getUser().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        acc.setName(updated.getName());
        acc.setNote(updated.getNote());
        // don't allow direct change of currentBalance here - use transactions/expenses
        return accountRepo.save(acc);
    }

    @Transactional
    public void delete(Long id, User user) {
        Account acc = accountRepo.findById(id).orElseThrow(() -> new RuntimeException("Account not found"));
        if (!acc.getUser().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        accountRepo.delete(acc);
    }

    @Transactional
    public void adjustBalance(Account account, double delta) {
        account.setCurrentBalance(account.getCurrentBalance() + delta);
        accountRepo.save(account);
    }

    public Account findById(Long id) {
        return accountRepo.findById(id).orElse(null);
    }
}
