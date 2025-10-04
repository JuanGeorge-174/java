package com.etracker.expensetracker.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BudgetRequest {
    @NotBlank
    private String name;

    @NotNull @Min(0)
    private Double amount;

    private String period; // monthly/yearly/one-time
    private List<String> categories;
    private Integer alertThresholdPercent;
}
