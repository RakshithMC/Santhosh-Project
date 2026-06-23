from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class GridModel(BaseModel):
    grid: List[List[int]] = Field(..., min_items=9, max_items=9)

class SolveRequest(BaseModel):
    grid: List[List[int]] = Field(..., min_items=9, max_items=9)

class SolveResponse(BaseModel):
    success: bool
    runtime: float
    states: int
    backtracks: int
    solved_grid: Optional[List[List[int]]] = None
    exploration_steps: List[Dict[str, Any]]

class SamplePuzzle(BaseModel):
    name: str
    difficulty: str
    grid: List[List[int]]

class SampleResponse(BaseModel):
    puzzles: List[SamplePuzzle]

class HealthResponse(BaseModel):
    status: str
