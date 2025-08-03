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
@CrossOrigin(origins = "*") // Allow all origins for development
public class WSPController {
    
    @Autowired
    private WSPService wspService;

    /* ===== Configuration Endpoints ===== */
    
    @PostMapping("/config")
    public ResponseEntity<ConfigResponse> configureWSP(@Valid @RequestBody ConfigRequest request) {
        ConfigResponse response = wspService.initializeConfiguration(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/config")
    public ResponseEntity<ConfigResponse> getConfiguration() {
        ConfigResponse response = wspService.getCurrentConfiguration();
        return ResponseEntity.ok(response);
    }

    /* ===== Authorization Matrix Endpoints ===== */
    
    @GetMapping("/auth/matrix")
    public ResponseEntity<AuthMatrixResponse> getAuthMatrix() {
        AuthMatrixResponse response = wspService.getAuthMatrix();
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/auth/matrix")
    public ResponseEntity<AuthMatrixResponse> updateAuthMatrix(
            @Valid @RequestBody AuthMatrixUpdateRequest request) {
        AuthMatrixResponse response = wspService.updateAuthMatrix(request);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/auth/matrix/bulk")
    public ResponseEntity<AuthMatrixResponse> updateAuthMatrixBulk(
            @Valid @RequestBody AuthMatrixBulkUpdateRequest request) {
        AuthMatrixResponse response = wspService.updateAuthMatrixBulk(request);
        return ResponseEntity.ok(response);
    }

    /* ===== Constraints Endpoints ===== */
    
    @GetMapping("/constraints")
    public ResponseEntity<ConstraintsResponse> getConstraints() {
        ConstraintsResponse response = wspService.getAllConstraints();
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/constraints")
    public ResponseEntity<ConstraintResponse> addConstraint(
            @Valid @RequestBody ConstraintRequest request) {
        ConstraintResponse response = wspService.addConstraint(request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/constraints/{constraintId}")
    public ResponseEntity<BaseResponse> removeConstraint(
            @PathVariable String constraintId) {
        BaseResponse response = wspService.removeConstraint(constraintId);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/constraints")
    public ResponseEntity<BaseResponse> clearAllConstraints() {
        BaseResponse response = wspService.clearAllConstraints();
        return ResponseEntity.ok(response);
    }

    /* ===== Solver Endpoints ===== */
    
    @PostMapping("/wsp/solve")
    public ResponseEntity<WSPResponse> solveWSP(@Valid @RequestBody WSPRequest request) {
        WSPResponse response = wspService.solveWSP(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/wsp/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("WSP API is running");
    }
    
    @GetMapping("/wsp/solvers")
    public ResponseEntity<String[]> getSupportedSolvers() {
        return ResponseEntity.ok(new String[]{"SAT", "CSP"});
    }
}
