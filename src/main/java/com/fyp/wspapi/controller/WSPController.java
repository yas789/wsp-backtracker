package com.fyp.wspapi.controller;

import com.fyp.wspapi.dto.*;
import com.fyp.wspapi.service.WSPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class WSPController {
    private final WSPService wspService;

    public WSPController(WSPService wspService) {
        this.wspService = wspService;
    }

    /**
     * Solves the WSP problem using the specified algorithm
     * @param request The WSP request containing problem parameters and solver type
     * @return The solution or an error message
     */
    @PostMapping("/solve")
    public ResponseEntity<WSPResponse> solve(@Valid @RequestBody WSPRequest request) {
        WSPResponse response = wspService.solveWSP(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Returns the list of supported solver types
     */
    @GetMapping("/solvers")
    public ResponseEntity<List<String>> getSupportedSolvers() {
        return ResponseEntity.ok(List.of("SAT", "CSP", "BACKTRACKING", "PBT"));
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("WSP API is running");
    }
}
