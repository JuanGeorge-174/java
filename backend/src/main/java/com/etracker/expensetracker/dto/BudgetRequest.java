package com.etracker.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BudgetRequest {
    @NotBlank(message = "Budget name is required")
    private String name;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    private String period; // monthly, yearly, one-time

    private List<String> categories;

    private Integer alertThresholdPercent;
}