package WSP;

import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.function.Supplier;

import WSP.Backtracking.WSPBacktracking;
import WSP.PBT.WSPOrchestrator;
import WSP.VertexCover.ConstraintGraph;

import static WSP.WSPUtils.applyGraphConstraints;

/**
 * Times each solver finding one assignment on the same seeded random instances.
 * Writes every measurement to a CSV file and prints median times as a Markdown table.
 * Fails if the solvers disagree on whether an instance is satisfiable.
 *
 * Usage: mvn -q compile exec:java -Dexec.mainClass=WSP.BenchmarkRunner [-Dexec.args=output.csv]
 */
public class BenchmarkRunner {

    private static final int[] STEPS = {4, 6, 8, 10, 12};
    private static final int[] USERS = {5, 10};
    private static final double[] CONSTRAINT_DENSITIES = {0.1, 0.3};
    private static final double[] AUTH_DENSITIES = {0.5, 0.8};
    private static final int TRIALS = 5;
    private static final int WARMUP_INSTANCES = 50;
    private static final long SEED = 1234L;
    private static final String[] SOLVERS = {"Backtracking", "PBT", "CSP", "SAT"};

    public static void main(String[] args) throws Exception {
        String output = args.length > 0 ? args[0] : "results.csv";
        Random random = new Random(SEED);

        // Let the JIT warm up so early instances are not penalised.
        for (int i = 0; i < WARMUP_INSTANCES; i++) {
            ConstraintGraph graph = RandomInstance.generateGraph(8, 0.2, random);
            int[][] auth = RandomInstance.generateAuth(8, 5, 0.6, random);
            runAll(graph, auth, 8, 5);
        }

        Map<Integer, Map<String, List<Double>>> timesByStep = new LinkedHashMap<>();
        int instances = 0;
        int satisfiable = 0;
        try (PrintWriter out = new PrintWriter(new FileWriter(output))) {
            out.println("solver,numSteps,numUsers,constraintDensity,authDensity,timeMs,found");
            for (int steps : STEPS) {
                Map<String, List<Double>> times = new LinkedHashMap<>();
                for (String solver : SOLVERS) {
                    times.put(solver, new ArrayList<>());
                }
                timesByStep.put(steps, times);
                for (int users : USERS) {
                    for (double constraintDensity : CONSTRAINT_DENSITIES) {
                        for (double authDensity : AUTH_DENSITIES) {
                            for (int trial = 0; trial < TRIALS; trial++) {
                                ConstraintGraph graph = RandomInstance.generateGraph(steps, constraintDensity, random);
                                int[][] auth = RandomInstance.generateAuth(steps, users, authDensity, random);
                                Map<String, Result> results = runAll(graph, auth, steps, users);
                                instances++;
                                boolean found = results.get("Backtracking").found;
                                satisfiable += found ? 1 : 0;
                                for (String solver : SOLVERS) {
                                    Result result = results.get(solver);
                                    if (result.found != found) {
                                        throw new IllegalStateException(solver + " disagrees on "
                                                + Arrays.deepToString(auth));
                                    }
                                    times.get(solver).add(result.timeMs);
                                    out.printf("%s,%d,%d,%.2f,%.2f,%.3f,%b%n", solver, steps, users,
                                            constraintDensity, authDensity, result.timeMs, result.found);
                                }
                            }
                        }
                    }
                }
                out.flush();
            }
        }
        printSummary(timesByStep, instances, satisfiable);
    }

    private static Map<String, Result> runAll(ConstraintGraph graph, int[][] auth, int steps, int users) {
        WSPCSPEncoder csp = new WSPCSPEncoder(steps, users, auth);
        applyGraphConstraints(csp, csp::addMustSameConstraint, csp::addMustDifferentConstraint, graph, steps);
        WSPSATEncoder sat = new WSPSATEncoder(steps, users, auth);
        applyGraphConstraints(sat, sat::addMustSameConstraint, sat::addMustDifferentConstraint, graph, steps);

        Map<String, Result> results = new LinkedHashMap<>();
        results.put("Backtracking", time(() -> new WSPBacktracking(graph, users, steps, auth).findFirstSolution()));
        results.put("PBT", time(() -> new WSPOrchestrator(graph, auth, steps, users).findAssignment()));
        results.put("CSP", time(csp::solveCSP));
        results.put("SAT", time(sat::encodeAndSolve));
        return results;
    }

    private static Result time(Supplier<int[]> solver) {
        long start = System.nanoTime();
        int[] assignment = solver.get();
        return new Result((System.nanoTime() - start) / 1e6, assignment != null);
    }

    private static void printSummary(Map<Integer, Map<String, List<Double>>> timesByStep, int instances, int satisfiable) {
        System.out.printf("%d instances, %d satisfiable. Median time in ms:%n%n", instances, satisfiable);
        System.out.println("| Steps | " + String.join(" | ", SOLVERS) + " |");
        System.out.println("|---|---|---|---|---|");
        timesByStep.forEach((steps, times) -> {
            StringBuilder row = new StringBuilder("| " + steps + " |");
            for (String solver : SOLVERS) {
                row.append(String.format(" %.2f |", median(times.get(solver))));
            }
            System.out.println(row);
        });
    }

    private static double median(List<Double> values) {
        List<Double> sorted = new ArrayList<>(values);
        Collections.sort(sorted);
        int middle = sorted.size() / 2;
        return sorted.size() % 2 == 1 ? sorted.get(middle) : (sorted.get(middle - 1) + sorted.get(middle)) / 2;
    }

    private static final class Result {
        final double timeMs;
        final boolean found;

        Result(double timeMs, boolean found) {
            this.timeMs = timeMs;
            this.found = found;
        }
    }
}
