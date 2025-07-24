package WSP.VertexCover;
import javax.swing.*;

import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.util.ArrayList;
import java.util.List;

/**
 * This class creates a GUI frame with:
 * - A drawing area (GraphInterface) to create a graph by adding vertices and edges.
 * - Input field and button to run the Vertex Cover algorithm.
 * - Output label to show results.
 * - Clear button to reset the drawing.
 */
public class VertexCoverUi extends JFrame {

    private GraphInterface canvas;
    private JLabel outputLabel;

    public VertexCoverUi() {
        setTitle("Interactive Graph Builder");
        setSize(800, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        canvas = new GraphInterface(); // the canvas for drawing the graph

        // add buttons
        JTextField input = new JTextField(5); // Input field for k
        JButton runButton = new JButton("Run Vertex Cover");
        outputLabel = new JLabel("Results will be displayed here.");
        JButton clearButton = new JButton("Clear");

        // add action listener for clear button
        clearButton.addActionListener(e -> {
            canvas.clear(); // clear the canvas
            outputLabel.setText("Results will be displayed here."); // reset the output
        });

        runButton.addActionListener(e -> {
            try {
                // parse k from input field
                int k = Integer.parseInt(input.getText());
                if (k < 0) {
                    outputLabel.setText("k must be a non-negative integer.");
                    return;
                }

                // convert the graph from GraphInterface to Graph
                Graph graph = canvas.toGraph();
                // run the Vertex Cover algorithm
                List<Integer> cover = VertexCover.backtrackingWithCover(k, graph);

                if (cover != null) {
                    outputLabel.setText("Yes");
                    canvas.highlightCover(cover); // Highlight the found vertex cover
                } else {
                    outputLabel.setText("Not satisfiable");
                    canvas.highlightCover(new ArrayList<>()); // no highlight
                }

            } catch (NumberFormatException ex) {
                outputLabel.setText("Invalid input. Please enter a valid integer for k.");
            }
        });

        // add canvas and buttons to the frame
        JPanel controlPanel = new JPanel();
        controlPanel.setLayout(new GridLayout(2, 1));

        JPanel inputPanel = new JPanel();
        inputPanel.add(new JLabel("Enter k:"));
        inputPanel.add(input);
        inputPanel.add(runButton);

        controlPanel.add(inputPanel);
        controlPanel.add(outputLabel);

        setLayout(new BorderLayout());
        add(canvas, BorderLayout.CENTER);

        controlPanel.add(clearButton);
        add(controlPanel, BorderLayout.SOUTH);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            VertexCoverUi frame = new VertexCoverUi();
            frame.setVisible(true);
        });
    }
}