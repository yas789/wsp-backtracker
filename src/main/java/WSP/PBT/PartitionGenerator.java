package WSP.PBT;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import WSP.VertexCover.ConstraintGraph;

/**
 * 
* The {@code PartitionGenerator} class generates valid partitions of workflow steps
 * based on constraints defined in a {@link ConstraintGraph}. Each partition represents
 * a grouping of steps that satisfy the constraints.
 * @author Yassir Maknaoui
 */

public class PartitionGenerator {
    private ConstraintGraph graph;
    private int numberSteps;
    private List<List<Set<Integer>>> validPartitions;
     /**
     * Constructs a {@code PartitionGenerator} with the given constraint graph and number of steps.
     *
     * @param graph       The constraint graph defining step relationships.
     * @param numberSteps The total number of steps in the workflow.
     */

    public PartitionGenerator(ConstraintGraph graph, int numberSteps ){ 
        this.graph = graph;
        this.numberSteps = numberSteps;
        this.validPartitions = new ArrayList<>();
    }   


  /**
     * Generates all valid partitions of the workflow steps based on the constraints.
     * The results are stored in the {@code validPartitions} list.
     */
public void GenerateParitions(){
List<Set<Integer>> intialPartions = new ArrayList<>();
dfsPartition(0,intialPartions ); 
}
  /**
     * Performs a depth-first search (DFS) to generate all valid partitions.
     *
     * @param stepIndex The current step being processed.
     * @param partition The current partition being built.
     */
private void dfsPartition(int stepIndex , List<Set<Integer>> partition){
    if (stepIndex == numberSteps){
        List<Set<Integer>> Partitioncopy = new ArrayList<>();
        for (Set<Integer> block : partition){
            Partitioncopy.add(new HashSet<>(block));
        }
        validPartitions.add(Partitioncopy);
        return;
    }

    int size = partition.size();
    for (int i = 0; i < size; i++) {
        Set<Integer> block = partition.get(i);
        if (CanBePlaced(block, stepIndex, partition)) {
            block.add(stepIndex);
            dfsPartition(stepIndex + 1, partition);
            block.remove(stepIndex); // backtrack
        }
    }
    if (canCreateNewBlock(stepIndex, partition)) {
        Set<Integer> newBlock = new HashSet<>();
        newBlock.add(stepIndex);
        partition.add(newBlock);
        dfsPartition(stepIndex + 1, partition);
        partition.remove(partition.size() - 1); // backtrack
    }




}
  /**
     * Performs a depth-first search (DFS) to generate all valid partitions.
     *
     * @param stepIndex The current step being processed.
     * @param partition The current partition being built.
     */
private boolean CanBePlaced(Set<Integer> block , int step , List<Set<Integer>> parition){
    for (int s : block) {
        int constraint = graph.getConstraintType(s, step);
        // If there's no constraint (i.e., -1), that's fine.
        if (constraint == -1) continue;
        // RED: must be different – cannot place together.
        if (constraint == ConstraintGraph.RED) {
            return false;
        }
    }
    // Check BLACK constraints: if step must be same as some step x,
    // ensure that if x is already placed in a block, it's in this block.
    for (int x = 0; x < numberSteps; x++) {
        if (x == step) continue;
        int constraint = graph.getConstraintType(step, x);
        if (constraint == ConstraintGraph.BLACK) {
            for (Set<Integer> b : parition) {
                // If x is placed and it is not in the current block, then step cannot join this block.
                if (b.contains(x) && b != block) {
                    return false;
                }
            }
        }
    }
    return true;

}

    /**
     * Determines if a new block can be created for a step without violating constraints.
     *
     * @param step      The step to be placed in a new block.
     * @param partition The current partition being built.
     * @return {@code true} if a new block can be created, {@code false} otherwise.
     */

private boolean canCreateNewBlock(int step, List<Set<Integer>> partition) {
    for (int x = 0; x < numberSteps; x++) {
        if (x == step) continue;
        int constraint = graph.getConstraintType(step, x);
        if (constraint == ConstraintGraph.BLACK) {
            // If x is already placed in any block, then step must join that block.
            for (Set<Integer> b : partition) {
                if (b.contains(x)) {
                    return false;
                }
            }
        }
    }
    return true;
}
   /**
     * Returns the list of all valid partitions generated.
     *
     * @return A list of valid partitions, where each partition is a list of sets of steps.
     */
public List<List<Set<Integer>>> getValidPartitions() {
    return validPartitions;
}
/*
 * prints valid paritions
 */
public void printValidPartitions() {
    System.out.println("=== Valid Partitions ===");
    for (List<Set<Integer>> partition : validPartitions) {
        System.out.println(partition);
    }
}


}