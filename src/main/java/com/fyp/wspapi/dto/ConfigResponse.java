package com.fyp.wspapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Response DTO for configuration operations.
 */
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class ConfigResponse extends BaseResponse {
    private Integer numUsers;
    private Integer numSteps;
    
    public static ConfigResponse success(String message, int numUsers, int numSteps) {
        return ConfigResponse.builder()
                .success(true)
                .message(message)
                .numUsers(numUsers)
                .numSteps(numSteps)
                .build();
    }
}
