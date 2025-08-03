package com.fyp.wspapi.controller;

import com.fyp.wspapi.WspApiApplication;
import com.fyp.wspapi.dto.*;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
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
        // reset(wspService);
    }

    @Test
    public void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/wsp/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("WSP API is running"));
    }

    @Test
    public void testSolversEndpoint() throws Exception {
        mockMvc.perform(get("/api/wsp/solvers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0]").value("SAT"))
                .andExpect(jsonPath("$[1]").value("CSP"));
    }

    @Test
    public void testInitializeConfig() throws Exception {
        ConfigRequest request = new ConfigRequest(3, 4);
        ConfigResponse response = ConfigResponse.success("Configuration initialized", 3, 4);
        
        when(wspService.initializeConfiguration(any(ConfigRequest.class))).thenReturn(response);
        
        mockMvc.perform(post("/api/config")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.numUsers").value(3))
                .andExpect(jsonPath("$.numSteps").value(4));
    }

    @Test
    public void testUpdateAuthMatrix() throws Exception {
        AuthMatrixUpdateRequest request = new AuthMatrixUpdateRequest(1, 2, true);
        AuthMatrixResponse response = new AuthMatrixResponse();
        response.setSuccess(true);
        response.setMessage("Authorization updated");
        
        when(wspService.updateAuthMatrix(any(AuthMatrixUpdateRequest.class))).thenReturn(response);
        
        mockMvc.perform(post("/api/auth/matrix")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Authorization updated"));
    }

    @Test
    public void testAddConstraint() throws Exception {
        ConstraintRequest request = new ConstraintRequest(ConstraintRequest.ConstraintType.BOD, 1, 2);
        ConstraintResponse response = ConstraintResponse.success(
            "", 
            "constraint_123", 
            ConstraintRequest.ConstraintType.BOD, 
            1, 
            2
        );
        
        when(wspService.addConstraint(any(ConstraintRequest.class))).thenReturn(response);
        
        mockMvc.perform(post("/api/constraints")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.constraintId").value("constraint_123"))
                .andExpect(jsonPath("$.step1").value(1))
                .andExpect(jsonPath("$.step2").value(2))
                .andExpect(jsonPath("$.type").value("BOD"));
    }

    @Test
    public void testGetAllConstraints() throws Exception {
        ConstraintResponse constraint1 = ConstraintResponse.success(
            "", 
            "c1", 
            ConstraintRequest.ConstraintType.BOD, 
            0, 
            1
        );
        ConstraintResponse constraint2 = ConstraintResponse.success(
            "", 
            "c2", 
            ConstraintRequest.ConstraintType.SOD, 
            1, 
            2
        );
        ConstraintsResponse response = new ConstraintsResponse();
        response.setSuccess(true);
        response.setConstraints(Arrays.asList(constraint1, constraint2));
        
        when(wspService.getAllConstraints()).thenReturn(response);
        
        mockMvc.perform(get("/api/constraints"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.constraints", hasSize(2)))
                .andExpect(jsonPath("$.constraints[0].constraintId").value("c1"))
                .andExpect(jsonPath("$.constraints[1].constraintId").value("c2"));
    }

    @Test
    public void testRemoveConstraint() throws Exception {
        BaseResponse response = new BaseResponse();
        response.setSuccess(true);
        response.setMessage("Constraint removed");
        when(wspService.removeConstraint(anyString())).thenReturn(response);
        
        mockMvc.perform(delete("/api/constraints/test-constraint"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Constraint removed"));
    }

    @Test
    public void testClearAllConstraints() throws Exception {
        BaseResponse response = BaseResponse.success("All constraints cleared");
        when(wspService.clearAllConstraints()).thenReturn(response);
        
        mockMvc.perform(delete("/api/constraints"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("All constraints cleared"));
    }

    @Test
    public void testSolveWSP() throws Exception {
        WSPRequest request = new WSPRequest();
        request.setNumSteps(3);
        request.setNumUsers(4);
        request.setAuthorized(new int[][]{{1, 0, 1}, {0, 1, 0}, {1, 1, 1}, {0, 0, 1}});
        request.setMustSameConstraints(List.of(new WSPRequest.Constraint(0, 1)));
        request.setMustDifferentConstraints(List.of(new WSPRequest.Constraint(1, 2)));
        request.setSolverType("SAT");
        
        WSPResponse response = WSPResponse.success(
            new int[]{0, 1, 0}, 
            100, 
            "SAT"
        );
        
        when(wspService.solveWSP(any(WSPRequest.class))).thenReturn(response);
        
        mockMvc.perform(post("/api/wsp/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutionFound").value(true))
                .andExpect(jsonPath("$.message").value("Solution found successfully"))
                .andExpect(jsonPath("$.assignment").isArray())
                .andExpect(jsonPath("$.solverUsed").value("SAT"));
    }
}
