package com.fyp.wspapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Response DTO for a single constraint operation.
 */
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class ConstraintResponse extends BaseResponse {
    private String constraintId;
    private ConstraintRequest.ConstraintType type;
    private int step1;
    private int step2;
    
    public static ConstraintResponse success(String message, String constraintId, 
                                           ConstraintRequest.ConstraintType type, 
                                           int step1, int step2) {
        return ConstraintResponse.builder()
                .success(true)
                .message(message)
                .constraintId(constraintId)
                .type(type)
                .step1(step1)
                .step2(step2)
                .build();
    }
}
