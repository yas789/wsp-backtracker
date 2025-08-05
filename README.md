# WSP Solver: Workflow Satisfiability & Constraint Manager

[![Java](https://img.shields.io/badge/Java-11%2B-blue)](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A comprehensive solution for the Workflow Satisfiability Problem (WSP) featuring both a Fixed-Parameter Tractable (FPT) backtracking algorithm and a SAT/CSP encoding using Google OR-Tools. The application includes an intuitive web-based interface for configuring and solving workflow authorization problems.

## 🌟 Features

- **Dual Solving Approaches**
  - FPT Backtracking Algorithm (PBT)
  - SAT/CSP Encoding with Google OR-Tools
  
- **Interactive Web Interface**
  - Step-by-step workflow configuration
  - Visual authorization matrix editor
  - Constraint management
  - Real-time solution visualization

- **Performance Optimized**
  - O*(2ᵏlog(k)) time complexity for k steps
  - Efficient pruning strategies
  - Native library optimization

## 🚀 Quick Start

### Prerequisites
- **Java 11 or later** ([Download](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html))
- **Node.js 14+** (for frontend development, [Download](https://nodejs.org/))

### Running the Application

1. **Make the run script executable** (first time only):
   ```bash
   chmod +x run.sh
   ```

2. **Start the application**:
   ```bash
   ./run.sh
   ```
   This will:
   - Compile the Java backend
   - Install frontend dependencies
   - Start the development server
   - Open the application in your default browser

## 🏗️ Project Structure

```
wsp-backtracker/
├── frontend/           # React-based web interface
│   ├── public/         # Static files
│   └── src/            # React components and logic
│       ├── pages/      # Application pages
│       ├── components/ # Reusable UI components
│       └── context/    # Application state management
│
├── src/
│   └── main/java/com/fyp/wspapi/
│       ├── controller/ # REST API endpoints
│       ├── model/      # Data models
│       ├── service/    # Business logic
│       └── solver/     # WSP solving algorithms
│
└── run.sh             # Build and run script
```

## 🔧 Configuration

### Backend Configuration
Edit `src/main/resources/application.properties` to configure:
- Server port (default: 8080)
- Logging levels
- Solver parameters

### Frontend Configuration
Edit `frontend/.env` to configure:
- API base URL
- Feature flags
- UI settings

## 🧩 Solving the Workflow Satisfiability Problem

### Problem Definition
Assign each workflow step to exactly one authorized user while respecting:
- **Must-same** constraints: Two steps must be assigned to the same user
- **Must-different** constraints: Two steps must be assigned to different users

### Algorithms

#### 1. PBT (Parameter-Backtracking) Algorithm
- Recursive FPT algorithm parameterized by the number of steps (k)
- Heavy pruning for practical performance
- Time complexity: O*(2ᵏ)

#### 2. SAT/CSP Encoding
- Translates WSP instances into CP-SAT models
- Uses Google OR-Tools for solving
- Supports complex constraints and optimizations

## 🖥️ User Guide

### 1. Configuration
- Set the number of users and steps
- Click "Update" to apply changes

### 2. Authorization Matrix
- Define which users are authorized for which steps
- Use bulk actions for quick updates
- Visual feedback for current authorizations

### 3. Step Constraints
- Add equality (=) or inequality (≠) constraints between steps
- Visual graph of constraints
- Real-time validation

### 4. Solve
- Choose between PBT or SAT/CSP solver
- View solution details and statistics
- Export results if needed

## 🐛 Troubleshooting

### Common Issues
1. **Port already in use**
   - Check for other Java processes: `jps -l`
   - Kill the process: `kill <PID>`
   - Or change the server port in `application.properties`

2. **Java version issues**
   - Verify Java version: `java -version`
   - Ensure JAVA_HOME is set correctly

3. **Frontend build errors**
   - Clear node modules: `cd frontend && rm -rf node_modules`
   - Reinstall dependencies: `npm install`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 📧 Contact

For questions or feedback, please open an issue on GitHub.

## 📝 Credits

- **Yassir Maknaoui** - [GitHub](https://github.com/yassirmaknaoui)