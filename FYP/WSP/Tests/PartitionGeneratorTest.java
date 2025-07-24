package WSP.Tests;

import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Set;

import org.junit.Test;

import WSP.PBT.PartitionGenerator;
import WSP.VertexCover.ConstraintGraph;

public class PartitionGeneratorTest {

    @Test
    public void testMustSameConstraint() {
        ConstraintGraph graph = new ConstraintGraph(4);
        // Enforce that steps 1 and 2 must be in the same block
        graph.addConstraintEdge(1, 2, ConstraintGraph.BLACK);

        PartitionGenerator gen = new PartitionGenerator(graph, 4);
        gen.GenerateParitions();
        List<List<Set<Integer>>> parts = gen.getValidPartitions();

        // All partitions should have 1 and 2 co-located
        for (List<Set<Integer>> p : parts) {
            boolean together = false;
            for (Set<Integer> b : p) {
                if (b.contains(1) && b.contains(2)) {
                    together = true;
                    break;
                }
            }
            assertTrue(together,
                "Partition " + p + " must keep steps 1 and 2 together.");
        }

        // With 1&2 glued, the remaining two free steps form a 3-element set:
        // Bell(3) = 5 possible partitions.
        assertEquals(5, parts.size(),
            "Expected 5 partitions when exactly steps 1&2 are bound.");
    }

    @Test
    public void testChainConstraintAllTogether() {
        ConstraintGraph graph = new ConstraintGraph(4);
        // Chain all steps in a single block: 0=1, 1=2, 2=3
        graph.addConstraintEdge(0, 1, ConstraintGraph.BLACK);
        graph.addConstraintEdge(1, 2, ConstraintGraph.BLACK);
        graph.addConstraintEdge(2, 3, ConstraintGraph.BLACK);

        PartitionGenerator gen = new PartitionGenerator(graph, 4);
        gen.GenerateParitions();
        List<List<Set<Integer>>> parts = gen.getValidPartitions();

        // Only one partition is valid: all steps {0,1,2,3} together
        assertEquals(1, parts.size(),
            "All four steps chained by = should yield exactly one partition.");
        assertEquals(1, parts.get(0).size(),
            "That partition must contain exactly one block.");
        assertEquals(Set.of(0,1,2,3), parts.get(0).get(0),
            "The single block must be {0,1,2,3}.");
    }

    @Test
    public void testAllDifferentConstraint() {
        ConstraintGraph graph = new ConstraintGraph(3);
        // Force all pairs to be in different blocks
        graph.addConstraintEdge(0, 1, ConstraintGraph.RED);
        graph.addConstraintEdge(0, 2, ConstraintGraph.RED);
        graph.addConstraintEdge(1, 2, ConstraintGraph.RED);

        PartitionGenerator gen = new PartitionGenerator(graph, 3);
        gen.GenerateParitions();
        List<List<Set<Integer>>> parts = gen.getValidPartitions();

        // Only one way: each step in its own block
        assertEquals(1, parts.size(),
            "All-different on 3 steps should yield exactly one partition.");
        List<Set<Integer>> single = parts.get(0);
        assertEquals(3, single.size(),
            "Partition must have three singleton blocks.");
        assertTrue(single.contains(Set.of(0)),
            "Must contain the block {0}.");
        assertTrue(single.contains(Set.of(1)),
            "Must contain the block {1}.");
        assertTrue(single.contains(Set.of(2)),
            "Must contain the block {2}.");
    }

    @Test
    public void testMixedEqualityInequality() {
        ConstraintGraph graph = new ConstraintGraph(4);
        // 0=1, 2≠3, no other constraints
        graph.addConstraintEdge(0, 1, ConstraintGraph.BLACK);
        graph.addConstraintEdge(2, 3, ConstraintGraph.RED);

        PartitionGenerator gen = new PartitionGenerator(graph, 4);
        gen.GenerateParitions();
        List<List<Set<Integer>>> parts = gen.getValidPartitions();

        // Verify each partition respects both constraints
        for (List<Set<Integer>> p : parts) {
            boolean eq01 = false;
            boolean neq23 = true;
            for (Set<Integer> b : p) {
                if (b.contains(0) && b.contains(1)) eq01 = true;
                if (b.contains(2) && b.contains(3)) neq23 = false;
            }
            assertTrue(eq01,  "Partition " + p + " must keep steps 0 and 1 together.");
            assertTrue(neq23, "Partition " + p + " must keep steps 2 and 3 apart.");
        }
    }
}