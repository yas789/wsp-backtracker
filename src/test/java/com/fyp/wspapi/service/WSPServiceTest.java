package com.fyp.wspapi.service;

import com.fyp.wspapi.dto.WSPRequest;
import com.fyp.wspapi.dto.WSPResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class WSPServiceTest {

    private WSPService wspService;

    @BeforeEach
    public void setUp() {
        wspService = new WSPService();
    }

    @Test
    public void testSolveWSP_SAT_Success() {
        // Given
        WSPRequest request = createBasicRequest("SAT");
        
        // When
        WSPResponse response = wspService.solveWSP(request);
        
        // Then
        assertTrue(response.isSolutionFound());
        assertNotNull(response.getAssignment());
        assertEquals(4, response.getAssignment().length);
        assertEquals("SAT", response.getSolverUsed());
        assertTrue(response.getSolvingTimeMs() >= 0);
        assertEquals("Solution found successfully", response.getMessage());
    }

    @Test
    public void testSolveWSP_CSP_Success() {
        // Given
        WSPRequest request = createBasicRequest("CSP");
        
        // When
        WSPResponse response = wspService.solveWSP(request);
        
        // Then
        assertTrue(response.isSolutionFound());
        assertNotNull(response.getAssignment());
        assertEquals(4, response.getAssignment().length);
        assertEquals("CSP", response.getSolverUsed());
        assertTrue(response.getSolvingTimeMs() >= 0);
        assertEquals("Solution found successfully", response.getMessage());
    }

    @Test
    public void testSolveWSP_Backtracking_Success() {
        // Given
        WSPRequest request = createBasicRequest("BACKTRACKING");
        
        // When
        WSPResponse response = wspService.solveWSP(request);
        
        // Then
        assertTrue(response.isSolutionFound());
        assertNotNull(response.getAssignment());
        assertEquals(4, response.getAssignment().length);
        assertEquals("BACKTRACKING", response.getSolverUsed());
        assertTrue(response.getSolvingTimeMs() >= 0);
        assertEquals("Solution found successfully", response.getMessage());
    }

    @Test
    public void testSolveWSP_PBT_Success() {
        // Given
        WSPRequest request = createBasicRequest("PBT");
        
        // When
        WSPResponse response = wspService.solveWSP(request);
        
        // Then
        assertTrue(response.isSolutionFound());
        assertNotNull(response.getAssignment());
        assertEquals(4, response.getAssignment().length);
        assertEquals("PBT", response.getSolverUsed());
        assertTrue(response.getSolvingTimeMs() >= 0);
        assertEquals("Solution found successfully", response.getMessage());
    }

    @Test
    public void testSolveWSP_WithMustSameConstraints() {
        // Given
        WSPRequest request = createBasicRequest("SAT");
        List<WSPRequest.Constraint> mustSameConstraints = Arrays.asList(
            new WSPRequest.Constraint(0, 1)  // Steps 0 and 1 must be same user
        );
        request.setMustSameConstraints(mustSameConstraints);
        
        // When
        WSPResponse response = wspService.solveWSP(request);
        
        // Then
        assertTrue(response.isSolutionFound());
        assertNotNull(response.getAssignment());
        // Verify constraint is satisfied: steps 0 and 1 have same user
        assertEquals(response.getAssignment()[0], response.getAssignment()[1]);
    }

    @Test
    public void testSolveWSP_WithMustDifferentConstraints() {
        // Given
        WSPRequest request = createBasicRequest("SAT");
        List<WSPRequest.Constraint> mustDifferentConstraints = Arrays.asList(
            new WSPRequest.Constraint(0, 1)  // Steps 0 and 1 must be different users
        );
        request.setMustDifferentConstraints(mustDifferentConstraints);
        
        // When
        WSPResponse response = wspService.solveWSP(request);
        
        // Then
        assertTrue(response.isSolutionFound());
        assertNotNull(response.getAssignment());
        // Verify constraint is satisfied: steps 0 and 1 have different users
        assertNotEquals(response.getAssignment()[0], response.getAssignment()[1]);
    }

    @Test
    public void testSolveWSP_WithBothConstraintTypes() {
        // Given
        WSPRequest request = createBasicRequest("SAT");
        List<WSPRequest.Constraint> mustSameConstraints = Arrays.asList(
            new WSPRequest.Constraint(0, 1)  // Steps 0 and 1 must be same user
        );
        List<WSPRequest.Constraint> mustDifferentConstraints = Arrays.asList(
            new WSPRequest.Constraint(1, 2)  // Steps 1 and 2 must be different users
        );
        request.setMustSameConstraints(mustSameConstraints);
        request.setMustDifferentConstraints(mustDifferentConstraints);
        
        // When
        WSPResponse response = wspService.solveWSP(request);
        
        // Then
        assertTrue(response.isSolutionFound());
        assertNotNull(response.getAssignment());
        // Verify constraints are satisfied
        assertEquals(response.getAssignment()[0], response.getAssignment()[1]); // Same constraint
        assertNotEquals(response.getAssignment()[1], response.getAssignment()[2]); // Different constraint
    }

    @Test
    public void testSolveWSP_NoSolution() {
        // Given - create impossible problem
        WSPRequest request = new WSPRequest();
        request.setNumSteps(3);
        request.setNumUsers(2);
        request.setSolverType("SAT");
        
        // Authorization matrix where no user can perform step 1
        int[][] authorized = {
            {1, 1},  // Step 0: both users authorized
            {0, 0},  // Step 1: no users authorized (impossible)
            {1, 1}   // Step 2: both users authorized
        };
        request.setAuthorized(authorized);
        
        // When
        WSPResponse response = wspService.solveWSP(request);
        
        // Then
        assertFalse(response.isSolutionFound());
        assertTrue(response.getAssignment() == null || response.getAssignment().length == 0);
        assertEquals("SAT", response.getSolverUsed());
        assertTrue(response.getSolvingTimeMs() >= 0);
        assertEquals("No solution found", response.getMessage());
    }

    @Test
    public void testSolveWSP_UnsupportedSolver() {
        // Given
        WSPRequest request = createBasicRequest("INVALID_SOLVER");
        
        // When
        WSPResponse response = wspService.solveWSP(request);
        
        // Then
        assertFalse(response.isSolutionFound());
        assertTrue(response.getMessage().contains("Unsupported solver"));
        assertEquals("NONE", response.getSolverUsed());
    }

    @Test
    public void testSolveWSP_LargerProblem() {
        // Given
        WSPRequest request = new WSPRequest();
        request.setNumSteps(6);
        request.setNumUsers(5);
        request.setSolverType("SAT");
        
        // Create 6x5 authorization matrix
        int[][] authorized = new int[6][5];
        for (int i = 0; i < 6; i++) {
            for (int j = 0; j < 5; j++) {
                authorized[i][j] = 1; // All users can perform all steps
            }
        }
        request.setAuthorized(authorized);
        
        // When
        WSPResponse response = wspService.solveWSP(request);
        
        // Then
        assertTrue(response.isSolutionFound());
        assertNotNull(response.getAssignment());
        assertEquals(6, response.getAssignment().length);
        assertEquals("SAT", response.getSolverUsed());
        assertTrue(response.getSolvingTimeMs() >= 0);
    }

    @Test
    public void testSolveWSP_AllSolversProduceSameResult() {
        // Given - same problem for all solvers
        WSPRequest satRequest = createBasicRequest("SAT");
        WSPRequest cspRequest = createBasicRequest("CSP");
        WSPRequest backtrackingRequest = createBasicRequest("BACKTRACKING");
        
        // When
        WSPResponse satResponse = wspService.solveWSP(satRequest);
        WSPResponse cspResponse = wspService.solveWSP(cspRequest);
        WSPResponse backtrackingResponse = wspService.solveWSP(backtrackingRequest);
        
        // Then - all should find solutions (though assignments may differ)
        assertTrue(satResponse.isSolutionFound());
        assertTrue(cspResponse.isSolutionFound());
        assertTrue(backtrackingResponse.isSolutionFound());
        
        assertEquals(4, satResponse.getAssignment().length);
        assertEquals(4, cspResponse.getAssignment().length);
        assertEquals(4, backtrackingResponse.getAssignment().length);
    }

    @Test
    public void testSolveWSP_PerformanceComparison() {
        // Given
        WSPRequest request = createBasicRequest("SAT");
        
        // When - run multiple times to check consistency
        WSPResponse response1 = wspService.solveWSP(request);
        WSPResponse response2 = wspService.solveWSP(request);
        WSPResponse response3 = wspService.solveWSP(request);
        
        // Then - all should be successful and have reasonable timing
        assertTrue(response1.isSolutionFound());
        assertTrue(response2.isSolutionFound());
        assertTrue(response3.isSolutionFound());
        
        assertTrue(response1.getSolvingTimeMs() < 5000); // Should solve within 5 seconds
        assertTrue(response2.getSolvingTimeMs() < 5000);
        assertTrue(response3.getSolvingTimeMs() < 5000);
    }

    // Helper method to create basic test request
    private WSPRequest createBasicRequest(String solverType) {
        WSPRequest request = new WSPRequest();
        request.setNumSteps(4);
        request.setNumUsers(4);
        request.setSolverType(solverType);
        
        // Create authorization matrix where all users can perform all steps
        int[][] authorized = {
            {1, 1, 1, 1},  // Step 0
            {1, 1, 1, 1},  // Step 1
            {1, 1, 1, 1},  // Step 2
            {1, 1, 1, 1}   // Step 3
        };
        request.setAuthorized(authorized);
        
        return request;
    }
}
