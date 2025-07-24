package WSP.VertexCover;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * This class implements a simple undirected graph using adjacency lists, where each vertex is 
 * rappresented by index and i use an array to keep track of which vertices are 'active' (not removed) 
 * also implements kernilization rules VC1 and VC2.
 * @author Yassir Maknaoui
 */


    /**
     * Create a graph with V vertices and no edges.
     */
public class Graph {
    private int V; // total number of vertices created initially
    private List<Set<Integer>> adj;
    private boolean[] active; // Track which vertices are active

    // Constructor
    public Graph(int V) {
        this.V = V;
        this.adj = new ArrayList<>();
        for (int i = 0; i < V; i++) {
            adj.add(new HashSet<>());
        }
        this.active = new boolean[V];
        for (int i = 0; i < V; i++) {
            active[i] = true; // initially all vertices are active
        }
    }

    /**
     * Returns the "active" degree of vertex u, counting only active neighbors.
     */
    public int VertexDegree(int u) {
        if (!active[u]) return 0;
        int count = 0;
        for (int w : adj.get(u)) {
            if (active[w]) count++;
        }
        return count;
    }

    /**
     * Add an undirected edge between u and v.
     */
    public void addEdge(int u, int v) {
        adj.get(u).add(v);
        adj.get(v).add(u);
    }



    public Set<Integer> returnNeighbours(int u){
        return Collections.unmodifiableSet(adj.get(u));
    }

    /**
     * "Removes" a vertex u by marking it inactive. Edges remain in the data structure
     * but are ignored since active[u] = false.
     */
    public void removeVertex(int u) {
        if (!active[u]) return; // already removed
        active[u] = false;
    }

    /**
     * Restore a previously removed vertex u (for backtracking).
     * If you don't physically remove edges, this just sets active[u] = true.
     */
    public void restoreVertex(int u) {
        active[u] = true;
    }

    /**
     * Get all edges currently active (both endpoints active).
     */
    public List<int[]> getEdges() {
        List<int[]> edges = new ArrayList<>();
        for (int u = 0; u < V; u++) {
            if (!active[u]) continue;
            for (int v : adj.get(u)) {
                if (!active[v]) continue;
                if (u < v) {
                    edges.add(new int[]{u, v});
                }
            }
        }
        return edges;
    }

    // Print all active edges in the graph
    public void printEdges() {
        List<int[]> edges = getEdges();
        System.out.println("Edges in the graph:");
        for (int[] edge : edges) {
            System.out.println("(" + edge[0] + ", " + edge[1] + ")");
        }
    }

    /**
     * Remove isolated vertices (no edges) by marking them inactive.
     * This is the VC1 kernelization rule.
     */
    public void VC1() {
        for (int i = 0; i < V; i++) {
            if (active[i] && adj.get(i).isEmpty()) {
                active[i] = false;
            }
        }
    }

    /**
     * Find the vertex with the highest degree (among active vertices).
     */
    public int HighestDegree() {
        int max = -1;
        int vertex = -1;
        for (int i = 0; i < V; i++) {
            if (active[i]) {
                int deg = VertexDegree(i);
                if (deg > max) {
                    max = deg;
                    vertex = i;
                }
            }
        }
        return vertex;
    }
     /**
     * VC2 kernelization rule: If a vertex has degree > k, it must be in the vertex cover.
     * We add that vertex to 'cover' and remove it, decreasing k.
     * Returns the updated k value.
     */
    public int VC2(int k, List<Integer> cover) {
        int z = HighestDegree();
        while (z != -1 && VertexDegree(z) > k) {
            // Add z to the kernel cover
            cover.add(z);
            removeVertex(z);
            k--;
            z = HighestDegree();
        }
        return k;
    }
    /**
     * Counts how many vertices are currently active.
     */
    public int size() {
        // If you want the count of active vertices:
        int count = 0;
        for (boolean b : active) {
            if (b) count++;
        }
        return count;
    }
    
    public void printActiveStatus() {
        for (int i = 0; i < V; i++) {
            System.out.println("Vertex " + i + ": " + (active[i] ? "active" : "inactive"));
        }
    }

    /**
     * Checks if a vertex is active.
     */
    public boolean isActive(int v) {
        return active[v];
    }
}
