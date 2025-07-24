package WSP.Tests;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.Test;

import WSP.PBT.PartitionAuthorizer;
import WSP.PBT.PartitionGenerator;
import WSP.VertexCover.ConstraintGraph;
import static org.junit.jupiter.api.Assertions.*;

public class PartitionAuthorizerTest {

@Test
    public void testAuthorizePartition_ValidPartition() {
        // Define the authorization matrix.
        int[][] authorized = {
            {1, 1, 0}, // Step 0: User 0 and User 1 are authorized.
            {1, 0, 1}, // Step 1: User 0 and User 2 are authorized.
            {0, 1, 1}, // Step 2: User 1 and User 2 are authorized.
            {1, 1, 1}  // Step 3: All users are authorized.
        };
        int numUsers = 3;

        // Define a valid partition: Block0 = {0, 1}, Block1 = {2, 3}.
        List<Set<Integer>> partition = new ArrayList<>();
        Set<Integer> block0 = new HashSet<>();
        block0.add(0);
        block0.add(1);
        Set<Integer> block1 = new HashSet<>();
        block1.add(2);
        block1.add(3);
        partition.add(block0);
        partition.add(block1);

        // Call the authorizePartition method.
        int[] matching = PartitionAuthorizer.authorizePartition(partition, authorized, numUsers);

        // Validate the result.
        assertNotNull(matching, "The partition should be authorized.");
        assertEquals(2, matching.length, "The matching should have 2 blocks.");
        assertTrue(matching[0] >= 0 && matching[0] < numUsers, "Block 0 should be assigned to a valid user.");
        assertTrue(matching[1] >= 0 && matching[1] < numUsers, "Block 1 should be assigned to a valid user.");
    }
    @Test
    public void testAuthorizePartition_InvalidPartition() {
        // Define the authorization matrix.
        int[][] authorized = {
            {1, 1, 0}, // Step 0: User 0 and User 1 are authorized.
            {1, 0, 1}, // Step 1: User 0 and User 2 are authorized.
            {0, 1, 1}, // Step 2: User 1 and User 2 are authorized.
            {1, 1, 1}  // Step 3: All users are authorized.
        };
        int numUsers = 3;

        
        List<Set<Integer>> partition = new ArrayList<>();
        Set<Integer> block0 = new HashSet<>();
        block0.add(0);
        block0.add(2);
        Set<Integer> block1 = new HashSet<>();
        block1.add(1);
        block1.add(3);
        partition.add(block0);
        partition.add(block1);

        
        int[] matching = PartitionAuthorizer.authorizePartition(partition, authorized, numUsers);
        assertNull(matching, "The partition should not be authorized.");
    }
     @Test
    public void testMatchingToString() {
        // Define a partition: Block0 = {0, 1}, Block1 = {2, 3}.
        List<Set<Integer>> partition = new ArrayList<>();
        Set<Integer> block0 = new HashSet<>();
        block0.add(0);
        block0.add(1);
        Set<Integer> block1 = new HashSet<>();
        block1.add(2);
        block1.add(3);
        partition.add(block0);
        partition.add(block1);

        // Define a valid matching: Block0 -> User 0, Block1 -> User 2.
        int[] matching = {0, 2};

        // Call the matchingToString method.
        String result = PartitionAuthorizer.matchingToString(partition, matching);

        // Validate the result.
        String expected = "Block 0 (steps: [0, 1]) -> User 0\n" +
                          "Block 1 (steps: [2, 3]) -> User 2";
        assertEquals(expected, result.trim(), "The matching string should match the expected format.");
    }

    public static void main(String[] args) {
        // Suppose we have 4 steps (0..3) and 3 users (0..2).
        // authorized[step][user] = 1 if user is authorized for that step, else 0.
        int[][] authorized = {
            {1, 1, 0}, // step0: user0=1, user1=1, user2=0
            {1, 0, 1}, // step1
            {0, 1, 1}, // step2
            {1, 1, 1}  // step3
        };
        int numUsers = 3;

        // Let's define a partition with 2 blocks:
        // Block0 = {0,1}, Block1 = {2,3}
        ConstraintGraph graph = new ConstraintGraph(4);

        PartitionGenerator generator = new PartitionGenerator(graph, 4);
        generator.GenerateParitions();
        List<List<Set<Integer>>> allPartitions = generator.getValidPartitions();
        for (List<Set<Integer>> partition : allPartitions) {
            int[] matchings = PartitionAuthorizer.authorizePartition(partition, authorized, numUsers);
            String results = PartitionAuthorizer.matchingToString(partition, matchings);
            System.out.println("Partition " + matchings + " =>\n" + results + "\n");
        }
        

    }
}
