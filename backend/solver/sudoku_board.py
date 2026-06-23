class SudokuBoard:
    """
    Represents a 9x9 Sudoku Board.
    Handles cell updates, validity checks (row, column, 3x3 subgrid),
    and formatting of the board.
    """
    def __init__(self, grid=None):
        if grid is None:
            self.grid = [[0 for _ in range(9)] for _ in range(9)]
        else:
            # Create a deep copy of the grid
            self.grid = [list(row) for row in grid]

    def set_cell(self, row: int, col: int, val: int):
        """Sets the value of a specific cell on the board."""
        if 0 <= row < 9 and 0 <= col < 9 and 0 <= val <= 9:
            self.grid[row][col] = val
        else:
            raise ValueError(f"Invalid position ({row}, {col}) or value {val}")

    def is_valid(self, row: int, col: int, val: int) -> bool:
        """
        Checks if placing the value `val` at (row, col) is valid
        under standard Sudoku rules.
        """
        if val == 0:
            return True

        # Check row conflict
        for j in range(9):
            if j != col and self.grid[row][j] == val:
                return False

        # Check column conflict
        for i in range(9):
            if i != row and self.grid[i][col] == val:
                return False

        # Check 3x3 box conflict
        box_row = (row // 3) * 3
        box_col = (col // 3) * 3
        for i in range(box_row, box_row + 3):
            for j in range(box_col, box_col + 3):
                if (i != row or j != col) and self.grid[i][j] == val:
                    return False

        return True

    def display_board(self) -> str:
        """Returns a string representation of the board."""
        lines = []
        for i in range(9):
            if i % 3 == 0 and i != 0:
                lines.append("-" * 21)
            row_parts = []
            for j in range(9):
                if j % 3 == 0 and j != 0:
                    row_parts.append("|")
                row_parts.append(str(self.grid[i][j]))
            lines.append(" ".join(row_parts))
        board_str = "\n".join(lines)
        print(board_str)
        return board_str
