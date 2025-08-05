package com.fyp.wspapi.service;

import WSP.Backtracking.WSPBacktracking;
import WSP.PBT.WSPOrchestrator;
import WSP.VertexCover.ConstraintGraph;
import WSP.WSPCSPEncoder;
import WSP.WSPSATEncoder;
import WSP.WSPUtils;
import com.fyp.wspapi.dto.WSPRequest;
import com.fyp.wspapi.dto.WSPResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.BiConsumer;

@Service
public class WSPService {
    
    public WSPResponse solveWSP(WSPRequest request) {
        try {
            long startTime = System.currentTimeMillis();
            int[] solution;
            String solverUsed = request.getSolverType();
            
            // Use the authorization matrix as-is (already in steps × users format)
            int[][] stepByUser = request.getAuthorized();

            switch (solverUsed.toUpperCase()) {
                case "SAT":
                    solution = solveWithSAT(request, stepByUser);
                    break;
                case "CSP":
                    solution = solveWithCSP(request, stepByUser);
                    break;
                case "BACKTRACKING":
                    solution = solveWithBacktracking(request, stepByUser);
                    break;
                case "PBT":
                    solution = solveWithPBT(request, stepByUser);
                    break;
                default:
                    throw new IllegalArgumentException("Unsupported solver: " + solverUsed);
            }

            long solvingTime = System.currentTimeMillis() - startTime;
            
            // Check if solution is null and return appropriate response
            if (solution == null) {
                return WSPResponse.failure("No valid assignment found that satisfies all constraints", solvingTime, solverUsed);
            }
            
            return WSPResponse.success(solution, solvingTime, solverUsed);

        } catch (Exception e) {
            return WSPResponse.failure("Error: " + e.getMessage(), 0, "NONE");
        }
    }

    private int[] solveWithSAT(WSPRequest request, int[][] stepByUser) {
        WSPSATEncoder encoder = new WSPSATEncoder(
            request.getNumSteps(),
            request.getNumUsers(),
            stepByUser
        );
        applyConstraints(encoder, request);
        return encoder.encodeAndSolve();
    }

    private int[] solveWithCSP(WSPRequest request, int[][] stepByUser) {
        WSPCSPEncoder encoder = new WSPCSPEncoder(
            request.getNumSteps(),
            request.getNumUsers(),
            stepByUser
        );
        applyConstraints(encoder, request);
        int[] solution = encoder.solveCSP();
        if (solution == null) {
            throw new IllegalStateException("No valid assignment found that satisfies all constraints");
        }
        return solution;
    }

    private int[] solveWithBacktracking(WSPRequest request, int[][] stepByUser) {
        ConstraintGraph graph = createConstraintGraph(request);
        WSPBacktracking wsp = new WSPBacktracking(
            graph,
            request.getNumUsers(),
            request.getNumSteps(),
            stepByUser
        );
        wsp.runBacktracking();
        List<int[]> solutions = wsp.getSolutions();
        return solutions.isEmpty() ? null : solutions.get(0);
    }

    private int[] solveWithPBT(WSPRequest request, int[][] stepByUser) {
        ConstraintGraph graph = createConstraintGraph(request);
        WSPOrchestrator orchestrator = new WSPOrchestrator(
            graph,
            stepByUser,
            request.getNumSteps(),
            request.getNumUsers()
        );
        // For now, use backtracking as fallback until PBT is fully implemented
        return solveWithBacktracking(request, stepByUser);
    }

    private void applyConstraints(Object solver, WSPRequest request) {
        ConstraintGraph graph = createConstraintGraph(request);
        WSPUtils.applyGraphConstraints(
            solver,
            getAddSameConstraintMethod(solver),
            getAddDifferentConstraintMethod(solver),
            graph,
            request.getNumSteps()
        );
    }

    private ConstraintGraph createConstraintGraph(WSPRequest request) {
        ConstraintGraph graph = new ConstraintGraph(request.getNumSteps());
        
        // Add must-same constraints (Binding of Duty - BLACK edges)
        if (request.getMustSameConstraints() != null) {
            for (WSPRequest.Constraint c : request.getMustSameConstraints()) {
                graph.addConstraintEdge(c.getStep1(), c.getStep2(), ConstraintGraph.BLACK);
            }
        }
        
        // Add must-different constraints (Separation of Duty - RED edges)
        if (request.getMustDifferentConstraints() != null) {
            for (WSPRequest.Constraint c : request.getMustDifferentConstraints()) {
                graph.addConstraintEdge(c.getStep1(), c.getStep2(), ConstraintGraph.RED);
            }
        }
        
        return graph;
    }

    private BiConsumer<Integer, Integer> getAddSameConstraintMethod(Object solver) {
        if (solver instanceof WSPSATEncoder) {
            return ((WSPSATEncoder) solver)::addMustSameConstraint;
        } else if (solver instanceof WSPCSPEncoder) {
            return ((WSPCSPEncoder) solver)::addMustSameConstraint;
        }
        throw new UnsupportedOperationException("Unsupported solver type: " + solver.getClass().getName());
    }

    private BiConsumer<Integer, Integer> getAddDifferentConstraintMethod(Object solver) {
        if (solver instanceof WSPSATEncoder) {
            return ((WSPSATEncoder) solver)::addMustDifferentConstraint;
        } else if (solver instanceof WSPCSPEncoder) {
            return ((WSPCSPEncoder) solver)::addMustDifferentConstraint;
        }
        throw new UnsupportedOperationException("Unsupported solver type: " + solver.getClass().getName());
    }
}
