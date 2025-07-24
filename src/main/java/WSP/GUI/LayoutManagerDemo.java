package WSP.GUI;

import javax.swing.*;

import com.google.ortools.Loader;

import WSP.VertexCover.ConstraintGraph;

import java.awt.*;
import java.awt.event.*;

public class LayoutManagerDemo extends JFrame {

    private CardLayout cardLayout;
    private JPanel cardPanel;
    private JButton backButton, nextButton;
    // ← 1) add the fourth identifier
    private String[] panelNames = {
        "PanelOne",
        "AuthMatrixPanel",
        "ConstraintPanel",
        "AlgorithmPanel"      // ← new
    };
    private int currentIndex = 0;


    public LayoutManagerDemo() {
        setTitle("WSP Configuration and Constraint Manager");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(800, 600); // maybe a bit larger for the algorithm buttons
        setLocationRelativeTo(null);

        cardLayout = new CardLayout();
        cardPanel = new JPanel(cardLayout);

        // Default parameters.
        int defaultSteps = 4;
        int defaultUsers = 4;

        // Instantiate the shared model.
        ConstraintGraph graph = new ConstraintGraph(defaultSteps);

        // Create Panel 3: ConstraintInputPanel.
        ConstraintInputPanel constraintPanel = 
            new ConstraintInputPanel(graph, defaultSteps);

        // Create Panel 2: Authorization Matrix Panel.
        AuthMatrixPanel authMatrixPanel = 
            new AuthMatrixPanel(defaultUsers, defaultSteps);

        // Create Panel 1: Configuration panel.
        PanelOne panelOne = 
            new PanelOne(constraintPanel, authMatrixPanel);

        // ← 2) create the new AlgorithmPanel, passing in the three
        AlgorithmPanel algorithmPanel = 
            new AlgorithmPanel(panelOne, constraintPanel, authMatrixPanel);

        // Add panels to the card container.
        cardPanel.add(panelOne,           panelNames[0]);
        cardPanel.add(authMatrixPanel,    panelNames[1]);
        cardPanel.add(constraintPanel,    panelNames[2]);
        cardPanel.add(algorithmPanel,     panelNames[3]); // ← new

        add(cardPanel, BorderLayout.CENTER);

        // Navigation panel with Back and Next buttons.
        JPanel navigationPanel = 
            new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 10));
        backButton = new JButton("Back");
        nextButton = new JButton("Next");

        backButton.setEnabled(false); // Disable Back on the first panel.

        backButton.addActionListener(e -> {
            if (currentIndex > 0) {
                currentIndex--;
                cardLayout.show(cardPanel, panelNames[currentIndex]);
            }
            updateButtonStates();
        });

        nextButton.addActionListener(e -> {
            if (currentIndex < panelNames.length - 1) {
                currentIndex++;
                cardLayout.show(cardPanel, panelNames[currentIndex]);
            }
            updateButtonStates();
        });

        navigationPanel.add(backButton);
        navigationPanel.add(nextButton);
        add(navigationPanel, BorderLayout.SOUTH);
    }

    private void updateButtonStates() {
        backButton.setEnabled(currentIndex > 0);
        nextButton.setEnabled(currentIndex < panelNames.length - 1);
    }

    public static void main(String[] args) {
        Loader.loadNativeLibraries();
        SwingUtilities.invokeLater(() -> {
            new LayoutManagerDemo().setVisible(true);
        });

    }
}
