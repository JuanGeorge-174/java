package com.etracker.expensetracker.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TransactionRequest {
    @NotNull
    private String type; // expense, income, transfer

    @NotNull @Min(0)
    private Double amount;

    private Long accountFromId;
    private Long accountToId;
    private String note;
}
