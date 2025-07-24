package WSP;

import java.util.function.BiConsumer;

import WSP.VertexCover.ConstraintGraph;

public class WSPUtils {
    /** Transpose a [rows][cols] matrix into [cols][rows]. */
    public static int[][] transpose(int[][] m) {
        int rows = m.length, cols = m[0].length;
        int[][] t = new int[cols][rows];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                t[j][i] = m[i][j];
            }
        }
        return t;
    }

    /**
     * Walks the ConstraintGraph and for each BLACK edge calls addSame(i,j),
     * and for each RED edge calls addDiff(i,j) on the given encoder.
     */
    public static <E> void applyGraphConstraints(
            E encoder,
            BiConsumer<Integer,Integer> addSame,
            BiConsumer<Integer,Integer> addDiff,
            ConstraintGraph graph,
            int numSteps
    ) {
        for (int i = 0; i < numSteps; i++) {
            for (int j = i + 1; j < numSteps; j++) {
                int type = graph.getConstraintType(i, j);
                if (type == ConstraintGraph.BLACK) {
                    addSame.accept(i, j);
                } else if (type == ConstraintGraph.RED) {
                    addDiff.accept(i, j);
                }
            }
        }
    }
}
