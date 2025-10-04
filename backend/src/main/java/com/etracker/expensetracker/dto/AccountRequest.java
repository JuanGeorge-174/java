package com.etracker.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountRequest {
    @NotBlank
    private String name;

    private String currency;

    @NotNull
    private Double initialAmount;

    private String note;
}
