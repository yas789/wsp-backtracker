package com.fyp.wspapi.dto;

public class WSPResponse {
    private boolean solutionFound;
    private int[] assignment;
    private String message;
    private long solvingTimeMs;
    private String solverUsed;

    // Constructors
    public WSPResponse() {}

    public WSPResponse(boolean solutionFound, int[] assignment, String message, 
                      long solvingTimeMs, String solverUsed) {
        this.solutionFound = solutionFound;
        this.assignment = assignment;
        this.message = message;
        this.solvingTimeMs = solvingTimeMs;
        this.solverUsed = solverUsed;
    }

    // Static factory methods
    public static WSPResponse success(int[] assignment, long solvingTimeMs, String solverUsed) {
        return new WSPResponse(true, assignment, "Solution found successfully", solvingTimeMs, solverUsed);
    }

    public static WSPResponse failure(String message, long solvingTimeMs, String solverUsed) {
        return new WSPResponse(false, null, message, solvingTimeMs, solverUsed);
    }

    // Getters and Setters
    public boolean isSolutionFound() { return solutionFound; }
    public void setSolutionFound(boolean solutionFound) { this.solutionFound = solutionFound; }

    public int[] getAssignment() { return assignment; }
    public void setAssignment(int[] assignment) { this.assignment = assignment; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public long getSolvingTimeMs() { return solvingTimeMs; }
    public void setSolvingTimeMs(long solvingTimeMs) { this.solvingTimeMs = solvingTimeMs; }

    public String getSolverUsed() { return solverUsed; }
    public void setSolverUsed(String solverUsed) { this.solverUsed = solverUsed; }
}
