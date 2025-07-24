package WSP;

import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.List;
import java.util.Random;

import WSP.Backtracking.WSPBacktracking;
import WSP.PBT.WSPOrchestrator;
import WSP.VertexCover.ConstraintGraph;

import static WSP.WSPUtils.applyGraphConstraints;

public class BenchmarkRunner {

    public static void main(String[] args) throws Exception {
        PrintWriter out = new PrintWriter(new FileWriter("results.csv"));
        out.println("solver,numSteps,numUsers,pBR,pAuth,timeMs,found");

        int[] userSizes = {5, 10, 20, 40};
        double[] densities = {0.1, 0.3, 0.5};
        long seed = 1234L;
        Random rand = new Random(seed);
        
        for (int n = 5; n <= 40; n += 5) {  // increment steps gradually
            for (int k : userSizes) {
                for (double pBR : densities) {
                    for (double pAuth : densities) {
        
                        ConstraintGraph graph = RandomInstance.generateGraph(n, pBR, rand);
                        int[][] auth = RandomInstance.generateAuth(n, k, pAuth, rand);
        
                        // Backtracking
                        long t0 = System.nanoTime();
                        WSPBacktracking bt = new WSPBacktracking(graph, k, n, auth);
                        bt.runBacktracking();
                        long t1 = System.nanoTime();
                        boolean btFound = !bt.toString().contains("unsatisfiable");
                        out.printf("Backtracking,%d,%d,%.2f,%.2f,%.3f,%b%n",
                                n, k, pBR, pAuth, (t1 - t0) / 1e6, btFound);
        
                        // PBT Orchestrator
                        long s0 = System.nanoTime();
                        WSPOrchestrator orch = new WSPOrchestrator(graph, auth, n, k);
                        List<int[]> pbtResults = orch.solve();
                        long s1 = System.nanoTime();
                        boolean pbtFound = pbtResults.stream().anyMatch(x -> x != null);
                        out.printf("PBT,%d,%d,%.2f,%.2f,%.3f,%b%n",
                                n, k, pBR, pAuth, (s1 - s0) / 1e6, pbtFound);
        
                        // CSP Encoder
                        WSPCSPEncoder csp = new WSPCSPEncoder(n, k, auth);
                        applyGraphConstraints(
                                csp, csp::addMustSameConstraint, csp::addMustDifferentConstraint,
                                graph, n);
                        long c0 = System.nanoTime();
                        int[] solCSP = csp.solveCSP();
                        long c1 = System.nanoTime();
                        out.printf("CSP,%d,%d,%.2f,%.2f,%.3f,%b%n",
                                n, k, pBR, pAuth, (c1 - c0) / 1e6, solCSP != null);
        
                        // SAT Encoder
                        WSPSATEncoder sat = new WSPSATEncoder(n, k, auth);
                        applyGraphConstraints(
                                sat, sat::addMustSameConstraint, sat::addMustDifferentConstraint,
                                graph, n);
                        long q0 = System.nanoTime();
                        int[] solSat = sat.encodeAndSolve();
                        long q1 = System.nanoTime();
                        out.printf("SAT,%d,%d,%.2f,%.2f,%.3f,%b%n",
                                n, k, pBR, pAuth, (q1 - q0) / 1e6, solSat != null);
        
                        out.flush();
                    }
                }
            }
        }
           out.close();
    }
}
