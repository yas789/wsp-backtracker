package WSP.PBT;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class PartitionAuthorizer {

    /**
     * Build adjacency (blocks → users) via row-combining.
     */
    public static List<List<Integer>> buildBlockUserAdj(List<Set<Integer>> partition, int[][] authorized, int numUsers) {
        int m = partition.size(); // number of blocks
        List<List<Integer>> adjacency = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            adjacency.add(new ArrayList<>());
        }

        // For each block, combine the rows
        for (int blockIdx = 0; blockIdx < m; blockIdx++) {
            Set<Integer> block = partition.get(blockIdx);
            int[] sumRow = new int[numUsers];
            for (int step : block) {
                for (int u = 0; u < numUsers; u++) {
                    sumRow[u] += authorized[step][u];
                }
            }
            int blockSize = block.size();
            for (int u = 0; u < numUsers; u++) {
                if (sumRow[u] == blockSize) {
                    adjacency.get(blockIdx).add(u);
                }
            }
        }
        return adjacency;
    }

    /**
     * Use a DFS-based matching (Kuhn's) to match blocks to users.
     */
    public static int[] getBlockUserMatching(List<List<Integer>> adjacency, int numBlocks, int numUsers) {
        // matchUser[u] = block index that user u is matched to, or -1 if unmatched
        int[] matchUser = new int[numUsers];
        for (int u = 0; u < numUsers; u++) {
            matchUser[u] = -1;
        }

        int matchedBlocks = 0;
        for (int b = 0; b < numBlocks; b++) {
            boolean[] used = new boolean[numUsers];
            if (tryMatch(b, adjacency, matchUser, used)) {
                matchedBlocks++;
            }
        }

        if (matchedBlocks != numBlocks) {
            return null; // Not every block was matched
        }

        // Invert the matching
        int[] blockToUser = new int[numBlocks];
        for (int i = 0; i < numBlocks; i++) {
            blockToUser[i] = -1;
        }
        for (int u = 0; u < numUsers; u++) {
            if (matchUser[u] != -1) {
                blockToUser[matchUser[u]] = u;
            }
        }
        return blockToUser;
    }

    /**
     * Kuhn's DFS
     */
    private static boolean tryMatch(int b, List<List<Integer>> adjacency, int[] matchUser, boolean[] used) {
        for (int user : adjacency.get(b)) {
            if (!used[user]) {
                used[user] = true;
                if (matchUser[user] == -1 || tryMatch(matchUser[user], adjacency, matchUser, used)) {
                    matchUser[user] = b;
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Wrapper: build adjacency, run matching, return assignment array (null if not authorized).
     */
    public static int[] authorizePartition(List<Set<Integer>> partition, int[][] authorized, int numUsers) {
        List<List<Integer>> adjacency = buildBlockUserAdj(partition, authorized, numUsers);
        int[] matching = getBlockUserMatching(adjacency, partition.size(), numUsers);
        return matching;
    }

    /**
     * Convert block→user assignment to a string.
     * If assignment is null, means the partition is not authorized.
     */
    public static String matchingToString(List<Set<Integer>> partition, int[] blockToUser) {
        if (blockToUser == null) {
            return "No full matching found (partition is not authorized).";
        }
        StringBuilder sb = new StringBuilder();
        sb.append("Block-to-user matching:\n");
        for (int i = 0; i < blockToUser.length; i++) {
            sb.append("Block " + partition.get(i) + " -> User " + blockToUser[i] + "\n");
        }
        return sb.toString();
    }
}
