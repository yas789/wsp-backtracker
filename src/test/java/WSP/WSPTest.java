package WSP;

import WSP.Backtracking.WSPBacktracking;
import WSP.VertexCover.ConstraintGraph;

/*
 * 
 * Class used for adhoc testing
 */

public class WSPTest {
    public static void main(String[] args) {
        ConstraintGraph graph = new ConstraintGraph(4);

        int[][] authorized = {
            // step0: user0=1, user1=1, user2=0
            {0, 0, 1, 1,},
            {0, 1, 1, 1},
            {0, 0, 1, 1},
            {1, 1, 1, 1}
        };

        //  constraints in the graph
        graph.addConstraintEdge(0, 1, ConstraintGraph.BLACK); // s1 = s2
        graph.addConstraintEdge(1, 2, ConstraintGraph.RED);   // s2 ≠ s3
        graph.addConstraintEdge(2, 3, ConstraintGraph.RED);   // s3 ≠ s4
        graph.addConstraintEdge(0, 3, ConstraintGraph.RED);   // s1 ≠ s4
        graph.addConstraintEdge(0, 2, ConstraintGraph.RED);   // s1 ≠ s4



        WSPBacktracking wsp = new WSPBacktracking(graph, 4, 4, authorized);
        wsp.runBacktracking();
        System.out.println(wsp);
    }
}
