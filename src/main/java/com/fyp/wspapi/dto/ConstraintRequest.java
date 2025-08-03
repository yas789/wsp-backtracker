package com.fyp.wspapi.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for adding a new constraint.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConstraintRequest {
    @NotNull(message = "Constraint type is required (SOD or BOD)")
    private ConstraintType type;
    
    @Min(value = 0, message = "Step 1 index must be 0 or greater")
    private int step1;
    
    @Min(value = 0, message = "Step 2 index must be 0 or greater")
    private int step2;
    
    public enum ConstraintType {
        SOD, // Separation of Duty (must be different users)
        BOD  // Binding of Duty (must be same user)
    }
}
