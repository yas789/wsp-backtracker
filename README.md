# WSP Solver: Workflow Satisfiability & Constraint Manager
 
This repository focuses on solving the **Workflow Satisfiability Problem (WSP)** with both a Fixed‑Parameter Tractable (FPT) backtracking algorithm and a SAT/CSP encoding using Google OR‑Tools. 

---
## ⚙️ Prerequisites

1. **Java 11+**  
   Verify with:  
   ```bash
   java -version

## 🛠️ Manual Build & Run
**Technically, once you have Java 11+ installed, all you need to do is:**
- **Make the script executable (only once):**
chmod +x run.sh
-**Build & launch the application:**
./run.sh

## 📝 Project Overview

- **Workflow Satisfiability Problem (WSP)**  
  Assign each workflow step to exactly one authorized user while respecting pairwise constraints:
  - **Must‑same**: two steps must go to the same user  
  - **Must‑different**: two steps must go to different users  

- **PBT (Parameter‑Backtracking) Algorithm**  
  A recursive XP/FPT backtracking algorithm parameterized by the number of steps (k), with heavy pruning to achieve practical performance in **O*(2ᵏ)** time.

- **SAT/CSP Encoding**  
  Translate each WSP instance into a CP‑SAT model:
  - Boolean variables **x[s][u]** encode “user u is assigned to step s.”  
  - Clauses enforce “exactly one user per step,” authorization restrictions, and must‑same/must‑different constraints.  
  - Solved by **Google OR‑Tools CP‑SAT** engine.

- **Swing‑Based Wizard GUI**  
  A four‑page flow that guides the user through:
  1. **Configuration** (users & steps)  
  2. **Authorization Matrix** (who can do which steps)  
  3. **Step Constraints** (equality/inequality between steps)  
  4. **Algorithm Selection** (run PBT or SAT/CSP solver)

## 🖥️ GUI Walk‑through

### Page 1: Configuration
- **Number of Users:** enter an integer  
- **Number of Steps:** enter an integer  
- Click **Update** to resize downstream panels.

### Page 2: Authorization Matrix
- **User:** choose “All Users” or a specific user  
- **Step:** choose “All Steps” or a specific step  
- **Authorization:** select **Authorized** or **Unauthorized**  
- Click **Update Authorization**  
  - Bulk or individual updates are applied to the hidden N×M matrix  
  - The text log shows each change and prints the current matrix  

### Page 3: Step Constraints
- **Step 1:** select one step  
- **Operator:** choose **=** or **≠**  
- **Step 2:** select another step  
- Click **Add Constraint** to record it in the graph and log  

### Page 4: Run Algorithm
- **PBT Solver:** runs the FPT backtracking algorithm  
- **SAT/CSP Solver:** encodes the instance to CP‑SAT and invokes OR‑Tools  
- **Note:** on the first click of either button, loading OR‑Tools’ native libraries may take 1–2 seconds; subsequent runs are much faster.  
