package com.etracker.expensetracker.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "transactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Transaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private com.etracker.expensetracker.model.User user;

    @Column(nullable = false)
    private String type; // expense, income, transfer

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private Instant date = Instant.now();

    @ManyToOne
    @JoinColumn(name = "account_from_id")
    private Account accountFrom;

    @ManyToOne
    @JoinColumn(name = "account_to_id")
    private Account accountTo;

    private String note;
}