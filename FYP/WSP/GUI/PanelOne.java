package WSP.GUI;
import javax.swing.*;

import WSP.VertexCover.ConstraintGraph;

import java.awt.*;
import java.awt.event.*;

public class PanelOne extends JPanel {

    private JTextField numUsersField;
    private JTextField numStepsField;
    private JButton updateButton;
    
    // References to the panels to be updated.
    private ConstraintInputPanel constraintPanel;
    private AuthMatrixPanel authMatrixPanel;



    // Constructor receives references to both Panel 3 (constraints) and Panel 2 (auth matrix).
    public PanelOne(ConstraintInputPanel constraintPanel, AuthMatrixPanel authMatrixPanel) {
        this.constraintPanel = constraintPanel;
        this.authMatrixPanel = authMatrixPanel;
        setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);

        JLabel usersLabel = new JLabel("Number of Users:");
        numUsersField = new JTextField(10);
        JLabel stepsLabel = new JLabel("Number of Steps:");
        numStepsField = new JTextField(10);
        updateButton = new JButton("Update");

        // Layout the components.
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        add(usersLabel, gbc);
        
        gbc.gridx = 1;
        add(numUsersField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        add(stepsLabel, gbc);
        
        gbc.gridx = 1;
        add(numStepsField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        add(updateButton, gbc);

        // Update button action: parse and propagate the new dimensions.
        updateButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                try {
                    int numUsers = Integer.parseInt(numUsersField.getText().trim());
                    int numSteps = Integer.parseInt(numStepsField.getText().trim());
                    // Update constraint panel's dropdowns based on new number of steps.
                    ConstraintGraph newGraph = new ConstraintGraph(numSteps);

                    constraintPanel.setGraph(newGraph);    
                    authMatrixPanel.updateMatrixSize(numUsers, numSteps);

                    constraintPanel.updateStepOptions(numSteps);
                    // Update auth matrix panel with new numbers.
                    JOptionPane.showMessageDialog(PanelOne.this, 
                        "Updated with " + numUsers + " Users and " + numSteps + " Steps.");
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(PanelOne.this, 
                        "Please enter valid numeric values for both fields.");
                }
            }
        });


    }
    // after the constructor, in PanelOne:
public int getNumUsers() {
    return Integer.parseInt(numUsersField.getText().trim());
}
public int getNumSteps() {
    return Integer.parseInt(numStepsField.getText().trim());
}

}
