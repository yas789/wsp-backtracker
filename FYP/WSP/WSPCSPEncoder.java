package WSP;

import com.google.ortools.Loader;
import com.google.ortools.sat.CpModel;
import com.google.ortools.sat.CpSolver;
import com.google.ortools.sat.CpSolverStatus;
import com.google.ortools.sat.IntVar;
import com.google.ortools.util.Domain;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * A generic CSP-based WSP encoder using OR-Tools' CP-SAT solver.
 * Each step is an IntVar with a domain of authorized users.
 */
public class WSPCSPEncoder {
    static {
        // Load OR-Tools native libraries
        Loader.loadNativeLibraries();
    }

    private int numSteps;              // number of steps (0..numSteps-1)
    private int numUsers;              // number of users (0..numUsers-1)
    private int[][] authorized;        // authorized[s][u] = 1 if user u is allowed for step s, else 0

    private List<int[]> mustDifferent; // list of {s1, s2} pairs that must have different users
    private List<int[]> mustSame;      // list of {s1, s2} pairs that must have the same user

    /**
     * Construct a WSPCSPEncoder for a general WSP instance.
     * @param numSteps  total steps
     * @param numUsers  total users
     * @param authorized  a matrix: authorized[s][u] = 1 if user u can do step s, else 0
     */
    public WSPCSPEncoder(int numSteps, int numUsers, int[][] authorized) {
        this.numSteps = numSteps;
        this.numUsers = numUsers;
        this.authorized = authorized;
        this.mustDifferent = new ArrayList<>();
        this.mustSame = new ArrayList<>();
    }

    /**
     * Add a must-different constraint for steps s1 and s2.
     */
    public void addMustDifferentConstraint(int s1, int s2) {
        mustDifferent.add(new int[]{s1, s2});
    }

    /**
     * Add a must-same constraint for steps s1 and s2.
     */
    public void addMustSameConstraint(int s1, int s2) {
        mustSame.add(new int[]{s1, s2});
    }

    /**
     * Solve the WSP instance as a CSP. Returns an array 'assignment'
     * of length numSteps, where assignment[s] = user assigned to step s,
     * or null if no solution exists.
     */
    public int[] solveCSP() {
        CpModel model = new CpModel();

    // Create one IntVar for each step, domain = allowed users for that step
    IntVar[] stepVars = new IntVar[numSteps];
    for (int s = 0; s < numSteps; s++) {
        int[] allowedUsers = collectAllowedUsers(s);
        if (allowedUsers.length == 0) {
            // This step has no authorized users => unsatisfiable
            return null;
        }
        // Convert allowedUsers int[] to long[]
        long[] allowedLong = new long[allowedUsers.length];
        for (int i = 0; i < allowedUsers.length; i++) {
            allowedLong[i] = allowedUsers[i];
        }
        Domain domain = Domain.fromValues(allowedLong);
        stepVars[s] = model.newIntVarFromDomain(domain, "step_" + s);
    }

        // Add must-different constraints
        for (int[] pair : mustDifferent) {
            int s1 = pair[0];
            int s2 = pair[1];
            // stepVars[s1] != stepVars[s2]
            model.addDifferent(stepVars[s1], stepVars[s2]);
        }

        // Add must-same constraints
        for (int[] pair : mustSame) {
            int s1 = pair[0];
            int s2 = pair[1];
            // stepVars[s1] == stepVars[s2]
            model.addEquality(stepVars[s1], stepVars[s2]);
        }

        // Solve
        CpSolver solver = new CpSolver();
        CpSolverStatus status = solver.solve(model);

        if (status == CpSolverStatus.FEASIBLE || status == CpSolverStatus.OPTIMAL) {
            // Reconstruct the step->user assignment
            int[] assignment = new int[numSteps];
            for (int s = 0; s < numSteps; s++) {
                assignment[s] = (int) solver.value(stepVars[s]);
            }
            return assignment;
        } else {
            return null;
        }
    }

    /**
     * Collect a list of user IDs for which authorized[s][u] == 1.
     */
    private int[] collectAllowedUsers(int step) {
        List<Integer> allowed = new ArrayList<>();
        for (int u = 0; u < numUsers; u++) {
            if (authorized[step][u] == 1) {
                allowed.add(u);
            }
        }
        int[] result = new int[allowed.size()];
        for (int i = 0; i < allowed.size(); i++) {
            result[i] = allowed.get(i);
        }
        return result;
    }

    // Helper to print the final assignment
    public void printSolution(int[] assignment) {
        if (assignment == null) {
            System.out.println("No solution found (unsatisfiable).");
        } else {
            System.out.println("Step-based assignment (step -> user): " + Arrays.toString(assignment));
        }
    }

    // For Ad-hoc testing
    public static void main(String[] args) {
        // Example: 3 steps, 3 users
        int numSteps = 3;
        int numUsers = 3;
        // authorized matrix: step-> [ user0, user1, user2 ]
        // Step 0: user0, user2 allowed => [1, 0, 1]
        // Step 1: user1 allowed        => [0, 1, 0]
        // Step 2: all allowed          => [1, 1, 1]
        int[][] authorized = {
            {1, 0, 1},
            {0, 1, 0},
            {1, 1, 1}
        };

        WSPCSPEncoder encoder = new WSPCSPEncoder(numSteps, numUsers, authorized);

        // Example constraints: must-different(0,1), must-different(1,2)
        encoder.addMustDifferentConstraint(0, 1);
        encoder.addMustDifferentConstraint(1, 2);

        
        // encoder.addMustSameConstraint(0, 2);

        int[] assignment = encoder.solveCSP();
        encoder.printSolution(assignment);
    }
}
