package WSP;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import WSP.VertexCover.ConstraintGraph;

public class ConstraintGraphTest {
    private ConstraintGraph graph;

    @BeforeEach
    void setUp() {
        graph = new ConstraintGraph(4); 
        graph.addConstraintEdge(0, 1, ConstraintGraph.BLACK); 
        graph.addConstraintEdge(1, 2, ConstraintGraph.RED);   
        graph.addConstraintEdge(2, 3, ConstraintGraph.RED);   
        graph.addConstraintEdge(0, 3, ConstraintGraph.RED);   
    }

    @Test
    void testConstraintEdges() {
        assertEquals(ConstraintGraph.BLACK, graph.getConstraintType(0, 1)); 
        assertEquals(ConstraintGraph.RED, graph.getConstraintType(1, 2)); 
        assertEquals(ConstraintGraph.RED, graph.getConstraintType(2, 3)); 
        assertEquals(ConstraintGraph.RED, graph.getConstraintType(0, 3)); 
    }

    @Test
    void testValidAssignment() {
        int[] validEncoding = {1, 1, 2, 3}; 
        assertTrue(graph.AssignmentValidation(validEncoding, 2)); 

        int[] invalidEncoding = {1, 2, 2, 3}; 
        assertFalse(graph.AssignmentValidation(invalidEncoding, 2)); 
    }

    @Test
    void testEmptyGraph() {
        ConstraintGraph emptyGraph = new ConstraintGraph(0);
        assertNotNull(emptyGraph); 
    }

    @Test
    void testAddConstraintEdge() {
        // Add a new constraint edge and verify it exists
        graph.addConstraintEdge(3, 0, ConstraintGraph.BLACK);
        assertEquals(ConstraintGraph.BLACK, graph.getConstraintType(3, 0));
        assertEquals(ConstraintGraph.BLACK, graph.getConstraintType(0, 3));
    }

    @Test
    void testGetConstraintType_NoEdge() {
        // Test for vertices with no edge between them
        assertEquals(-1, graph.getConstraintType(1, 3), "No edge should return -1.");
    }

    @Test
    void testAssignmentValidation_AllValid() {
        // Test a fully valid assignment
        int[] validEncoding = {0, 0, 1, 2};
        assertTrue(graph.AssignmentValidation(validEncoding, 3), "The assignment should be valid.");
    }

    @Test
    void testAssignmentValidation_AllInvalid() {
        // Test a fully invalid assignment
        int[] invalidEncoding = {0, 0, 0, 0};
        assertFalse(graph.AssignmentValidation(invalidEncoding, 3), "The assignment should be invalid.");
    }

    @Test
    void testAddMultipleEdges() {
        // Add multiple edges and verify constraints
        graph.addConstraintEdge(0, 2, ConstraintGraph.BLACK);
        graph.addConstraintEdge(1, 3, ConstraintGraph.RED);

        assertEquals(ConstraintGraph.BLACK, graph.getConstraintType(0, 2));
        assertEquals(ConstraintGraph.RED, graph.getConstraintType(1, 3));
    }

    @Test
    void testRemoveEdge() {
        // Simulate removing an edge by overwriting it with no constraint
        graph.addConstraintEdge(0, 1, -1);
        assertEquals(-1, graph.getConstraintType(0, 1), "Edge should be removed.");
    }

    @Test
    void testLargeGraph() {
        // Test a larger graph with many constraints
        ConstraintGraph largeGraph = new ConstraintGraph(10);
        for (int i = 0; i < 10; i++) {
            for (int j = i + 1; j < 10; j++) {
                largeGraph.addConstraintEdge(i, j, (i + j) % 2 == 0 ? ConstraintGraph.BLACK : ConstraintGraph.RED);
            }
        }

        // Verify some constraints
        assertEquals(ConstraintGraph.BLACK, largeGraph.getConstraintType(0, 2));
        assertEquals(ConstraintGraph.RED, largeGraph.getConstraintType(1, 2));
    }
}