package com.fyp.wspapi.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class WSPRequest {
    @NotNull
    @Min(1)
    private Integer numSteps;
    
    @NotNull
    @Min(1)
    private Integer numUsers;
    
    @NotNull
    private int[][] authorized;
    
    private List<Constraint> mustSameConstraints;
    private List<Constraint> mustDifferentConstraints;
    
    @NotNull
    private String solverType; // "SAT", "CSP", "BACKTRACKING", or "PBT"

    // Constructors
    public WSPRequest() {}

    public WSPRequest(Integer numSteps, Integer numUsers, int[][] authorized, 
                     List<Constraint> mustSameConstraints, List<Constraint> mustDifferentConstraints,
                     String solverType) {
        this.numSteps = numSteps;
        this.numUsers = numUsers;
        this.authorized = authorized;
        this.mustSameConstraints = mustSameConstraints;
        this.mustDifferentConstraints = mustDifferentConstraints;
        this.solverType = solverType;
    }

    // Getters and Setters
    public Integer getNumSteps() { return numSteps; }
    public void setNumSteps(Integer numSteps) { this.numSteps = numSteps; }

    public Integer getNumUsers() { return numUsers; }
    public void setNumUsers(Integer numUsers) { this.numUsers = numUsers; }

    public int[][] getAuthorized() { return authorized; }
    public void setAuthorized(int[][] authorized) { this.authorized = authorized; }

    public List<Constraint> getMustSameConstraints() { return mustSameConstraints; }
    public void setMustSameConstraints(List<Constraint> mustSameConstraints) { 
        this.mustSameConstraints = mustSameConstraints; 
    }

    public List<Constraint> getMustDifferentConstraints() { return mustDifferentConstraints; }
    public void setMustDifferentConstraints(List<Constraint> mustDifferentConstraints) { 
        this.mustDifferentConstraints = mustDifferentConstraints; 
    }

    public String getSolverType() { return solverType; }
    public void setSolverType(String solverType) { this.solverType = solverType; }

    public static class Constraint {
        @NotNull
        @Min(0)
        private Integer step1;
        
        @NotNull
        @Min(0)
        private Integer step2;

        public Constraint() {}

        public Constraint(Integer step1, Integer step2) {
            this.step1 = step1;
            this.step2 = step2;
        }

        public Integer getStep1() { return step1; }
        public void setStep1(Integer step1) { this.step1 = step1; }

        public Integer getStep2() { return step2; }
        public void setStep2(Integer step2) { this.step2 = step2; }
    }
}
