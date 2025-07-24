package WSP;

import com.google.ortools.Loader;
import com.google.ortools.sat.CpModel;
import com.google.ortools.sat.CpSolver;
import com.google.ortools.sat.CpSolverStatus;
import com.google.ortools.sat.IntVar;
import com.google.ortools.sat.LinearExpr;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


/**
 * WSPSATEncoder class encodes and solves the Workflow Satisfiability Problem (WSP)
 * using SAT-based constraints with OR-Tools.
 */
public class WSPSATEncoder {
    private int numSteps;       
    private int numUsers;       
    private int[][] authorized;
    private List<int[]> mustDifferent;
    private List<int[]> mustSame;
 /**
     * Constructor for WSPSATEncoder.
     * Initializes the encoder with the number of steps, users, and the authorization matrix.
     *
     * @param numSteps    Total number of steps in the workflow.
     * @param numUsers    Total number of users available.
     * @param authorized  Authorization matrix: authorized[s][u] = 1 if user u can perform step s, else 0.
     */
    public WSPSATEncoder(int numSteps, int numUsers, int[][] authorized) {
        this.numSteps = numSteps;
        this.numUsers = numUsers;
        this.authorized = authorized;
        this.mustDifferent = new ArrayList<>();
        this.mustSame = new ArrayList<>();
    }

       /**
     * Adds a "must-different" constraint between two steps.
     * Ensures that the two steps are assigned to different users.
     *
     * @param s1 Step 1.
     * @param s2 Step 2.
     */
    public void addMustDifferentConstraint(int s1, int s2) {
        mustDifferent.add(new int[]{s1, s2});
    }
    
     /**
     * Adds a "must-same" constraint between two steps.
     * Ensures that the two steps are assigned to the same user.
     *
     * @param s1 Step 1.
     * @param s2 Step 2.
     */
    public void addMustSameConstraint(int s1, int s2) {
        mustSame.add(new int[]{s1, s2});
    }


    /**
     * Encodes the WSP instance as a SAT problem and solves it using OR-Tools.
     *it map (s, u) to a unique variable by using: varID = (s * numUsers) + u.
     * @return An array representing the user assigned to each step, or null if no solution exists.
     */
    public int[] encodeAndSolve() {
        CpModel model = new CpModel();
        //  variables x[s][u] for each step s and user u.
        IntVar[][] x = new IntVar[numSteps][numUsers];
        for (int s = 0; s < numSteps; s++) {
            for (int u = 0; u < numUsers; u++) {
                x[s][u] = model.newBoolVar("x_" + s + "_" + u);
            }
        }

        // 1. Exactly one user per step: For each step s, the sum over all users must equal 1.
        for (int s = 0; s < numSteps; s++) {
            IntVar[] stepVars = new IntVar[numUsers];
            for (int u = 0; u < numUsers; u++) {
                stepVars[u] = x[s][u];
            }
            model.addEquality(LinearExpr.sum(stepVars), 1);
        }

        // 2. Authorization constraints: If a user is not authorized for a step, force x[s][u] = 0.
        for (int s = 0; s < numSteps; s++) {
            for (int u = 0; u < numUsers; u++) {
                if (authorized[s][u] == 0) {
                    model.addEquality(x[s][u], 0);
                }
            }
        }

        // 3. Must-different constraints: For each constraint (s1, s2) in mustDifferent, for every user, add:
        //    x[s1][u] + x[s2][u] <= 1.
        for (int[] pair : mustDifferent) {
            int s1 = pair[0], s2 = pair[1];
            for (int u = 0; u < numUsers; u++) {
                model.addLessOrEqual(LinearExpr.sum(new IntVar[]{x[s1][u], x[s2][u]}), 1);
            }
        }

        // 4. Must-same constraints: For each constraint (s1, s2) in mustSame, for every user, add:
        //    x[s1][u] == x[s2][u]
        for (int[] pair : mustSame) {
            int s1 = pair[0], s2 = pair[1];
            for (int u = 0; u < numUsers; u++) {
                model.addEquality(x[s1][u], x[s2][u]);
            }
        }

        // Solve the model.
        CpSolver solver = new CpSolver();
        CpSolverStatus status = solver.solve(model);
        if (status == CpSolverStatus.FEASIBLE || status == CpSolverStatus.OPTIMAL) {
            int[] assignment = new int[numSteps];
            // For each step, find the user for which x[s][u] is true.
            for (int s = 0; s < numSteps; s++) {
                for (int u = 0; u < numUsers; u++) {
                    if (solver.value(x[s][u]) == 1) {
                        assignment[s] = u;
                        break;
                    }
                }
            }
            return assignment;
        } else {
            return null;
        }
    }

 /**
     * Prints the final assignment of users to steps.
     *
     * @param assignment An array where assignment[s] = user assigned to step s.
     */
    public void printSolution(int[] assignment) {
        if (assignment == null) {
            System.out.println("No solution found.");
        } else {
            System.out.println("Step-based assignment (step -> user): " + Arrays.toString(assignment));
        }
    }
    
    public static void main(String[] args) {
        //note: loading the library takes quite some time for some reason<- Delete this 
        Loader.loadNativeLibraries();
        int numSteps = 3;
        int numUsers = 2;
        
        // Define an authorization matrix.
        // For instance:
        // Step 0: both users allowed → [1, 1]
        int[][] authorized = {
            {1, 1},
            {1, 1},
            {1, 1}
        };
        
        // Create a instance.
        WSPSATEncoder encoder = new WSPSATEncoder(numSteps, numUsers, authorized);
        // Add constraints:
        // For example, let step 0 and step 1 be assigned to different users.
        encoder.addMustDifferentConstraint(0, 1);
        // And, let step 1 and step 2 be assigned to the same user.
        encoder.addMustSameConstraint(1, 2);
        
        int[] solution = encoder.encodeAndSolve();
        encoder.printSolution(solution);
    }
}
