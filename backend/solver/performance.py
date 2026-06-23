from typing import Dict, Any
from solver.sudoku_board import SudokuBoard
from solver.dfs_solver import DFSSudokuSolver
from solver.bfs_solver import BFSSudokuSolver

def compare_solvers(grid: list[list[int]]) -> Dict[str, Any]:
    """
    Solves the same Sudoku grid using both DFS and BFS,
    and returns a summary of their metrics for comparison.
    """
    # 1. DFS Solver
    dfs_board = SudokuBoard(grid)
    dfs_solver = DFSSudokuSolver(dfs_board)
    dfs_metrics = dfs_solver.execute_solver()

    # 2. BFS Solver
    bfs_board = SudokuBoard(grid)
    bfs_solver = BFSSudokuSolver(bfs_board)
    bfs_metrics = bfs_solver.execute_solver()

    return {
        "dfs": {
            "success": dfs_metrics["success"],
            "runtime": dfs_metrics["runtime"],
            "states": dfs_metrics["states"],
            "backtracks": dfs_metrics["backtracks"],
            "max_depth": dfs_metrics.get("max_depth", 0),
            "solved_grid": dfs_metrics["solved_grid"]
        },
        "bfs": {
            "success": bfs_metrics["success"],
            "runtime": bfs_metrics["runtime"],
            "states": bfs_metrics["states"],
            "backtracks": bfs_metrics["backtracks"],
            "max_queue_size": bfs_metrics.get("max_queue_size", 0),
            "limit_exceeded": bfs_metrics.get("limit_exceeded", False),
            "solved_grid": bfs_metrics["solved_grid"]
        }
    }
