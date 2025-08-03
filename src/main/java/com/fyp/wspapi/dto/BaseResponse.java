package com.fyp.wspapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Base response class for all API responses.
 * Contains common fields like success status and message.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class BaseResponse {
    private boolean success;
    private String message;
    
    public static BaseResponse success(String message) {
        return BaseResponse.builder()
                .success(true)
                .message(message)
                .build();
    }
    
    public static BaseResponse error(String message) {
        return BaseResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
