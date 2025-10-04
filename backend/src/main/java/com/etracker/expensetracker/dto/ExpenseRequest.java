package com.etracker.expensetracker.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExpenseRequest {
    @NotNull
    private Long accountId;

    @NotNull @Min(0)
    private Double amount;

    private String category;
    private String description;
    private Instant date; // optional - if null backend will set now
    private Long budgetId; // optional
}
