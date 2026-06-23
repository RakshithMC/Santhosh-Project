import time
from typing import Dict, Any, List, Optional
from solver.sudoku_board import SudokuBoard

class DFSSudokuSolver:
    """
    Depth-First Search (DFS) solver for Sudoku puzzles.
    Tracks statistics and records step-by-step state changes for visualization.
    """
    def __init__(self, board: SudokuBoard):
        self.board = board
        self.states_explored = 0
        self.backtracks = 0
        self.max_depth = 0
        self.visited_nodes = []  # Unique coordinates (r, c) visited
        self.exploration_steps = []  # List of steps for frontend animation
        self.start_time = 0.0
        self.end_time = 0.0

    def find_empty(self) -> Optional[tuple[int, int]]:
        """Finds the next empty cell (value == 0) in row-major order."""
        for i in range(9):
            for j in range(9):
                if self.board.grid[i][j] == 0:
                    return i, j
        return None

    def solve(self, depth: int = 0) -> bool:
        """Recursive DFS backtracking solver function."""
        self.states_explored += 1
        self.max_depth = max(self.max_depth, depth)

        # Find next empty cell
        empty = self.find_empty()
        if not empty:
            # Solved!
            return True

        row, col = empty

        # Track visited nodes
        cell_coord = (row, col)
        if cell_coord not in self.visited_nodes:
            self.visited_nodes.append(cell_coord)

        # Try placing numbers 1 through 9
        for val in range(1, 10):
            if self.board.is_valid(row, col, val):
                # Set cell value
                self.board.set_cell(row, col, val)
                
                # Record the placement step
                self.exploration_steps.append({
                    "row": row,
                    "col": col,
                    "val": val,
                    "type": "place",
                    "depth": depth
                })

                # Recursively solve
                if self.solve(depth + 1):
                    return True

                # If placement didn't lead to solution, backtrack
                self.board.set_cell(row, col, 0)
                self.backtracks += 1
                
                # Record the backtrack step
                self.exploration_steps.append({
                    "row": row,
                    "col": col,
                    "val": val,
                    "type": "backtrack",
                    "depth": depth
                })

        return False

    def execute_solver(self) -> Dict[str, Any]:
        """Runs the solver and returns performance statistics & exploration steps."""
        self.states_explored = 0
        self.backtracks = 0
        self.max_depth = 0
        self.visited_nodes = []
        self.exploration_steps = []

        self.start_time = time.perf_counter()
        success = self.solve()
        self.end_time = time.perf_counter()

        runtime = self.end_time - self.start_time

        return {
            "success": success,
            "runtime": runtime,
            "states": self.states_explored,
            "backtracks": self.backtracks,
            "max_depth": self.max_depth,
            "visited_count": len(self.visited_nodes),
            "solved_grid": self.board.grid if success else None,
            "exploration_steps": self.exploration_steps
        }
