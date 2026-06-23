import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import sudoku

app = FastAPI(
    title="Interactive Sudoku Puzzle Solver",
    description="Backend solving engine for Sudoku DFS/BFS visualizations",
    version="1.0.0"
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include Sudoku Router
app.include_router(sudoku.router)

@app.get("/health", tags=["health"])
async def health_check():
    """Returns the API health status."""
    return {"status": "running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
