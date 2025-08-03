package com.fyp.wspapi.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for initializing or updating the WSP configuration.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfigRequest {
    @NotNull(message = "Number of users is required")
    @Min(value = 1, message = "Number of users must be at least 1")
    private Integer numUsers;
    
    @NotNull(message = "Number of steps is required")
    @Min(value = 1, message = "Number of steps must be at least 1")
    private Integer numSteps;
}
