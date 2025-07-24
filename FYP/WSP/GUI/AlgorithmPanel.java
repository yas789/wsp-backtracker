package WSP.GUI;

import javax.swing.*;

import WSP.WSPCSPEncoder;
import WSP.WSPSATEncoder;
import WSP.WSPUtils;
import WSP.Backtracking.WSPBacktracking;
import WSP.PBT.WSPOrchestrator;
import WSP.VertexCover.ConstraintGraph;

import java.awt.*;
import java.awt.event.*;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.List;
import java.util.function.BiConsumer;

public class AlgorithmPanel extends JPanel {
    private final PanelOne            configPanel;
    private final ConstraintInputPanel constraintPanel;
    private final AuthMatrixPanel     authMatrixPanel;


    private final JTextArea resultArea;

    public AlgorithmPanel(PanelOne config,
                          ConstraintInputPanel cPanel,
                          AuthMatrixPanel aPanel) {
        this.configPanel     = config;
        this.constraintPanel = cPanel;
        this.authMatrixPanel = aPanel;

        setLayout(new BorderLayout(10,10));

        // ----- Top row: the three buttons -----
        JPanel buttonRow = new JPanel(new FlowLayout(FlowLayout.CENTER, 20, 10));
        JButton cpSatBtn     = new JButton("CSP-encoder");
        JButton pbtBtn       = new JButton("WSP PBT");
        JButton backtrackBtn = new JButton("Backtracking");
        JButton cpCSPBtn = new JButton("SAT-encoder");
        

        pbtBtn.addActionListener(e -> runPBT());
        backtrackBtn.addActionListener(e -> runBacktracking());
        cpSatBtn.addActionListener(e -> runCPSAT());
        cpCSPBtn.addActionListener(e -> runSatEncoder());


        buttonRow.add(cpSatBtn);
        buttonRow.add(pbtBtn);
        buttonRow.add(backtrackBtn);
        buttonRow.add(cpCSPBtn);
        add(buttonRow, BorderLayout.NORTH);


        resultArea = new JTextArea(15, 60);
        resultArea.setEditable(false);
        JScrollPane scroll = new JScrollPane(resultArea);
        scroll.setBorder(BorderFactory.createTitledBorder("Orchestrator Output"));
        add(scroll, BorderLayout.CENTER);
    }
    private void runCPSAT() {
        // 1) collect inputs
        int numUsers = configPanel.getNumUsers();
        int numSteps = configPanel.getNumSteps();
        int[][] userByStep = authMatrixPanel.getAuthorizationMatrix();
        ConstraintGraph graph = constraintPanel.getGraph();

        int[][] stepByUser = WSPUtils.transpose(authMatrixPanel.getAuthorizationMatrix());



        WSPCSPEncoder encoder = new WSPCSPEncoder(numSteps, numUsers, stepByUser);

        WSPUtils.applyGraphConstraints(
            encoder,
            encoder::addMustSameConstraint,
            encoder::addMustDifferentConstraint,
            constraintPanel.getGraph(),
            configPanel.getNumSteps()
        );
        // 5) redirect System.out to capture encoder’s printSolution
        PrintStream oldOut = System.out;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        System.setOut(new PrintStream(buf));
        resultArea.setText(""); // clear old

        // 6) solve & print
        int[] solution = encoder.solveCSP();
        encoder.printSolution(solution);

        // 7) restore & display
        System.out.flush();
        System.setOut(oldOut);
        resultArea.setText(buf.toString());
    }

    private void runPBT() {

        int numUsers = configPanel.getNumUsers();
        int numSteps = configPanel.getNumSteps();
        int[][] userByStep = authMatrixPanel.getAuthorizationMatrix();
        ConstraintGraph graph = constraintPanel.getGraph();

        int[][] stepByUser = WSPUtils.transpose(authMatrixPanel.getAuthorizationMatrix());


        PrintStream oldOut = System.out;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        System.setOut(new PrintStream(buf));

        // 4) Run the orchestrator
        WSPOrchestrator orchestrator =
            new WSPOrchestrator(graph, stepByUser, numSteps, numUsers);
        orchestrator.solve();

        System.out.flush();
        System.setOut(oldOut);
        resultArea.setText(buf.toString());
    }
    private void runBacktracking() {
        // 1) gather inputs
        int numUsers = configPanel.getNumUsers();
        int numSteps = configPanel.getNumSteps();
        ConstraintGraph graph = constraintPanel.getGraph();

        int[][] stepByUser = WSPUtils.transpose(authMatrixPanel.getAuthorizationMatrix());


        // 3) redirect System.out
        PrintStream oldOut = System.out;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        System.setOut(new PrintStream(buf));
        resultArea.setText("");   // clear previous text

        WSPBacktracking wsp = new WSPBacktracking(graph, numUsers, numSteps, stepByUser);


        wsp.runBacktracking();
        System.out.println(wsp); 
        System.out.flush();
        System.setOut(oldOut);
        resultArea.setText(buf.toString());
    }
    private void runSatEncoder() {
        // 1) Gather inputs
        int numUsers = configPanel.getNumUsers();
        int numSteps = configPanel.getNumSteps();
        int[][] userByStep = authMatrixPanel.getAuthorizationMatrix();
        ConstraintGraph graph = constraintPanel.getGraph();

        int[][] stepByUser = WSPUtils.transpose(authMatrixPanel.getAuthorizationMatrix());


        // 3) Instantiate the encoder
        WSPSATEncoder encoder = new WSPSATEncoder(numSteps, numUsers, stepByUser);

        WSPUtils.applyGraphConstraints(
            encoder,
            encoder::addMustSameConstraint,
            encoder::addMustDifferentConstraint,
            constraintPanel.getGraph(),
            configPanel.getNumSteps()
        );

        // 5) Capture System.out and run encodeAndSolve + printSolution
        PrintStream oldOut = System.out;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        System.setOut(new PrintStream(buf));
        resultArea.setText("");  // clear previous output

        int[] solution = encoder.encodeAndSolve();
        encoder.printSolution(solution);

        // 6) Restore and display
        System.out.flush();
        System.setOut(oldOut);
        resultArea.setText(buf.toString());
    }

}
