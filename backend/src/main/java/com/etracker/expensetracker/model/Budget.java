package com.etracker.expensetracker.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "budgets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Budget {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private com.etracker.expensetracker.model.User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String period = "monthly"; // monthly, yearly, one-time

    @ElementCollection
    @CollectionTable(name = "budget_categories", joinColumns = @JoinColumn(name = "budget_id"))
    @Column(name = "category")
    private List<String> categories;

    private Instant startDate = Instant.now();

    private Integer alertThresholdPercent = 80;
}
