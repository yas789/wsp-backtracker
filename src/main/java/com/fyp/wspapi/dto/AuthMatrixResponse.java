package com.fyp.wspapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

/**
 * Response DTO for authorization matrix operations.
 */
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class AuthMatrixResponse extends BaseResponse {
    private List<List<Boolean>> matrix;
    private int numUsers;
    private int numSteps;
    
    public static AuthMatrixResponse success(String message, List<List<Boolean>> matrix, int numUsers, int numSteps) {
        return AuthMatrixResponse.builder()
                .success(true)
                .message(message)
                .matrix(matrix)
                .numUsers(numUsers)
                .numSteps(numSteps)
                .build();
    }
}
