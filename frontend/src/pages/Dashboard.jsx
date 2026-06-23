import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { solveSudoku } from '../services/api';
import SudokuGrid from '../components/SudokuGrid';

const DEFAULT_PUZZLE = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

export default function Dashboard() {
  const [grid, setGrid] = useState(DEFAULT_PUZZLE.map(row => [...row]));
  const [initialGrid, setInitialGrid] = useState(DEFAULT_PUZZLE.map(row => [...row]));
  const [activeCell, setActiveCell] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [toast, setToast] = useState(null);

  const playbackTimerRef = useRef(null);

  // Sync conflicts on grid edits
  useEffect(() => {
    if (isPlaying) return;
    const activeConflicts = checkGridConflicts(grid);
    setConflicts(activeConflicts);
  }, [grid, isPlaying]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  };

  const checkGridConflicts = (bGrid) => {
    const list = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = bGrid[r][c];
        if (val === 0) continue;

        // Check row
        for (let j = 0; j < 9; j++) {
          if (j !== c && bGrid[r][j] === val) {
            list.push([r, c]);
            break;
          }
        }

        // Check col
        for (let i = 0; i < 9; i++) {
          if (i !== r && bGrid[i][c] === val) {
            list.push([r, c]);
            break;
          }
        }

        // Check 3x3 box
        const boxR = Math.floor(r / 3) * 3;
        const boxC = Math.floor(c / 3) * 3;
        let clash = false;
        for (let i = boxR; i < boxR + 3; i++) {
          for (let j = boxC; j < boxC + 3; j++) {
            if ((i !== r || j !== c) && bGrid[i][j] === val) {
              clash = true;
              break;
            }
          }
          if (clash) break;
        }

        if (clash) {
          list.push([r, c]);
        }
      }
    }
    return list;
  };

  const handleCellChange = (r, c, val) => {
    const newGrid = grid.map((row, ri) => 
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    setGrid(newGrid);
    setInitialGrid(newGrid); // Treat user entries as initial configuration
  };

  // Triggers solving request and runs the fast cell-by-cell solve animation
  const handleSolve = async () => {
    if (isPlaying) return;

    if (conflicts.length > 0) {
      showToast('Cannot solve. Please clear conflicts in the grid first.', 'error');
      return;
    }

    setApiLoading(true);

    try {
      const result = await solveSudoku(initialGrid, 'dfs');
      if (result.success) {
        const solved = result.solved_grid;
        
        // Collate list of cell placements to animate
        const cellsToAnimate = [];
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (initialGrid[r][c] === 0 && solved[r][c] !== 0) {
              cellsToAnimate.push({ r, c, val: solved[r][c] });
            }
          }
        }

        setIsPlaying(true);
        let currentIdx = 0;

        if (playbackTimerRef.current) {
          clearInterval(playbackTimerRef.current);
        }

        // Animate cells filling sequentially (35ms interval) to solve completely and quickly
        playbackTimerRef.current = setInterval(() => {
          if (currentIdx < cellsToAnimate.length) {
            const cell = cellsToAnimate[currentIdx];
            setGrid(prev => {
              const next = prev.map((row, ri) => 
                row.map((val, ci) => (ri === cell.r && ci === cell.c ? cell.val : val))
              );
              return next;
            });
            setActiveCell({ row: cell.r, col: cell.c, type: 'place' });
            currentIdx++;
          } else {
            clearInterval(playbackTimerRef.current);
            setActiveCell(null);
            setIsPlaying(false);
            showToast('Sudoku solved completely!', 'success');
          }
        }, 35);

      } else {
        showToast('Sudoku puzzle is unsolvable.', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'API request failed.';
      showToast(`Solver error: ${msg}`, 'error');
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 select-none relative">
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl ${
              toast.type === 'success' 
                ? 'bg-emerald-950/85 border-emerald-500/40 text-emerald-300' 
                : toast.type === 'error'
                ? 'bg-rose-950/85 border-rose-500/40 text-rose-300'
                : 'bg-slate-900/90 border-indigo-500/30 text-indigo-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            <span className="text-sm font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Centered Board Card */}
      <div className="w-full max-w-lg glass-panel p-6 rounded-2xl border border-white/10 flex flex-col items-center gap-6 shadow-2xl relative">
        
        {/* Card Header */}
        <div className="w-full flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Sudoku Board Matrix
          </h3>
          {conflicts.length > 0 && (
            <span className="text-[10px] bg-rose-500/20 border border-rose-500/40 text-rose-400 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
              <AlertCircle className="w-3 h-3" /> Clashing numbers!
            </span>
          )}
        </div>

        {/* 9x9 Grid */}
        <SudokuGrid
          grid={grid}
          initialGrid={initialGrid}
          activeCell={activeCell}
          onChangeCell={handleCellChange}
          isPlaying={isPlaying}
          conflicts={conflicts}
        />
        
        {/* Card Footer Controls */}
        <div className="w-full flex items-center justify-between border-t border-white/5 pt-4">
          
          {/* Algorithm Badge */}
          <div className="flex items-center bg-slate-950 px-2.5 py-2.5 rounded-xl border border-white/5">
            <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow shadow-indigo-600/30">
              DFS Solver
            </span>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleSolve}
            disabled={apiLoading || conflicts.length > 0 || isPlaying}
            className={`flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              conflicts.length > 0 || isPlaying
                ? 'bg-slate-900 text-slate-500 border border-white/5 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 border border-indigo-500/30 active:scale-95'
            }`}
          >
            {apiLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin" />
                <span>Computing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Solve Puzzle</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}
