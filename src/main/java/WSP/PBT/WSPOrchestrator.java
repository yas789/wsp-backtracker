package WSP.PBT;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import WSP.VertexCover.ConstraintGraph;

public class WSPOrchestrator {
      private ConstraintGraph graph;    // For step-to-step constraints in partition generation
    private int[][] authorized;       // authorized[step][user] = 1 or 0
    private int numSteps;
    private int numUsers;

    private PartitionGenerator partitionGenerator; 

    public WSPOrchestrator(ConstraintGraph graph,
                           int[][] authorized,
                           int numSteps,
                           int numUsers) {
        this.graph = graph;
        this.authorized = authorized;
        this.numSteps = numSteps;
        this.numUsers = numUsers;

        // Create the partition generator using your constraints (graph).
        this.partitionGenerator = new PartitionGenerator(this.graph, this.numSteps);
    }
    
    public List<int[]> solve() {
        partitionGenerator.GenerateParitions();
        List<List<Set<Integer>>> allPartitions = partitionGenerator.getValidPartitions();
        System.out.println(allPartitions);

        List<int[]> blockAssignments = new ArrayList<>();
        boolean anyValid = false;

        for (List<Set<Integer>> partition : allPartitions) {
            int[] matching = PartitionAuthorizer.authorizePartition(partition, authorized, numUsers);

            if (matching != null) {
                anyValid = true;
                // System.out.println("Partition " + partition + " is authorized!");
                // Print the block->user assignment
                System.out.println(PartitionAuthorizer.matchingToString(partition, matching));

                // Build the step-based encoding
                int[] stepEncoding = buildVectorEncoding(partition, matching);
                System.out.println("Step-based encoding = " + Arrays.toString(stepEncoding));

                blockAssignments.add(matching);
            } else {
                // System.out.println("Partition " + partition + " is NOT authorized.\n");
                blockAssignments.add(null);
            }
            
        }
        if (!anyValid) {
            System.out.println(
                "WSP instance is unsatisfiable: no valid assignment was found " +
                "for any partition with the given constraints and authorization matrix."
            );
        }

        return blockAssignments; 
    }

    private int[] buildVectorEncoding(List<Set<Integer>> partition, int[] blockToUser) {
        if (blockToUser == null) return null;
        int[] encoding = new int[numSteps];
        Arrays.fill(encoding, -1);
        for (int b = 0; b < partition.size(); b++) {
            int user = blockToUser[b];
            for (int step : partition.get(b)) {
                encoding[step] = user;
            }
        }
        return encoding;
    }
}
