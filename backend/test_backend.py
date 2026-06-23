from solver.sudoku_board import SudokuBoard
from solver.dfs_solver import DFSSudokuSolver
from solver.bfs_solver import BFSSudokuSolver

def test():
    grid = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]

    print("--- Testing DFS Solver ---")
    board = SudokuBoard(grid)
    solver = DFSSudokuSolver(board)
    res = solver.execute_solver()
    print("DFS Solved successfully?", res["success"])
    print("DFS States explored:", res["states"])
    print("DFS Backtracks:", res["backtracks"])
    print("DFS Runtime (sec):", res["runtime"])

    print("\n--- Testing BFS Solver (Simple case) ---")
    # A grid with only 1 empty cell to keep BFS fast
    bfs_grid = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 0]
    ]
    board2 = SudokuBoard(bfs_grid)
    bfs_solver = BFSSudokuSolver(board2)
    res2 = bfs_solver.execute_solver()
    print("BFS Solved successfully?", res2["success"])
    print("BFS States explored:", res2["states"])
    print("BFS Backtracks:", res2["backtracks"])

if __name__ == "__main__":
    test()
