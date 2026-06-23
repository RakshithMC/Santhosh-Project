# Interactive Pseudocode Puzzle Solver – Sudoku Solver using DFS

An interactive full-stack web application designed to solve Sudoku puzzles using Depth First Search (DFS) and Breadth First Search (BFS) search strategies. It features real-time visualization of recursion stacks, custom SVG branching trees, telemetry panels, performance charts, and direct side-by-side algorithm comparisons.

## 🚀 Features

- **Double Highlight Board Styling**: Displays lockable starting clues alongside interactive inputs with real-time row, column, and box conflict validation.
- **Recursive Backtracking Playback**: Pre-captures solver steps on the backend and displays them in the frontend using full play, pause, reset, step-forward, step-backward, and speed delay controls.
- **SVG Decision Tree Visualizer**: Dynamically renders the active recursion path (Search Stack) and color-codes branches 1–9 at the current cell to show active checks (blue), valid steps (green), and backtracks (red).
- **Telemetry Dashboard**: Uses Chart.js to graph evaluations, backtrack counts, execution runtimes, and success states for DFS vs BFS.
- **Report Exports**: Download solved boards as beautifully formatted PDFs or export complete solving logs as JSON.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Chart.js, Axios, jsPDF, Lucide Icons
- **Backend**: Python 3.8+, FastAPI, Uvicorn, Pydantic
- **API Protocol**: REST API with CORS headers enabling local cross-origin queries.

---

## 📂 Project Structure

```text
interactive-pseudocode-puzzle-solver/
│
├── backend/
│   ├── main.py                  # FastAPI Application Entrypoint
│   ├── solver/
│   │     ├── sudoku_board.py    # Sudoku Grid logic & conflicts
│   │     ├── dfs_solver.py      # DFS backtracking solver
│   │     ├── bfs_solver.py      # BFS state-queue solver
│   │     └── performance.py     # Side-by-side telemetry coordinator
│   ├── routes/
│   │     └── sudoku.py          # API route definitions
│   ├── models/
│   │     └── schema.py          # Pydantic schemas
│   ├── test_backend.py          # Local solver sanity runner
│   └── requirements.txt         # Backend Python packages
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │      ├── Home.jsx      # Landings page with interactive pseudocode
│   │   │      └── Dashboard.jsx # Main grid, stats, and visualization panels
│   │   ├── components/
│   │   │      ├── SudokuGrid.jsx# 9x9 editable board with keyboard controls
│   │   │      ├── SolverStats.jsx# Telemetry cards & ChartJS graphs
│   │   │      ├── DFSVisualizer.jsx# SVG decision trees & playback buttons
│   │   │      ├── Header.jsx    # Glass navigation & status checker
│   │   │      └── Footer.jsx    # Tech stack attribution footer
│   │   ├── services/
│   │   │      └── api.js        # Axios network services client
│   │   ├── App.jsx              # Routing & root wrapper
│   │   ├── App.css
│   │   ├── index.css            # Tailwinds base, fonts & custom glows
│   │   └── main.jsx             # React entrypoint
│   ├── tailwind.config.js       # Custom color tokens & layouts
│   ├── postcss.config.js
│   ├── index.html               # Main SEO header file
│   └── package.json
│
└── README.md
```

---

## 💻 Installation & Setup

### Prerequisites
- Python 3.8 or higher installed on your path.
- Node.js (v16.0 or higher) & npm installed.

### 🐍 Setting Up the Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Launch the local FastAPI dev server:
   ```bash
   python main.py
   ```
   The API server will run at `http://localhost:8000`. You can inspect the interactive OpenAPI documentation at `http://localhost:8000/docs`.

---

### ⚛️ Setting Up the Frontend

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install the node dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite local dev server:
   ```bash
   npm run dev
   ```
   The React client will open at `http://localhost:5173`. Open this URL in your web browser.

---

## 📡 API Documentation

### 1. Engine Health Check
- **Endpoint**: `GET /health`
- **Response**:
  ```json
  { "status": "running" }
  ```

### 2. Fetch Sample Puzzles
- **Endpoint**: `GET /api/sudoku/sample`
- **Response**:
  ```json
  {
    "puzzles": [
      {
        "name": "Standard Easy",
        "difficulty": "Easy",
        "grid": [[5, 3, 0, ...], ...]
      }
    ]
  }
  ```

### 3. Solve Board
- **Endpoint**: `POST /api/sudoku/solve`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "grid": [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ],
    "algorithm": "dfs"
  }
  ```
- **Response Body**:
  ```json
  {
    "success": true,
    "runtime": 0.0456,
    "states": 4209,
    "backtracks": 4157,
    "solved_grid": [[5, 3, 4, ...], ...],
    "exploration_steps": [
      { "row": 0, "col": 2, "val": 4, "type": "place", "depth": 0 },
      { "row": 0, "col": 3, "val": 6, "type": "place", "depth": 1 }
    ]
  }
  ```

### 4. Side-by-Side Comparison
- **Endpoint**: `POST /api/sudoku/compare`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  { "grid": [[5, 3, 0, ...], ...] }
  ```
- **Response Body**:
  ```json
  {
    "dfs": {
      "success": true,
      "runtime": 0.041,
      "states": 4209,
      "backtracks": 4157,
      "max_depth": 55,
      "solved_grid": [[...]]
    },
    "bfs": {
      "success": false,
      "runtime": 0.015,
      "states": 5000,
      "backtracks": 850,
      "max_queue_size": 2500,
      "limit_exceeded": true,
      "solved_grid": null
    }
  }
  ```

---

## 🔮 Future Improvements

- **Adaptive Depth Search (IDA\*)**: Add support for Iterative Deepening A\* or Branch-and-Bound algorithms for solving comparisons.
- **Custom Board Importers**: Enable loading puzzles via Optical Character Recognition (OCR) by dropping board images.
- **Cloud History Saving**: Connect user history to a local SQLite database or Postgres schema on Render to save records.
- **Custom Constraint Rules**: Expand puzzle variants to diagonal Sudoku, Sudoku X, or Killer Sudoku.
