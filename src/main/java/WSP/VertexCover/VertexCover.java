package WSP.VertexCover;
import java.util.Scanner;
import java.util.InputMismatchException;
import java.util.List;
import java.util.ArrayList;

/**
 * @author Yassir maknaoui
 * 
 * This class runs the Vertex Cover algorithm:
 * 1) Kernelization (VC1 and VC2)
 * 2) Backtracking to find a vertex cover of size <= k
 * 
 * If satisfiable, it returns a list of chosen vertices (vertex cover).
 * Otherwise, returns null.
 */

public class VertexCover {
   public static void main(String[] args) {
       Scanner scanner = new Scanner(System.in);
       Graph g = new Graph(5);
       g.addEdge(0, 1);
       g.addEdge(0, 2);
       g.addEdge(0, 3);
       g.addEdge(0, 4);
       System.out.println("Enter the parameter k: ");

       int k = 0;
       try {
           k = scanner.nextInt();
       } catch (InputMismatchException e) {
           System.out.println("Invalid input");
           scanner.close();
           return;
       }
       scanner.close();

       // Prepare a list to hold chosen vertices (kernel cover + backtracking)
       List<Integer> cover = new ArrayList<>();

       // Apply kernelization rules
       g.VC1(); // removes isolated vertices if any
       k = g.VC2(k, cover); 
       if (k < 0) {
           System.out.println("Not satisfiable");
           return;
       }

       // Now do backtracking with the reduced k and the already partially built cover
       if (backtracking(k, g, cover)) {
           System.out.println("Yes");
           System.out.println("Vertex cover: " + cover);
       } else {
           System.out.println("Not satisfiable");
       }
   }
    /**
     * Perform kernelization and backtracking, returning a vertex cover if found, else null.
     */

   public static List<Integer> backtrackingWithCover(int k, Graph g) {
    // preparew a list to hold chosen vertices (kernel + backtracking)
    List<Integer> cover = new ArrayList<>();

    // kernelization steps
    g.VC1();
    k = g.VC2(k, cover); 
    if (k < 0) {
        return null; // Not satisfiable
    }

    // now backtracking on the reduced instance
    if (backtracking(k, g, cover)) {
        return cover; 
    } else {
        return null; 
    }
}

    /**
     * Backtracking search for a vertex cover.
     * We pick an uncovered edge and try including one of its endpoints, recursively.
     */
   public static boolean backtracking(int k, Graph g, List<Integer> cover) {
       if (k < 0) {
           // If k is negative, we used too many vertices, fail
           return false;
       }

       List<int[]> edges = g.getEdges();
       if (edges.isEmpty()) {
           // No edges left, we have a valid vertex cover
           return true;
       }

       // Take the first edge
       int[] edge = edges.get(0);
       int u = edge[0];
       int v = edge[1];

       // Branch 1: Choose u
       if (g.isActive(u)) {
           g.removeVertex(u);
           cover.add(u);
           if (backtracking(k - 1, g, cover)) {
               return true;
           }
           // Backtrack
           cover.remove(cover.size() - 1);
           g.restoreVertex(u);
       }

       // Branch 2: Choose v
       if (g.isActive(v)) {
           g.removeVertex(v);
           cover.add(v);
           if (backtracking(k - 1, g, cover)) {
               return true;
           }
           // Backtrack
           cover.remove(cover.size() - 1);
           g.restoreVertex(v);
       }

       return false;
   }
}
