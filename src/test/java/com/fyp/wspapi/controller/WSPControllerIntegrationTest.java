package com.fyp.wspapi.controller;

import com.fyp.wspapi.WspApiApplication;
import com.fyp.wspapi.dto.WSPRequest;
import com.fyp.wspapi.dto.WSPResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = WspApiApplication.class)
@AutoConfigureMockMvc
public class WSPControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("WSP API is running"));
    }

    @Test
    public void testSolversEndpoint() throws Exception {
        mockMvc.perform(get("/api/solvers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)))
                .andExpect(jsonPath("$", containsInAnyOrder("SAT", "CSP", "BACKTRACKING", "PBT")));
    }

    @Test
    public void testSolveWSP_SAT_WithSolution() throws Exception {
        WSPRequest request = createBasicWSPRequest("SAT");
        
        mockMvc.perform(post("/api/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutionFound").value(true))
                .andExpect(jsonPath("$.assignment").isArray())
                .andExpect(jsonPath("$.assignment", hasSize(4)))
                .andExpect(jsonPath("$.solvingTimeMs").isNumber())
                .andExpect(jsonPath("$.solverUsed").value("SAT"))
                .andExpect(jsonPath("$.message").value("Solution found successfully"));
    }

    @Test
    public void testSolveWSP_CSP_WithSolution() throws Exception {
        WSPRequest request = createBasicWSPRequest("CSP");
        
        mockMvc.perform(post("/api/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutionFound").value(true))
                .andExpect(jsonPath("$.assignment").isArray())
                .andExpect(jsonPath("$.assignment", hasSize(4)))
                .andExpect(jsonPath("$.solvingTimeMs").isNumber())
                .andExpect(jsonPath("$.solverUsed").value("CSP"))
                .andExpect(jsonPath("$.message").value("Solution found successfully"));
    }

    @Test
    public void testSolveWSP_Backtracking_WithSolution() throws Exception {
        WSPRequest request = createBasicWSPRequest("BACKTRACKING");
        
        mockMvc.perform(post("/api/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutionFound").value(true))
                .andExpect(jsonPath("$.assignment").isArray())
                .andExpect(jsonPath("$.assignment", hasSize(4)))
                .andExpect(jsonPath("$.solvingTimeMs").isNumber())
                .andExpect(jsonPath("$.solverUsed").value("BACKTRACKING"))
                .andExpect(jsonPath("$.message").value("Solution found successfully"));
    }

    @Test
    public void testSolveWSP_PBT_WithSolution() throws Exception {
        WSPRequest request = createBasicWSPRequest("PBT");
        
        mockMvc.perform(post("/api/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutionFound").value(true))
                .andExpect(jsonPath("$.assignment").isArray())
                .andExpect(jsonPath("$.assignment", hasSize(4)))
                .andExpect(jsonPath("$.solvingTimeMs").isNumber())
                .andExpect(jsonPath("$.solverUsed").value("PBT"))
                .andExpect(jsonPath("$.message").value("Solution found successfully"));
    }

    @Test
    public void testSolveWSP_WithConstraints() throws Exception {
        WSPRequest request = createWSPRequestWithConstraints();
        
        mockMvc.perform(post("/api/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutionFound").value(true))
                .andExpect(jsonPath("$.assignment").isArray())
                .andExpect(jsonPath("$.assignment", hasSize(4)))
                .andExpect(jsonPath("$.solvingTimeMs").isNumber())
                .andExpect(jsonPath("$.solverUsed").value("SAT"));
    }

    @Test
    public void testSolveWSP_NoSolution() throws Exception {
        WSPRequest request = createImpossibleWSPRequest();
        
        mockMvc.perform(post("/api/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutionFound").value(false))
                .andExpect(jsonPath("$.assignment").isEmpty())
                .andExpect(jsonPath("$.solvingTimeMs").isNumber())
                .andExpect(jsonPath("$.solverUsed").value("SAT"))
                .andExpect(jsonPath("$.message").value("No solution found"));
    }

    @Test
    public void testSolveWSP_InvalidSolver() throws Exception {
        WSPRequest request = createBasicWSPRequest("INVALID_SOLVER");
        
        mockMvc.perform(post("/api/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutionFound").value(false))
                .andExpect(jsonPath("$.message").value(containsString("Unsupported solver")));
    }

    @Test
    public void testSolveWSP_InvalidRequest_MissingFields() throws Exception {
        WSPRequest request = new WSPRequest();
        // Missing required fields
        
        mockMvc.perform(post("/api/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testSolveWSP_LargerProblem() throws Exception {
        WSPRequest request = createLargerWSPRequest();
        
        mockMvc.perform(post("/api/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutionFound").value(true))
                .andExpect(jsonPath("$.assignment").isArray())
                .andExpect(jsonPath("$.assignment", hasSize(6)))
                .andExpect(jsonPath("$.solvingTimeMs").isNumber())
                .andExpect(jsonPath("$.solverUsed").value("SAT"));
    }

    // Helper methods to create test requests

    private WSPRequest createBasicWSPRequest(String solverType) {
        WSPRequest request = new WSPRequest();
        request.setNumSteps(4);
        request.setNumUsers(4);
        request.setSolverType(solverType);
        
        // Create a simple authorization matrix where all users can perform all steps
        int[][] authorized = {
            {1, 1, 1, 1},  // Step 0: all users authorized
            {1, 1, 1, 1},  // Step 1: all users authorized
            {1, 1, 1, 1},  // Step 2: all users authorized
            {1, 1, 1, 1}   // Step 3: all users authorized
        };
        request.setAuthorized(authorized);
        
        return request;
    }

    private WSPRequest createWSPRequestWithConstraints() {
        WSPRequest request = createBasicWSPRequest("SAT");
        
        // Add some constraints
        List<WSPRequest.Constraint> mustSameConstraints = Arrays.asList(
            new WSPRequest.Constraint(0, 1)  // Steps 0 and 1 must be done by same user
        );
        
        List<WSPRequest.Constraint> mustDifferentConstraints = Arrays.asList(
            new WSPRequest.Constraint(1, 2)  // Steps 1 and 2 must be done by different users
        );
        
        request.setMustSameConstraints(mustSameConstraints);
        request.setMustDifferentConstraints(mustDifferentConstraints);
        
        return request;
    }

    private WSPRequest createImpossibleWSPRequest() {
        WSPRequest request = new WSPRequest();
        request.setNumSteps(3);
        request.setNumUsers(2);
        request.setSolverType("SAT");
        
        // Create an authorization matrix where no user can perform step 1
        int[][] authorized = {
            {1, 1},  // Step 0: both users authorized
            {0, 0},  // Step 1: no users authorized (impossible)
            {1, 1}   // Step 2: both users authorized
        };
        request.setAuthorized(authorized);
        
        return request;
    }

    private WSPRequest createLargerWSPRequest() {
        WSPRequest request = new WSPRequest();
        request.setNumSteps(6);
        request.setNumUsers(4);
        request.setSolverType("SAT");
        
        // Create a 6x4 authorization matrix
        int[][] authorized = {
            {1, 1, 0, 1},  // Step 0
            {1, 0, 1, 1},  // Step 1
            {0, 1, 1, 1},  // Step 2
            {1, 1, 1, 0},  // Step 3
            {1, 1, 0, 1},  // Step 4
            {0, 1, 1, 1}   // Step 5
        };
        request.setAuthorized(authorized);
        
        // Add some constraints for a more complex problem
        List<WSPRequest.Constraint> mustSameConstraints = Arrays.asList(
            new WSPRequest.Constraint(0, 2)
        );
        
        List<WSPRequest.Constraint> mustDifferentConstraints = Arrays.asList(
            new WSPRequest.Constraint(1, 3),
            new WSPRequest.Constraint(2, 4)
        );
        
        request.setMustSameConstraints(mustSameConstraints);
        request.setMustDifferentConstraints(mustDifferentConstraints);
        
        return request;
    }
}
