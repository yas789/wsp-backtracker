package WSP.Tests;

import WSP.Backtracking.WSPBacktracking;
import WSP.VertexCover.ConstraintGraph;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class WSPBacktrackingTest {

    @Test
    public void testBacktracking_ValidAssignment() {
        // Step 1: Create a ConstraintGraph for 3 steps.
        ConstraintGraph graph = new ConstraintGraph(3);

        // Add constraints: Step 0 and Step 1 must be assigned to the same user (BLACK constraint).
        graph.addConstraintEdge(0, 1, ConstraintGraph.BLACK);

        // Step 2: Define the authorization matrix.
        int[][] authorized = {
            {1, 1, 0}, // Step 0: User 0 and User 1 are authorized.
            {1, 1, 1}, // Step 1: All users are authorized.
            {0, 1, 1}  // Step 2: User 1 and User 2 are authorized.
        };

        // Step 3: Create a WSPBacktracking instance.
        WSPBacktracking backtracking = new WSPBacktracking(graph, 3, 3, authorized);

        // Step 4: Run the backtracking algorithm.
        backtracking.runBacktracking();

        // Step 5: Validate the results using toString().
        String result = backtracking.toString();
        assertNotNull(result, "The result should not be null.");
        assertFalse(result.contains("no valid assignments"), "There should be at least one valid assignment.");
        assertTrue(result.contains("[0, 0, 1]") || result.contains("[1, 1, 2]"),
            "The result should contain valid assignments that satisfy the constraints.");
    }

    @Test
    public void testBacktracking_NoValidAssignment() {
        // Step 1: Create a ConstraintGraph for 3 steps.
        ConstraintGraph graph = new ConstraintGraph(3);

        // Add constraints: Step 0 and Step 1 must be assigned to different users (RED constraint).
        graph.addConstraintEdge(0, 1, ConstraintGraph.RED);

        // Step 2: Define the authorization matrix.
        int[][] authorized = {
            {1, 0, 0}, // Step 0: Only User 0 is authorized.
            {0, 1, 0}, // Step 1: Only User 1 is authorized.
            {0, 0, 1}  // Step 2: Only User 2 is authorized.
        };

        // Step 3: Create a WSPBacktracking instance.
        WSPBacktracking backtracking = new WSPBacktracking(graph, 3, 3, authorized);

        // Step 4: Run the backtracking algorithm.
        backtracking.runBacktracking();

        // Step 5: Validate the results using toString().
        String result = backtracking.toString();
        assertNotNull(result, "The result should not be null.");
        assertTrue(result.contains("no valid assignments"), "There should be no valid assignments.");
    }

    @Test
    public void testBacktracking_SingleStep() {
        // Step 1: Create a ConstraintGraph for 1 step.
        ConstraintGraph graph = new ConstraintGraph(1);

        // Step 2: Define the authorization matrix.
        int[][] authorized = {
            {1, 1, 1} // Step 0: All users are authorized.
        };

        // Step 3: Create a WSPBacktracking instance.
        WSPBacktracking backtracking = new WSPBacktracking(graph, 3, 1, authorized);

        // Step 4: Run the backtracking algorithm.
        backtracking.runBacktracking();

        // Step 5: Validate the results using toString().
        String result = backtracking.toString();
        assertNotNull(result, "The result should not be null.");
        assertFalse(result.contains("no valid assignments"), "There should be valid assignments.");
        assertTrue(result.contains("[0]") || result.contains("[1]") || result.contains("[2]"),
            "The result should contain valid assignments for the single step.");
    }
}