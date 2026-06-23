from fastapi import APIRouter, HTTPException
from models.schema import SolveRequest, SolveResponse, SampleResponse, SamplePuzzle, GridModel
from solver.sudoku_board import SudokuBoard
from solver.dfs_solver import DFSSudokuSolver
from typing import Dict, Any

router = APIRouter(prefix="/api/sudoku", tags=["sudoku"])

# Predefined puzzles of various difficulties
SAMPLES = [
    {
        "name": "Standard Easy",
        "difficulty": "Easy",
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
        ]
    },
    {
        "name": "Standard Medium",
        "difficulty": "Medium",
        "grid": [
            [0, 0, 0, 2, 6, 0, 7, 0, 1],
            [6, 8, 0, 0, 7, 0, 0, 9, 0],
            [1, 9, 0, 0, 0, 4, 5, 0, 0],
            [8, 2, 0, 1, 0, 0, 0, 4, 0],
            [0, 0, 4, 6, 0, 2, 9, 0, 0],
            [0, 5, 0, 0, 0, 3, 0, 2, 8],
            [0, 0, 9, 3, 0, 0, 0, 7, 4],
            [0, 4, 0, 0, 5, 0, 0, 3, 6],
            [7, 0, 3, 0, 1, 8, 0, 0, 0]
        ]
    },
    {
        "name": "Standard Hard",
        "difficulty": "Hard",
        "grid": [
            [0, 2, 0, 6, 0, 8, 0, 0, 0],
            [5, 8, 0, 0, 0, 9, 7, 0, 0],
            [0, 0, 0, 0, 4, 0, 0, 0, 0],
            [3, 7, 0, 0, 0, 5, 0, 0, 8],
            [6, 0, 0, 0, 0, 0, 0, 0, 4],
            [9, 0, 0, 8, 0, 0, 0, 5, 3],
            [0, 0, 0, 0, 3, 0, 0, 0, 0],
            [0, 0, 3, 4, 0, 0, 0, 1, 9],
            [0, 0, 0, 9, 0, 7, 0, 8, 0]
        ]
    }
]

@router.get("/sample", response_model=SampleResponse)
def get_sample():
    """Returns sample boards of different difficulty levels."""
    return {"puzzles": SAMPLES}

@router.post("/solve", response_model=SolveResponse)
def solve_puzzle(req: SolveRequest):
    """
    Validates the Sudoku grid and runs the Depth-First Search solver
    returning solved states and telemetry metrics.
    """
    grid = req.grid

    if len(grid) != 9 or any(len(row) != 9 for row in grid):
        raise HTTPException(status_code=400, detail="Grid must be a 9x9 matrix")

    # Validate that grid does not have conflict numbers in starting configuration
    temp_board = SudokuBoard(grid)
    for i in range(9):
        for j in range(9):
            val = grid[i][j]
            if val != 0:
                temp_board.grid[i][j] = 0
                if not temp_board.is_valid(i, j, val):
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Initial grid is invalid: conflict at row {i+1}, column {j+1} for value {val}"
                    )
                temp_board.grid[i][j] = val

    try:
        board = SudokuBoard(grid)
        solver = DFSSudokuSolver(board)
        result = solver.execute_solver()

        return SolveResponse(
            success=result["success"],
            runtime=result["runtime"],
            states=result["states"],
            backtracks=result["backtracks"],
            solved_grid=result["solved_grid"],
            exploration_steps=result["exploration_steps"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Solver error: {str(e)}")
