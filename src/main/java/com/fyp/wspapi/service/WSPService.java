package com.fyp.wspapi.service;

import WSP.WSPSATEncoder;
import WSP.WSPCSPEncoder;
import com.fyp.wspapi.dto.*;
import com.fyp.wspapi.dto.ConstraintRequest.ConstraintType;
import com.google.ortools.Loader;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class WSPService {
    
    // In-memory storage for the current WSP state
    private int numUsers = 4;  // Default values
    private int numSteps = 4;  // Default values
    private List<List<Boolean>> authMatrix;
    private final Map<String, ConstraintData> constraints = new ConcurrentHashMap<>();
    
    // Lock for thread safety
    private final Object lock = new Object();
    
    /**
     * Helper class to store constraint data
     */
    private static class ConstraintData {
        final String id;
        final ConstraintType type;
        final int step1;
        final int step2;
        
        ConstraintData(String id, ConstraintType type, int step1, int step2) {
            this.id = id;
            this.type = type;
            // Ensure consistent ordering of steps for the key
            if (step1 < step2) {
                this.step1 = step1;
                this.step2 = step2;
            } else {
                this.step1 = step2;
                this.step2 = step1;
            }
        }
    }
    
    /**
     * Creates a consistent key for a constraint regardless of step order
     */
    private String createConstraintKey(ConstraintType type, int step1, int step2) {
        // Sort steps to ensure consistent key regardless of order
        int first = Math.min(step1, step2);
        int second = Math.max(step1, step2);
        return type + "_" + first + "_" + second;
    }
    
    /**
     * Initializes or resets the authorization matrix with all false values
     */
    private void resetAuthMatrix() {
        this.authMatrix = new ArrayList<>();
        for (int i = 0; i < numUsers; i++) {
            List<Boolean> row = new ArrayList<>();
            for (int j = 0; j < numSteps; j++) {
                row.add(false);
            }
            this.authMatrix.add(row);
        }
    }
    
    @PostConstruct
    public void init() {
        // Load OR-Tools native libraries once at startup
        Loader.loadNativeLibraries();
        
        // Initialize default authorization matrix (all false)
        resetAuthMatrix();
    }
    
    /* ===== Configuration Methods ===== */
    
    public ConfigResponse initializeConfiguration(ConfigRequest request) {
        synchronized (lock) {
            this.numUsers = request.getNumUsers();
            this.numSteps = request.getNumSteps();
            resetAuthMatrix();
            constraints.clear();
            
            return ConfigResponse.success(
                "WSP configuration updated successfully",
                numUsers,
                numSteps
            );
        }
    }
    
    public ConfigResponse getCurrentConfiguration() {
        return ConfigResponse.success(
            "Current WSP configuration retrieved",
            numUsers,
            numSteps
        );
    }
    
    /* ===== Authorization Matrix Methods ===== */
    
    public AuthMatrixResponse getAuthMatrix() {
        synchronized (lock) {
            return AuthMatrixResponse.success(
                "Authorization matrix retrieved successfully",
                new ArrayList<>(authMatrix),
                numUsers,
                numSteps
            );
        }
    }
    
    public AuthMatrixResponse updateAuthMatrix(AuthMatrixUpdateRequest request) {
        synchronized (lock) {
            if (request.getUserId() != null && request.getStepId() != null) {
                // Update single cell
                int userId = request.getUserId();
                int stepId = request.getStepId();
                
                if (userId < 0 || userId >= numUsers || stepId < 0 || stepId >= numSteps) {
                    throw new IllegalArgumentException("User ID or Step ID is out of bounds");
                }
                
                authMatrix.get(userId).set(stepId, request.getAuthorized());
            } else if (request.getUserId() != null) {
                // Update all steps for a user
                int userId = request.getUserId();
                if (userId < 0 || userId >= numUsers) {
                    throw new IllegalArgumentException("User ID is out of bounds");
                }
                
                for (int i = 0; i < numSteps; i++) {
                    authMatrix.get(userId).set(i, request.getAuthorized());
                }
            } else if (request.getStepId() != null) {
                // Update all users for a step
                int stepId = request.getStepId();
                if (stepId < 0 || stepId >= numSteps) {
                    throw new IllegalArgumentException("Step ID is out of bounds");
                }
                
                for (int i = 0; i < numUsers; i++) {
                    authMatrix.get(i).set(stepId, request.getAuthorized());
                }
            } else {
                // Update entire matrix to true/false
                for (List<Boolean> row : authMatrix) {
                    Collections.fill(row, request.getAuthorized());
                }
            }
            
            return getAuthMatrix();
        }
    }
    
    public AuthMatrixResponse updateAuthMatrixBulk(AuthMatrixBulkUpdateRequest request) {
        synchronized (lock) {
            List<List<Boolean>> newMatrix = request.getMatrix();
            
            // Validate matrix dimensions
            if (newMatrix.size() != numUsers || newMatrix.isEmpty() || newMatrix.get(0).size() != numSteps) {
                throw new IllegalArgumentException("Matrix dimensions do not match current configuration");
            }
            
            // Deep copy the matrix
            this.authMatrix = newMatrix.stream()
                .map(ArrayList::new)
                .collect(Collectors.toCollection(ArrayList::new));
                
            return getAuthMatrix();
        }
    }
    
    /* ===== Constraints Methods ===== */
    
    public ConstraintsResponse getAllConstraints() {
        synchronized (lock) {
            List<ConstraintResponse> constraintList = constraints.values().stream()
                .map(c -> ConstraintResponse.success(
                    "",  // Empty message as we'll set a general one
                    c.id,
                    c.type,
                    c.step1,
                    c.step2
                ))
                .collect(Collectors.toList());
                
            return ConstraintsResponse.success("Retrieved all constraints", constraintList);
        }
    }
    
    public ConstraintResponse addConstraint(ConstraintRequest request) {
        synchronized (lock) {
            // Validate step indices
            if (request.getStep1() < 0 || request.getStep1() >= numSteps ||
                request.getStep2() < 0 || request.getStep2() >= numSteps) {
                throw new IllegalArgumentException("Step indices must be between 0 and " + (numSteps - 1));
            }
            
            if (request.getStep1() == request.getStep2()) {
                throw new IllegalArgumentException("Cannot create a constraint between a step and itself");
            }
            
            // Create a consistent key regardless of step order
            String key = createConstraintKey(request.getType(), request.getStep1(), request.getStep2());
            
            // Check for duplicate or conflicting constraints
            if (constraints.containsKey(key)) {
                throw new IllegalStateException("A similar constraint already exists");
            }
            
            // Add the constraint
            ConstraintData constraint = new ConstraintData(
                UUID.randomUUID().toString(),
                request.getType(),
                request.getStep1(),
                request.getStep2()
            );
            
            constraints.put(key, constraint);
            
            return ConstraintResponse.success(
                "Constraint added successfully",
                constraint.id,
                constraint.type,
                constraint.step1,
                constraint.step2
            );
        }
    }
    
    public BaseResponse removeConstraint(String constraintId) {
        synchronized (lock) {
            Optional<Map.Entry<String, ConstraintData>> entry = constraints.entrySet().stream()
                .filter(e -> e.getValue().id.equals(constraintId))
                .findFirst();
                
            if (entry.isPresent()) {
                constraints.remove(entry.get().getKey());
                return BaseResponse.success("Constraint removed successfully");
            } else {
                return BaseResponse.error("Constraint not found");
            }
        }
    }
    
    public BaseResponse clearAllConstraints() {
        synchronized (lock) {
            constraints.clear();
            return BaseResponse.success("All constraints have been cleared");
        }
    }
    
    /* ===== Solver Methods ===== */
    
    /**
     * Solves the WSP using the SAT encoder
     * @param stepByUser The authorization matrix where stepByUser[step][user] = 1 if authorized, 0 otherwise
     * @param mustSame List of [step1, step2] pairs that must be assigned the same user
     * @param mustDifferent List of [step1, step2] pairs that must be assigned different users
     * @return Array where index is step and value is assigned user, or null if no solution
     */
    private int[] solveBySAT(int[][] stepByUser, List<int[]> mustSame, List<int[]> mustDifferent) {
        try {
            // Create encoder with the provided authorization matrix
            WSPSATEncoder encoder = new WSPSATEncoder(
                numSteps,
                numUsers,
                stepByUser
            );
            
            // Add constraints
            for (int[] steps : mustSame) {
                encoder.addMustSameConstraint(steps[0], steps[1]);
            }
            
            for (int[] steps : mustDifferent) {
                encoder.addMustDifferentConstraint(steps[0], steps[1]);
            }
            
            // Solve and return the solution
            return encoder.encodeAndSolve();
        } catch (Exception e) {
            throw new RuntimeException("Error in SAT solver: " + e.getMessage(), e);
        }
    }
    
    /**
     * Solves the WSP using the CSP encoder
     * @param stepByUser The authorization matrix where stepByUser[step][user] = 1 if authorized, 0 otherwise
     * @param mustSame List of [step1, step2] pairs that must be assigned the same user
     * @param mustDifferent List of [step1, step2] pairs that must be assigned different users
     * @return Array where index is step and value is assigned user, or null if no solution
     */
    private int[] solveByCSP(int[][] stepByUser, List<int[]> mustSame, List<int[]> mustDifferent) {
        try {
            // Create encoder with the provided authorization matrix
            WSPCSPEncoder encoder = new WSPCSPEncoder(
                numSteps,
                numUsers,
                stepByUser
            );
            
            // Add constraints
            for (int[] steps : mustSame) {
                encoder.addMustSameConstraint(steps[0], steps[1]);
            }
            
            for (int[] steps : mustDifferent) {
                encoder.addMustDifferentConstraint(steps[0], steps[1]);
            }
            
            // Solve and return the solution
            return encoder.solveCSP();
        } catch (Exception e) {
            throw new RuntimeException("Error in CSP solver: " + e.getMessage(), e);
        }
    }
    
    public WSPResponse solveWSP(WSPRequest request) {
        long startTime = System.currentTimeMillis();
        String solverUsed = request.getSolverType().toUpperCase();
        
        try {
            // Use the authorization matrix from the request
            int[][] stepByUser = request.getAuthorized();
            
            // Get must-same and must-different constraints from the request
            List<int[]> mustSame = request.getMustSameConstraints().stream()
                .map(c -> new int[]{c.getStep1(), c.getStep2()})
                .collect(Collectors.toList());
                
            List<int[]> mustDifferent = request.getMustDifferentConstraints().stream()
                .map(c -> new int[]{c.getStep1(), c.getStep2()})
                .collect(Collectors.toList());
            
            // Call the appropriate solver
            int[] solution;
            if ("SAT".equals(solverUsed)) {
                solution = solveBySAT(stepByUser, mustSame, mustDifferent);
            } else if ("CSP".equals(solverUsed)) {
                solution = solveByCSP(stepByUser, mustSame, mustDifferent);
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
            return WSPResponse.failure("Error solving WSP: " + e.getMessage(), solvingTime, solverUsed);
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
