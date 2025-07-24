package WSP.GUI;

import javax.swing.*;

import WSP.VertexCover.ConstraintGraph;

import java.awt.*;
import java.awt.event.*;

public class ConstraintInputPanel extends JPanel {

    /* ---------- MODEL ---------- */
    private ConstraintGraph graph;      // current graph
    private int numSteps;               // current step count

    /* ---------- VIEW COMPONENTS ---------- */
    private JComboBox<String> step1Dropdown;
    private JComboBox<String> step2Dropdown;
    private JComboBox<String> operatorDropdown;
    private JButton           addConstraintButton;
    private JTextArea         outputArea;

    /* ---------- CONSTRUCTOR ---------- */
    public ConstraintInputPanel(ConstraintGraph graph, int numSteps) {
        this.graph    = graph;
        this.numSteps = numSteps;

        setLayout(new BorderLayout(10, 10));

        /* top row with controls */
        JPanel inputPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 10));

        step1Dropdown = new JComboBox<>();
        step2Dropdown = new JComboBox<>();
        populateStepDropdowns(numSteps);

        operatorDropdown = new JComboBox<>(new String[] { "=", "≠" });

        addConstraintButton = new JButton("Add Constraint");
        addConstraintButton.addActionListener(e -> addConstraint());

        inputPanel.add(new JLabel("Step 1:"));
        inputPanel.add(step1Dropdown);
        inputPanel.add(new JLabel("Operator:"));
        inputPanel.add(operatorDropdown);
        inputPanel.add(new JLabel("Step 2:"));
        inputPanel.add(step2Dropdown);
        inputPanel.add(addConstraintButton);

        add(inputPanel, BorderLayout.NORTH);

        /* output area */
        outputArea = new JTextArea(8, 40);
        outputArea.setEditable(false);
        JScrollPane scroll = new JScrollPane(outputArea);
        scroll.setBorder(BorderFactory.createTitledBorder("Constraints Entered"));
        add(scroll, BorderLayout.CENTER);
    }

    /* ---------- PUBLIC API ---------- */

    /** Called by Panel 1 when the user changes the number of steps.
     *  Only repopulates the two step dropdowns. */
    public void updateStepOptions(int newNumSteps) {
        this.numSteps = newNumSteps;
        populateStepDropdowns(newNumSteps);
    }

    /** Called by Panel 1 after it builds a *new* ConstraintGraph
     *  so this panel works with the correct‑sized graph. */
    public void setGraph(ConstraintGraph newGraph) {
        this.graph = newGraph;
        outputArea.setText("");          // optional – clear old log
    }
    // inside ConstraintInputPanel, below setGraph(...)
    public ConstraintGraph getGraph() {
    return graph;
    }


    /* ---------- PRIVATE HELPERS ---------- */

    private void populateStepDropdowns(int steps) {
        step1Dropdown.removeAllItems();
        step2Dropdown.removeAllItems();
        for (int i = 0; i < steps; i++) {
            String label = "Step " + (i + 1);
            step1Dropdown.addItem(label);
            step2Dropdown.addItem(label);
        }
    }

    private void addConstraint() {
        int s1 = step1Dropdown.getSelectedIndex();
        int s2 = step2Dropdown.getSelectedIndex();
        if (s1 == s2) {
            JOptionPane.showMessageDialog(this, "Please select two different steps.");
            return;
        }
        String op  = (String) operatorDropdown.getSelectedItem();
        int type   = op.equals("=") ? ConstraintGraph.BLACK : ConstraintGraph.RED;

        graph.addConstraintEdge(s1, s2, type);

        outputArea.append("Step " + (s1 + 1) + " " + op + " Step " + (s2 + 1) + "\n");
    }

    /* ---------- stand‑alone test ---------- */
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            ConstraintInputPanel panel =
                new ConstraintInputPanel(new ConstraintGraph(4), 4);
            JFrame f = new JFrame("Constraint panel test");
            f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            f.add(panel);
            f.pack();
            f.setLocationRelativeTo(null);
            f.setVisible(true);
        });
    }
}
