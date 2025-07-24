package com.fyp.wspapi.service;

import WSP.WSPSATEncoder;
import WSP.WSPCSPEncoder;
import com.fyp.wspapi.dto.WSPRequest;
import com.fyp.wspapi.dto.WSPResponse;
import com.google.ortools.Loader;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class WSPService {
    
    @PostConstruct
    public void init() {
        // Load OR-Tools native libraries once at startup
        Loader.loadNativeLibraries();
    }

    public WSPResponse solveWSP(WSPRequest request) {
        long startTime = System.currentTimeMillis();
        
        try {
            int[] solution;
            String solverUsed = request.getSolverType().toUpperCase();
            
            if ("SAT".equals(solverUsed)) {
                solution = solveBySAT(request);
            } else if ("CSP".equals(solverUsed)) {
                solution = solveByCSP(request);
            } else {
                throw new IllegalArgumentException("Invalid solver type: " + request.getSolverType() + 
                    ". Must be 'SAT' or 'CSP'");
            }
            
            long endTime = System.currentTimeMillis();
            long solvingTime = endTime - startTime;
            
            if (solution != null) {
                return WSPResponse.success(solution, solvingTime, solverUsed);
            } else {
                return WSPResponse.failure("No solution found", solvingTime, solverUsed);
            }
            
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            long solvingTime = endTime - startTime;
            return WSPResponse.failure("Error solving WSP: " + e.getMessage(), solvingTime, request.getSolverType());
        }
    }
    
    private int[] solveBySAT(WSPRequest request) {
        WSPSATEncoder encoder = new WSPSATEncoder(
            request.getNumSteps(), 
            request.getNumUsers(), 
            request.getAuthorized()
        );
        
        // Add constraints
        if (request.getMustSameConstraints() != null) {
            for (WSPRequest.Constraint constraint : request.getMustSameConstraints()) {
                encoder.addMustSameConstraint(constraint.getStep1(), constraint.getStep2());
            }
        }
        
        if (request.getMustDifferentConstraints() != null) {
            for (WSPRequest.Constraint constraint : request.getMustDifferentConstraints()) {
                encoder.addMustDifferentConstraint(constraint.getStep1(), constraint.getStep2());
            }
        }
        
        return encoder.encodeAndSolve();
    }
    
    private int[] solveByCSP(WSPRequest request) {
        WSPCSPEncoder encoder = new WSPCSPEncoder(
            request.getNumSteps(), 
            request.getNumUsers(), 
            request.getAuthorized()
        );
        
        // Add constraints
        if (request.getMustSameConstraints() != null) {
            for (WSPRequest.Constraint constraint : request.getMustSameConstraints()) {
                encoder.addMustSameConstraint(constraint.getStep1(), constraint.getStep2());
            }
        }
        
        if (request.getMustDifferentConstraints() != null) {
            for (WSPRequest.Constraint constraint : request.getMustDifferentConstraints()) {
                encoder.addMustDifferentConstraint(constraint.getStep1(), constraint.getStep2());
            }
        }
        
        return encoder.solveCSP();
    }
}
