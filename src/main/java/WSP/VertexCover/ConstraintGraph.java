package WSP.VertexCover;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * This class is an extention of the Graph class which is used for implementation of the UI constraints SoD and Bod 
 * 
 * @author Yassir Maknaoui
 */


public class ConstraintGraph extends Graph{
    public static final int RED = 1;
    public static final int BLACK = 0;   
    private List<Map<Integer , Integer>> adj;

    /*
     * Constructor
     * @param V Number of vertices
     * 
     */

    public ConstraintGraph(int V) {
        super(V);
        this.adj = new ArrayList<>();
         for (int i = 0; i < V; i++) {
            adj.add(new HashMap<>()); // Each node maps to a neighbor + constraint type
        }
    }
    /*
     * Add an edge and its constraint type to the graph
     * @param u First vertex   
     * @param v Second vertex
     * @param type Constraint type
     * 
     * Black fot  = Red for !=
     */

    public void addConstraintEdge(int u, int v, int type) {
        adj.get(u).put(v, type); 
        adj.get(v).put(u, type); 
    }

    /*
     * @param u one vertex 
     * @param v the other vertex 
     * this method returns the type of constraint between any two vertices
     */

    public int getConstraintType(int u, int v) {
        Integer constraint =  adj.get(u).get(v);
        if(constraint == null){
            return -1;
        }
        return constraint;
    }
/*
 * Check if the assignment of a vertex is valid
 * @param encoding The assignment of the vertices
 * @param stepIndex The vertex to be checked
 * @return True if the assignment is valid, false otherwise
 */
public boolean AssignmentValidation(int[] encoding, int stepIndex) {
    // For every step i < stepIndex (that might be assigned)
    for (int i = 0; i < stepIndex; i++) {
        // if there's a constraint between i and stepIndex
        int constraint = getConstraintType(i, stepIndex);
        if (constraint == BLACK) {
            if (encoding[i] != encoding[stepIndex]) return false;
        } else if (constraint == RED) {
            if (encoding[i] == encoding[stepIndex]) return false;
        }
    }
    return true;
}



}