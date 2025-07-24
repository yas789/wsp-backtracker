package com.fyp.wspapi.controller;

import com.fyp.wspapi.dto.WSPRequest;
import com.fyp.wspapi.dto.WSPResponse;
import com.fyp.wspapi.service.WSPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/wsp")
@CrossOrigin(origins = "*") // Allow all origins for development
public class WSPController {
    
    @Autowired
    private WSPService wspService;
    
    @PostMapping("/solve")
    public ResponseEntity<WSPResponse> solveWSP(@Valid @RequestBody WSPRequest request) {
        WSPResponse response = wspService.solveWSP(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("WSP API is running");
    }
    
    @GetMapping("/solvers")
    public ResponseEntity<String[]> getSupportedSolvers() {
        return ResponseEntity.ok(new String[]{"SAT", "CSP"});
    }
}
