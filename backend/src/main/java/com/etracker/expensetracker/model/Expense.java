package com.etracker.expensetracker.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "expenses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Expense {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private com.etracker.expensetracker.model.User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(nullable = false)
    private Double amount;

    private String category;

    private String description;

    @Column(nullable = false)
    private Instant date = Instant.now();

    @ManyToOne
    @JoinColumn(name = "budget_id")
    private Budget budget;
}
