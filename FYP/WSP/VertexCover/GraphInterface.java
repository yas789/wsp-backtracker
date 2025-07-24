package WSP.VertexCover;

import javax.swing.JPanel;

import java.awt.*;
import java.util.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * 
 * This class handles the graphical interface of the graph drawing area.
 * Users can add vertices by left-clicking on empty space and create edges
 * by right-clicking on two vertices.
 * 
 * It also colors the vertices in the found vertex cover.
 */

public class GraphInterface extends JPanel {
    private static int vertex_size = 20;
    private java.util.List<Point> vertices;
    private java.util.List<int[]> edges;
    private Point selected_vertex;
    private Set<Integer> highlightedVertices = new HashSet<>(); // Store highlighted vertex IDs

    public GraphInterface() {
        vertices = new ArrayList<>();
        edges = new ArrayList<>();
        addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                handleMouseClick(e);
            }
        });
    }

    /**
     * Handle mouse clicks on the canvas.
     * left-click to add vertex if empty area.
     * Right-click: start or complete an edge.
     */

    private void handleMouseClick(MouseEvent e) {
        Point clickedPoint = e.getPoint();
        Point clickedVertex = findVertexAt(clickedPoint);

        if (e.getButton() == MouseEvent.BUTTON1) {
            // left-click: Add a new vertex if clicked on an empty area
            if (clickedVertex == null) {
                vertices.add(clickedPoint);
                vertex_size++;
            }
        } else if (e.getButton() == MouseEvent.BUTTON3) {
            if (clickedVertex != null) {
                if (selected_vertex == null) {
                    selected_vertex = clickedVertex;
                } else {
                    int index1 = vertices.indexOf(selected_vertex);
                    int index2 = vertices.indexOf(clickedVertex);
                    edges.add(new int[]{index1, index2});
                    selected_vertex = null; 
                }
            }
        }

        repaint(); // Redraw the canvas
    }

    /**
     * Check if the user clicked on an existing vertex.
     */
    private Point findVertexAt(Point point) {
        for (Point vertex : vertices) {
            if (point.distance(vertex) <= vertex_size) {
                return vertex;
            }
        }
        return null;
    }

    
    /**
     * Clear all vertices and edges from the canvas.
     */
    public void clear() {
        vertices.clear();
        edges.clear();
        vertex_size = 20;
        selected_vertex = null;
        highlightedVertices.clear();
        repaint();
    }

    /**
     * Convert the drawn graph into a Graph object for the algorithm.
     */
    public Graph toGraph() {
        Graph graph = new Graph(vertices.size());
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            graph.addEdge(u, v);
        }
        return graph;
    }

    /**
     * Highlight the vertices in the given cover.
     * Passing a null or empty list clears highlights.
     */
    public void highlightCover(Collection<Integer> cover) {
        highlightedVertices.clear();
        if (cover != null) {
            highlightedVertices.addAll(cover);
        }
        repaint();
    }
    /**
     * Paint the graph: draw edges, vertices, and highlight selected or cover vertices.
     */
    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        // Draw edges
        g.setColor(Color.BLACK);
        for (int[] edge : edges) {
            Point p1 = vertices.get(edge[0]);
            Point p2 = vertices.get(edge[1]);
            g.drawLine(p1.x, p1.y, p2.x, p2.y);
        }

        // Draw vertices
        for (int i = 0; i < vertices.size(); i++) {
            Point p = vertices.get(i);
            if (highlightedVertices.contains(i)) {
                // hihglighted vertex cover in yellow
                g.setColor(Color.YELLOW);
                g.fillOval(p.x - vertex_size, p.y - vertex_size, vertex_size * 2, vertex_size * 2);
                g.setColor(Color.BLACK);
                g.drawOval(p.x - vertex_size, p.y - vertex_size, vertex_size * 2, vertex_size * 2);
            } else {
                g.setColor(Color.WHITE);
                g.fillOval(p.x - vertex_size, p.y - vertex_size, vertex_size * 2, vertex_size * 2);
                g.setColor(Color.BLACK);
                g.drawOval(p.x - vertex_size, p.y - vertex_size, vertex_size * 2, vertex_size * 2);
            }
            g.drawString(String.valueOf(i), p.x - 5, p.y + 5); // Draw vertex ID
        }

        // highlight selected vertex with a red border
        if (selected_vertex != null) {
            g.setColor(Color.RED);
            g.drawOval(selected_vertex.x - vertex_size, selected_vertex.y - vertex_size, vertex_size * 2, vertex_size * 2);
        }
    }
}
