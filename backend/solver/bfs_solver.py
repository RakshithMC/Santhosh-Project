import time
from collections import deque
from typing import Dict, Any, List, Optional
from solver.sudoku_board import SudokuBoard

class BFSSudokuSolver:
    """
    Breadth-First Search (BFS) solver for Sudoku puzzles.
    Explores board configurations level-by-level. Enforces a state-limit
    to prevent memory and CPU exhaustion due to high branching factors.
    """
    def __init__(self, board: SudokuBoard, max_states: int = 5000):
        self.initial_board = board
        self.max_states = max_states
        self.states_explored = 0
        self.backtracks = 0  # In BFS, we count dead-ends (states with no valid branches) as backtracks
        self.max_queue_size = 0
        self.exploration_steps = []
        self.start_time = 0.0
        self.end_time = 0.0

    def find_empty(self, grid: List[List[int]]) -> Optional[tuple[int, int]]:
        """Finds the next empty cell (value == 0) in row-major order."""
        for i in range(9):
            for j in range(9):
                if grid[i][j] == 0:
                    return i, j
        return None

    def is_valid_grid(self, grid: List[List[int]], row: int, col: int, val: int) -> bool:
        """Helper to check validity directly on an arbitrary 2D grid list."""
        if val == 0:
            return True

        # Check row
        for j in range(9):
            if j != col and grid[row][j] == val:
                return False

        # Check col
        for i in range(9):
            if i != row and grid[i][col] == val:
                return False

        # Check box
        box_row = (row // 3) * 3
        box_col = (col // 3) * 3
        for i in range(box_row, box_row + 3):
            for j in range(box_col, box_col + 3):
                if (i != row or j != col) and grid[i][j] == val:
                    return False

        return True

    def execute_solver(self) -> Dict[str, Any]:
        """Runs BFS solver with state limiting and performance tracking."""
        self.states_explored = 0
        self.backtracks = 0
        self.max_queue_size = 0
        self.exploration_steps = []

        self.start_time = time.perf_counter()

        # Queue elements are tuples of: (grid_state, last_row, last_col, last_val, depth)
        queue = deque()
        initial_grid = [list(row) for row in self.initial_board.grid]
        queue.append((initial_grid, -1, -1, 0, 0))
        self.max_queue_size = 1

        solved_grid = None
        success = False
        limit_exceeded = False

        while queue:
            self.max_queue_size = max(self.max_queue_size, len(queue))

            if self.states_explored >= self.max_states:
                limit_exceeded = True
                break

            grid, r, c, val, depth = queue.popleft()
            self.states_explored += 1

            if r != -1:
                # Log exploration step
                self.exploration_steps.append({
                    "row": r,
                    "col": c,
                    "val": val,
                    "type": "place",
                    "depth": depth
                })

            empty = self.find_empty(grid)
            if not empty:
                solved_grid = grid
                success = True
                break

            row, col = empty
            has_valid_branch = False

            # Add all valid child states to the queue
            for next_val in range(1, 10):
                if self.is_valid_grid(grid, row, col, next_val):
                    has_valid_branch = True
                    new_grid = [list(line) for line in grid]
                    new_grid[row][col] = next_val
                    queue.append((new_grid, row, col, next_val, depth + 1))

            if not has_valid_branch:
                self.backtracks += 1  # State was a dead-end
                if r != -1:
                    self.exploration_steps.append({
                        "row": r,
                        "col": c,
                        "val": val,
                        "type": "backtrack",
                        "depth": depth
                    })

        self.end_time = time.perf_counter()
        runtime = self.end_time - self.start_time

        return {
            "success": success,
            "runtime": runtime,
            "states": self.states_explored,
            "backtracks": self.backtracks,
            "max_queue_size": self.max_queue_size,
            "solved_grid": solved_grid,
            "exploration_steps": self.exploration_steps[:3000],  # Cap steps for visualization payload
            "limit_exceeded": limit_exceeded
        }
