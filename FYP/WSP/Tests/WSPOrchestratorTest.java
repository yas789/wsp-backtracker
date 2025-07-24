package WSP.Tests;

import java.util.Arrays;

import WSP.PBT.WSPOrchestrator;
import WSP.VertexCover.ConstraintGraph;

public class WSPOrchestratorTest {
    public static void main(String[] args) {
        // Step 1: Create a ConstraintGraph for 4 steps
        // (Steps = 0,1,2,3)
        ConstraintGraph graph = new ConstraintGraph(5);
        graph.addConstraintEdge(0, 1, ConstraintGraph.BLACK); // s1 = s2
        graph.addConstraintEdge(1, 2, ConstraintGraph.RED);   // s2 ≠ s3
        graph.addConstraintEdge(2, 3, ConstraintGraph.RED);   // s3 ≠ s4
        graph.addConstraintEdge(0, 3, ConstraintGraph.RED);   // s1 ≠ s4
        graph.addConstraintEdge(0, 2, ConstraintGraph.RED);   // s1 ≠ s4

     
        int[][] authorized = {
            // step0: user0=1, user1=1, user2=0
            {0, 0, 1,},
            {0, 1, 1,},
            {0, 0, 1,},
            {1, 1, 1,},
            {1, 1, 1,},
        };

        int numSteps = 5;
        int numUsers = 3;

        // Step 3: Create a WSPOrchestrator with these parameters
        WSPOrchestrator orchestrator = new WSPOrchestrator(
            graph,        // step constraints
            authorized,   // user-step authorization matrix
            numSteps, 
            numUsers
        );


        orchestrator.solve();
    }
}
