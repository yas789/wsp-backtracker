package WSP;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Random;

import org.junit.jupiter.api.Test;

import WSP.Backtracking.WSPBacktracking;
import WSP.PBT.WSPOrchestrator;
import WSP.VertexCover.ConstraintGraph;

/** All four solvers must agree on satisfiability and return valid assignments. */
class SolverAgreementTest {

    private static final int INSTANCES = 300;

    @Test
    void solversAgreeOnRandomInstances() {
        Random random = new Random(42L);
        int satisfiable = 0;
        for (int i = 0; i < INSTANCES; i++) {
            int steps = 2 + random.nextInt(6);
            int users = 1 + random.nextInt(4);
            double constraintDensity = 0.1 + random.nextDouble() * 0.4;
            double authDensity = 0.3 + random.nextDouble() * 0.6;
            ConstraintGraph graph = RandomInstance.generateGraph(steps, constraintDensity, random);
            int[][] auth = RandomInstance.generateAuth(steps, users, authDensity, random);

            WSPBacktracking backtracking = new WSPBacktracking(graph, users, steps, auth);
            backtracking.runBacktracking();
            boolean expected = !backtracking.getSolutions().isEmpty();
            if (expected) {
                satisfiable++;
            }

            WSPCSPEncoder csp = new WSPCSPEncoder(steps, users, auth);
            WSPUtils.applyGraphConstraints(csp, csp::addMustSameConstraint,
                    csp::addMustDifferentConstraint, graph, steps);
            WSPSATEncoder sat = new WSPSATEncoder(steps, users, auth);
            WSPUtils.applyGraphConstraints(sat, sat::addMustSameConstraint,
                    sat::addMustDifferentConstraint, graph, steps);

            String label = "instance " + i;
            check("PBT " + label, new WSPOrchestrator(graph, auth, steps, users).findAssignment(),
                    expected, graph, auth);
            check("CSP " + label, csp.solveCSP(), expected, graph, auth);
            check("SAT " + label, sat.encodeAndSolve(), expected, graph, auth);
        }
        // Guard against a generator that only produces one kind of instance.
        assertNotEquals(0, satisfiable);
        assertNotEquals(INSTANCES, satisfiable);
    }

    private static void check(String label, int[] assignment, boolean expected,
            ConstraintGraph graph, int[][] auth) {
        assertEquals(expected, assignment != null, label + " satisfiability");
        if (assignment == null) {
            return;
        }
        for (int s = 0; s < assignment.length; s++) {
            assertEquals(1, auth[s][assignment[s]], label + " authorisation of step " + s);
            for (int t = s + 1; t < assignment.length; t++) {
                int type = graph.getConstraintType(s, t);
                if (type == ConstraintGraph.BLACK) {
                    assertEquals(assignment[s], assignment[t], label + " must-same " + s + "," + t);
                } else if (type == ConstraintGraph.RED) {
                    assertTrue(assignment[s] != assignment[t], label + " must-different " + s + "," + t);
                }
            }
        }
    }
}
