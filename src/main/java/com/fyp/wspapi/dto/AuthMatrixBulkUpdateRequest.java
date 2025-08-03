package com.fyp.wspapi.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for bulk updating the authorization matrix.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthMatrixBulkUpdateRequest {
    @NotNull(message = "Matrix data is required")
    private List<List<Boolean>> matrix;
}
