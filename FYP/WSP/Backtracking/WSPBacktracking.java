package WSP.Backtracking;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import WSP.VertexCover.ConstraintGraph;

/*
 *  This class implements backtracking algorithm to solve the WSP problem
 * @Author Yassir Maknaoui
 * 
 */

public class WSPBacktracking {

    private int numSteps;
    private int numUsers;
    private int [] encoding;
    private ConstraintGraph graph;
    private List<int[]> collectedEncodings;
    private final int [][] authorisation;  // rows = steps, cols = users


    /*
     * Constructor
     * @param graph The constraint graph
     * @param numUsers Number of users
     * @param numSteps Number of steps
     * 
     */

    public WSPBacktracking(ConstraintGraph graph , int numUsers , int numSteps,int [][] authorisation ){
        this.graph = graph;
        this.numUsers = numUsers;
        this.numSteps = numSteps;
        this.encoding = new int[numSteps];
        this.collectedEncodings = new ArrayList<>();
        this.authorisation = authorisation;

    }
/*
 * Runs the backtracking algorithm
 */
public void runBacktracking(){
    backtracking(0);
}


/*
 * Run the backtracking algorithm to find all possible assignments
 * @return all possible assignments
 * 
 */
private void backtracking(int stepIndex) {
    if (stepIndex == numSteps) {
        collectedEncodings.add(encoding.clone());
        return;
    }

    for (int i = 0; i < numUsers; i++) {
        if (authorisation[stepIndex][i] != 1){continue;}  // not allowed → skip

        encoding[stepIndex] = i;
        if (graph.AssignmentValidation(encoding, stepIndex)) {
            backtracking(stepIndex + 1);
        }
    }
}


/*
 * Get all found solutions
 * @return List of solutions, where each solution is an array of user assignments
 */
public List<int[]> getSolutions() {
    return new ArrayList<>(collectedEncodings);
}

/*
 * Print out assignments
 * @return all possible assignments as a formatted string
 */
@Override
public String toString(){
    if (collectedEncodings.isEmpty()) {
        return "WSP instance is unsatisfiable: no valid assignments found.\n";
    }
    StringBuilder sb = new StringBuilder();
    for (int[] i : collectedEncodings){
        sb.append(Arrays.toString(i)).append("\n");
    }  
    return sb.toString(); 
}



}