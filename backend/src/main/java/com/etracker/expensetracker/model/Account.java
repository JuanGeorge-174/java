package com.etracker.expensetracker.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accounts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Account {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private com.etracker.expensetracker.model.User user;

    @Column(nullable = false)
    private String name;

    private String currency = "INR";

    @Column(nullable = false)
    private Double initialAmount = 0.0;

    @Column(nullable = false)
    private Double currentBalance = 0.0;

    private String note;
}
