package WSP;

import java.util.Random;

import WSP.VertexCover.ConstraintGraph;

/**
 * Utility for generating random WSP instances: constraint graphs and authorization matrices.
 */
public class RandomInstance {

    /**
     * Generates a random ConstraintGraph with n steps.  Each unordered pair (i,j) for i<j
     * is given a random constraint with probability p.  The constraint type is chosen
     * uniformly between BLACK (must-same) and RED (must-different).
     *
     * @param n the number of steps
     * @param p the probability that any given step-pair has a constraint
     * @param r a Random instance for reproducibility
     * @return a ConstraintGraph on n steps
     */
    public static ConstraintGraph generateGraph(int n, double p, Random r) {
        ConstraintGraph graph = new ConstraintGraph(n);
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (r.nextDouble() < p) {
                    // Randomly choose constraint type: BLACK (same) or RED (different)
                    int type = r.nextBoolean() ? ConstraintGraph.BLACK : ConstraintGraph.RED;
                    graph.addConstraintEdge(i, j, type);
                }
            }
        }
        return graph;
    }

    /**
     * Generates a random authorization matrix of size [numSteps][numUsers].
     * Each entry is set to 1 (authorized) with probability p, else 0 (unauthorized).
     *
     * @param numSteps the number of steps (rows)
     * @param numUsers the number of users (columns)
     * @param p the probability that a given (step,user) pair is authorized
     * @param r a Random instance for reproducibility
     * @return an int[numSteps][numUsers] authorization matrix
     */
    public static int[][] generateAuth(int numSteps, int numUsers, double p, Random r) {
        int[][] auth = new int[numSteps][numUsers];
        for (int s = 0; s < numSteps; s++) {
            for (int u = 0; u < numUsers; u++) {
                auth[s][u] = (r.nextDouble() < p) ? 1 : 0;
            }
        }
        return auth;
    }
}
