package com.fyp.wspapi.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating a single authorization matrix entry.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthMatrixUpdateRequest {
    @Min(value = 0, message = "User index must be 0 or greater")
    private Integer userId;
    
    @Min(value = 0, message = "Step index must be 0 or greater")
    private Integer stepId;
    
    @NotNull(message = "Authorization status is required (true/false)")
    private Boolean authorized;
}
