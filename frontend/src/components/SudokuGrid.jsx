import React from 'react';

export default function SudokuGrid({
  grid,
  initialGrid,
  activeCell, // { row, col, type: 'place' | 'backtrack' }
  onChangeCell,
  isPlaying,
  conflicts = [] // List of [r, c] pairs that have conflicts
}) {
  
  const isConflict = (r, c) => {
    return conflicts.some(([cr, cc]) => cr === r && cc === c);
  };

  const handleInputChange = (e, r, c) => {
    if (isPlaying) return;
    const value = e.target.value;
    
    // Allow empty string or numbers 1-9
    if (value === '') {
      onChangeCell(r, c, 0);
    } else {
      const num = parseInt(value.slice(-1), 10);
      if (num >= 1 && num <= 9) {
        onChangeCell(r, c, num);
      }
    }
  };

  const handleKeyDown = (e, r, c) => {
    if (isPlaying) return;
    let nextR = r;
    let nextC = c;

    switch (e.key) {
      case 'ArrowUp':
        nextR = Math.max(0, r - 1);
        break;
      case 'ArrowDown':
        nextR = Math.min(8, r + 1);
        break;
      case 'ArrowLeft':
        nextC = Math.max(0, c - 1);
        break;
      case 'ArrowRight':
        nextC = Math.min(8, c + 1);
        break;
      case 'Backspace':
      case 'Delete':
        // If cell has value and is not locked, clear it
        if (initialGrid[r][c] === 0) {
          onChangeCell(r, c, 0);
        }
        return;
      default:
        // Let standard input handle character inputs
        return;
    }

    e.preventDefault();
    document.getElementById(`cell-${nextR}-${nextC}`)?.focus();
  };

  return (
    <div className="w-full aspect-square max-w-[450px] mx-auto bg-slate-950 p-2.5 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden">
      
      {/* Decorative board glows */}
      <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

      {/* Grid container */}
      <div className="grid grid-cols-9 gap-1 h-full w-full">
        {grid.map((row, rIdx) =>
          row.map((val, cIdx) => {
            const isInit = initialGrid[rIdx][cIdx] !== 0;
            const isConflictCell = isConflict(rIdx, cIdx);
            
            // Check if cell is active in playback visualization
            const isActive = activeCell && activeCell.row === rIdx && activeCell.col === cIdx;
            const isPlaceType = isActive && activeCell.type === 'place';
            const isBacktrackType = isActive && activeCell.type === 'backtrack';
            
            // Determine background & borders
            let bgClass = 'bg-slate-900/90 text-slate-300';
            let borderClass = 'border border-white/5';
            
            if (isInit) {
              bgClass = 'bg-slate-800/80 text-white font-extrabold';
            }
            
            if (isConflictCell) {
              bgClass = 'bg-rose-500/20 text-rose-300 border border-rose-500/50';
            } else if (isActive) {
              if (isPlaceType) {
                bgClass = 'bg-emerald-500/30 text-emerald-400 border border-emerald-400 font-bold pulse-node';
              } else if (isBacktrackType) {
                bgClass = 'bg-rose-500/40 text-rose-300 border border-rose-400 font-bold';
              } else {
                bgClass = 'bg-indigo-500/30 text-indigo-300 border border-indigo-400 font-bold';
              }
            } else if (!isInit && val !== 0) {
              // Values filled by solver
              bgClass = 'bg-slate-900/90 text-indigo-300 font-semibold';
            }

            // Grid thick borders for 3x3 blocks
            let borderBottom = (rIdx === 2 || rIdx === 5) ? 'border-b-2 border-b-indigo-500/40' : '';
            let borderRight = (cIdx === 2 || cIdx === 5) ? 'border-r-2 border-r-indigo-500/40' : '';

            return (
              <div 
                key={`${rIdx}-${cIdx}`} 
                className={`relative aspect-square flex items-center justify-center rounded-lg ${borderBottom} ${borderRight}`}
              >
                <input
                  id={`cell-${rIdx}-${cIdx}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[1-9]*"
                  value={val === 0 ? '' : val}
                  onChange={(e) => handleInputChange(e, rIdx, cIdx)}
                  onKeyDown={(e) => handleKeyDown(e, rIdx, cIdx)}
                  disabled={isInit || isPlaying}
                  className={`w-full h-full text-center text-lg md:text-xl font-sans rounded-md focus:outline-none transition-all select-all ${bgClass} ${borderClass} ${
                    isInit 
                      ? 'cursor-not-allowed' 
                      : isPlaying 
                      ? 'cursor-default' 
                      : 'hover:bg-slate-800 focus:bg-slate-800 focus:ring-1 focus:ring-indigo-500/50'
                  }`}
                  aria-label={`Cell Row ${rIdx + 1} Column ${cIdx + 1}`}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
