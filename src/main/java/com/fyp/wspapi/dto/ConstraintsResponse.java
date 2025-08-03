package com.fyp.wspapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

/**
 * Response DTO for retrieving all constraints.
 */
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class ConstraintsResponse extends BaseResponse {
    private List<ConstraintResponse> constraints;
    private int count;
    
    public static ConstraintsResponse success(String message, List<ConstraintResponse> constraints) {
        return ConstraintsResponse.builder()
                .success(true)
                .message(message)
                .constraints(constraints)
                .count(constraints.size())
                .build();
    }
}
