package com.fyp.wspapi.controller;

import com.fyp.wspapi.WspApiApplication;
import com.fyp.wspapi.service.WSPService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = WspApiApplication.class)
@AutoConfigureMockMvc
public class WSPControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WSPService wspService;

    @Test
    public void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/wsp/health"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("WSP API is running")));
    }

    @Test
    public void testSolversEndpoint() throws Exception {
        mockMvc.perform(get("/api/wsp/solvers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0]").value("SAT"))
                .andExpect(jsonPath("$[1]").value("CSP"));
    }
}
