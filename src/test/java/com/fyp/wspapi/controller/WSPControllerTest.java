package com.fyp.wspapi.controller;

import com.fyp.wspapi.WspApiApplication;
import com.fyp.wspapi.dto.WSPRequest;
import com.fyp.wspapi.dto.WSPResponse;
import com.fyp.wspapi.service.WSPService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = WspApiApplication.class)
@AutoConfigureMockMvc
public class WSPControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WSPService wspService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        // Reset mocks before each test
    }

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
    public void testSolveWSP_Success() throws Exception {
        WSPRequest request = new WSPRequest();
        request.setNumSteps(4);
        request.setNumUsers(4);
        request.setAuthorized(new int[][]{{1, 1, 1, 1}, {1, 1, 1, 1}, {1, 1, 1, 1}, {1, 1, 1, 1}});
        request.setSolverType("SAT");
        
        WSPResponse response = WSPResponse.success(
            new int[]{0, 1, 2, 3}, 
            100, 
            "SAT"
        );
        
        when(wspService.solveWSP(any(WSPRequest.class))).thenReturn(response);
        
        mockMvc.perform(post("/api/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutionFound").value(true))
                .andExpect(jsonPath("$.message").value("Solution found successfully"))
                .andExpect(jsonPath("$.assignment").isArray())
                .andExpect(jsonPath("$.assignment", hasSize(4)))
                .andExpect(jsonPath("$.solverUsed").value("SAT"))
                .andExpect(jsonPath("$.solvingTimeMs").value(100));
    }

    @Test
    public void testSolveWSP_WithConstraints() throws Exception {
        WSPRequest request = new WSPRequest();
        request.setNumSteps(4);
        request.setNumUsers(4);
        request.setAuthorized(new int[][]{{1, 1, 1, 1}, {1, 1, 1, 1}, {1, 1, 1, 1}, {1, 1, 1, 1}});
        request.setMustSameConstraints(List.of(new WSPRequest.Constraint(0, 1)));
        request.setMustDifferentConstraints(List.of(new WSPRequest.Constraint(1, 2)));
        request.setSolverType("CSP");
        
        WSPResponse response = WSPResponse.success(
            new int[]{0, 0, 1, 2}, 
            150, 
            "CSP"
        );
        
        when(wspService.solveWSP(any(WSPRequest.class))).thenReturn(response);
        
        mockMvc.perform(post("/api/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutionFound").value(true))
                .andExpect(jsonPath("$.assignment").isArray())
                .andExpect(jsonPath("$.solverUsed").value("CSP"));
    }

    @Test
    public void testSolveWSP_NoSolution() throws Exception {
        WSPRequest request = new WSPRequest();
        request.setNumSteps(3);
        request.setNumUsers(2);
        request.setAuthorized(new int[][]{{1, 1}, {0, 0}, {1, 1}}); // Impossible: no user can do step 1
        request.setSolverType("SAT");
        
        WSPResponse response = WSPResponse.failure("No solution found", 50, "SAT");
        
        when(wspService.solveWSP(any(WSPRequest.class))).thenReturn(response);
        
        mockMvc.perform(post("/api/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutionFound").value(false))
                .andExpect(jsonPath("$.message").value("No solution found"))
                .andExpect(jsonPath("$.solverUsed").value("SAT"));
    }

    @Test
    public void testSolveWSP_AllSolverTypes() throws Exception {
        WSPRequest request = new WSPRequest();
        request.setNumSteps(4);
        request.setNumUsers(4);
        request.setAuthorized(new int[][]{{1, 1, 1, 1}, {1, 1, 1, 1}, {1, 1, 1, 1}, {1, 1, 1, 1}});
        
        String[] solvers = {"SAT", "CSP", "BACKTRACKING", "PBT"};
        
        for (String solver : solvers) {
            request.setSolverType(solver);
            WSPResponse response = WSPResponse.success(
                new int[]{0, 1, 2, 3}, 
                100, 
                solver
            );
            
            when(wspService.solveWSP(any(WSPRequest.class))).thenReturn(response);
            
            mockMvc.perform(post("/api/solve")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.solutionFound").value(true))
                    .andExpect(jsonPath("$.solverUsed").value(solver));
        }
    }
}
