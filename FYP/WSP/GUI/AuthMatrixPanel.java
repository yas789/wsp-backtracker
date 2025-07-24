package WSP.GUI;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class AuthMatrixPanel extends JPanel {

    /* ---------- model ---------- */
    private int[][] authMatrix;          // 1 = authorised, 0 = unauthorised
    private int      numUsers;
    private int      numSteps;


    private JComboBox<String> userDropdown;
    private JComboBox<String> stepDropdown;
    private JComboBox<String> authDropdown;
    private JButton           updateButton;
    private JTextArea         outputArea;


    public AuthMatrixPanel(int users, int steps) {
        this.numUsers  = users;
        this.numSteps  = steps;
        this.authMatrix = new int[users][steps];   // defaults 0

        setLayout(new BorderLayout(10,10));


        JPanel inputPanel = new JPanel(new FlowLayout(FlowLayout.LEFT,10,10));

        userDropdown = new JComboBox<>();
        userDropdown.addItem("All Users");
        for (int i = 0; i < users; i++) userDropdown.addItem("User " + (i + 1));

        stepDropdown = new JComboBox<>();
        stepDropdown.addItem("All Steps");
        for (int s = 0; s < steps; s++) stepDropdown.addItem("Step " + (s + 1));

        authDropdown = new JComboBox<>(new String[]{"Authorized","Unauthorized"});


        updateButton = new JButton("Update Authorization");
        updateButton.addActionListener(e -> {
            String selUser  = (String) userDropdown.getSelectedItem();
            String selStep  = (String) stepDropdown.getSelectedItem();
            int    val      = authDropdown.getSelectedItem().equals("Authorized") ? 1 : 0;


            if ("All Users".equals(selUser) && "All Steps".equals(selStep)) {

                for (int i = 0; i < authMatrix.length; i++)            // live row count
                    for (int j = 0; j < authMatrix[i].length; j++)     // live col count
                        authMatrix[i][j] = val;

                outputArea.append("Updated entire matrix to "
                                  + authDropdown.getSelectedItem() + ".\n");
            }

            else if ("All Users".equals(selUser)) {
                int stepIdx = Integer.parseInt(selStep.split(" ")[1]) - 1;
                for (int i = 0; i < authMatrix.length; i++)
                    authMatrix[i][stepIdx] = val;

                outputArea.append("Updated all users for " + selStep
                                  + " to " + authDropdown.getSelectedItem() + ".\n");
            }

            else if ("All Steps".equals(selStep)) {
                int userIdx = Integer.parseInt(selUser.split(" ")[1]) - 1;
                for (int j = 0; j < authMatrix[userIdx].length; j++)
                    authMatrix[userIdx][j] = val;

                outputArea.append("Updated " + selUser + " for all steps to "
                                  + authDropdown.getSelectedItem() + ".\n");
            }

            else {
                int userIdx = Integer.parseInt(selUser.split(" ")[1]) - 1;
                int stepIdx = Integer.parseInt(selStep.split(" ")[1]) - 1;
                authMatrix[userIdx][stepIdx] = val;
                outputArea.append("Updated " + selUser + " for " + selStep
                                  + " to " + authDropdown.getSelectedItem() + ".\n");
            }

            outputArea.append("Current Matrix:\n" + matrixToString() + "\n");
        });

        /* assemble top row */
        inputPanel.add(new JLabel("User:"));          inputPanel.add(userDropdown);
        inputPanel.add(new JLabel("Step:"));          inputPanel.add(stepDropdown);
        inputPanel.add(new JLabel("Authorization:")); inputPanel.add(authDropdown);
        inputPanel.add(updateButton);
        add(inputPanel, BorderLayout.NORTH);

        /* log area --------------------------------------------------- */
        outputArea = new JTextArea(10,50);
        outputArea.setEditable(false);
        JScrollPane sc = new JScrollPane(outputArea);
        sc.setBorder(BorderFactory.createTitledBorder("Authorization Log"));
        add(sc, BorderLayout.CENTER);
    }


    public void updateMatrixSize(int users, int steps) {
        this.numUsers = users;
        this.numSteps = steps;
        authMatrix = new int[users][steps];         


        userDropdown.removeAllItems();
        userDropdown.addItem("All Users");
        for (int i = 0; i < users; i++) userDropdown.addItem("User " + (i + 1));

        stepDropdown.removeAllItems();
        stepDropdown.addItem("All Steps");
        for (int s = 0; s < steps; s++) stepDropdown.addItem("Step " + (s + 1));

        outputArea.append("Resized matrix to " + users + " × " + steps + ".\n");
        revalidate(); repaint();
    }

    public int[][] getAuthorizationMatrix() { return authMatrix; }


    private String matrixToString() {
        StringBuilder sb = new StringBuilder();
        for (int[] row : authMatrix) {
            for (int v : row) sb.append(v).append(' ');
            sb.append('\n');
        }
        return sb.toString();
    }
}
