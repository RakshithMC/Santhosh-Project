import React, { useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Zap, HelpCircle } from 'lucide-react';

export default function DFSVisualizer({
  steps = [],
  currentStepIdx,
  onStepChange,
  isPlaying,
  setIsPlaying,
  speed, // in ms
  onSpeedChange,
  onResetPlayback
}) {
  
  // Calculate the current active path (recursion stack) up to the current step
  const activeStack = useMemo(() => {
    if (steps.length === 0 || currentStepIdx < 0) return [];
    
    const stack = [];
    const stepLimit = Math.min(currentStepIdx, steps.length - 1);
    
    for (let i = 0; i <= stepLimit; i++) {
      const step = steps[i];
      if (step.type === 'place') {
        // Remove any existing entry for this cell
        const existingIdx = stack.findIndex(n => n.row === step.row && n.col === step.col);
        if (existingIdx !== -1) {
          stack.splice(existingIdx);
        }
        stack.push(step);
      } else if (step.type === 'backtrack') {
        const existingIdx = stack.findIndex(n => n.row === step.row && n.col === step.col);
        if (existingIdx !== -1) {
          // Pop everything from this cell onwards
          stack.splice(existingIdx);
        }
      }
    }
    return stack;
  }, [steps, currentStepIdx]);

  const currentStep = steps[currentStepIdx] || null;

  // Determine status of values 1-9 for the current cell being explored
  const branchStatuses = useMemo(() => {
    if (!currentStep) return Array(9).fill('unexplored');
    
    const statuses = Array(9).fill('unexplored');
    const currRow = currentStep.row;
    const currCol = currentStep.col;

    // Look backward in steps to see what has been tried at the current cell *in this visit*
    let i = currentStepIdx;
    while (i >= 0) {
      const step = steps[i];
      // If we stepped out of this cell, stop scanning back
      if (step.row !== currRow || step.col !== currCol) {
        // If we go back and find a place for a different cell, it's fine, but if we find
        // a different cell's backtrack, it means we finished this cell's scope earlier
        if (step.type === 'place' && stackContainsCell(activeStack, step.row, step.col, currRow, currCol)) {
          // Keep scanning
        } else {
          break;
        }
      } else {
        const valIdx = step.val - 1;
        if (step.type === 'place') {
          if (statuses[valIdx] === 'unexplored') {
            statuses[valIdx] = 'success'; // Temporarily placed
          }
        } else if (step.type === 'backtrack') {
          statuses[valIdx] = 'backtrack'; // Backtracked
        }
      }
      i--;
    }

    // Set the absolute current step value to active
    if (currentStep) {
      const activeValIdx = currentStep.val - 1;
      statuses[activeValIdx] = currentStep.type === 'place' ? 'active' : 'backtrack';
    }

    return statuses;
  }, [currentStep, currentStepIdx, steps, activeStack]);

  function stackContainsCell(stack, r, c, targetR, targetC) {
    // If scanning back, check if we are still within the recursion of the target cell
    return true; // Simple fallback
  }

  // Handle Play/Pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      onStepChange(currentStepIdx + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIdx > 0) {
      onStepChange(currentStepIdx - 1);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
      
      {/* Visualizer Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            DFS Exploration Visualizer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step {steps.length > 0 ? currentStepIdx + 1 : 0} of {steps.length} | Current Depth: {activeStack.length}
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-white/5 w-full md:w-auto justify-center">
          <button
            onClick={onResetPlayback}
            disabled={steps.length === 0}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            title="Reset Playback"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleStepBackward}
            disabled={steps.length === 0 || currentStepIdx <= 0}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            title="Step Backward"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            disabled={steps.length === 0 || currentStepIdx >= steps.length - 1}
            className={`p-3 rounded-lg text-white transition-all ${
              isPlaying 
                ? 'bg-amber-600/80 hover:bg-amber-500 border border-amber-500/30' 
                : 'bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 glow-primary'
            } disabled:opacity-40`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          <button
            onClick={handleStepForward}
            disabled={steps.length === 0 || currentStepIdx >= steps.length - 1}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            title="Step Forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-3 w-full md:w-56 bg-slate-900/40 px-3 py-2 rounded-xl border border-white/5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
            Delay:
          </span>
          <input
            type="range"
            min="5"
            max="1000"
            step="10"
            value={speed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-indigo-400 w-12 text-right">
            {speed}ms
          </span>
        </div>
      </div>

      {/* Main Visualization Row */}
      {steps.length === 0 ? (
        <div className="h-60 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-slate-950/20 text-slate-500">
          <HelpCircle className="w-8 h-8 mb-2 stroke-1" />
          <p className="text-sm">No solving exploration active.</p>
          <p className="text-xs mt-1">Load a puzzle and click "Solve Puzzle" to trace steps.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Recursion Stack (4 cols) */}
          <div className="lg:col-span-4 flex flex-col h-60 bg-slate-950/50 p-4 rounded-xl border border-white/5 overflow-hidden">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">
              Recursion Stack (DFS Path)
            </h4>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {activeStack.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-600 italic">
                  Stack empty (Initial state)
                </div>
              ) : (
                activeStack.map((node, idx) => (
                  <div 
                    key={`${node.row}-${node.col}`}
                    className="flex items-center justify-between text-xs bg-slate-900/80 border border-white/5 px-3 py-1.5 rounded-lg"
                  >
                    <span className="text-slate-500 font-mono">#{idx}</span>
                    <span className="font-mono text-slate-300">
                      Cell ({node.row}, {node.col})
                    </span>
                    <span className="bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 px-2 py-0.5 rounded">
                      val: {node.val}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Branching Expander SVG (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-slate-950/50 p-4 rounded-xl border border-white/5 h-60">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">
              Local Decisions
              {currentStep && ` - Cell (${currentStep.row}, ${currentStep.col})`}
            </h4>

            {currentStep ? (
              <div className="flex-1 flex flex-col md:flex-row items-center justify-around gap-4">
                
                {/* SVG Decision Tree */}
                <div className="w-full max-w-sm h-full flex items-center justify-center">
                  <svg viewBox="0 0 400 120" className="w-full h-full">
                    {/* Parent Node */}
                    <g transform="translate(200, 20)">
                      <circle r="12" fill="#1e293b" stroke="#4f46e5" strokeWidth="1.5" />
                      <text dy="4" textAnchor="middle" fill="#818cf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                        C
                      </text>
                    </g>

                    {/* Connecting lines from Parent Node to 1-9 branches */}
                    {branchStatuses.map((status, idx) => {
                      const angle = -150 + idx * 37.5; // Distribute 9 nodes across an arc
                      const rad = (angle * Math.PI) / 180;
                      const length = 75;
                      const x2 = 200 + length * Math.sin(rad);
                      const y2 = 20 + length * Math.cos(rad);
                      
                      let strokeColor = '#334155'; // default unexplored
                      let strokeDash = '3,3';
                      let strokeWidth = '1';

                      if (status === 'active') {
                        strokeColor = '#3b82f6'; // blue
                        strokeDash = '0';
                        strokeWidth = '2';
                      } else if (status === 'success') {
                        strokeColor = '#10b981'; // green
                        strokeDash = '0';
                        strokeWidth = '1.5';
                      } else if (status === 'backtrack') {
                        strokeColor = '#ef4444'; // red
                        strokeDash = '0';
                        strokeWidth = '1.5';
                      }

                      return (
                        <line 
                          key={`line-${idx}`}
                          x1="200" 
                          y1="32" 
                          x2={x2} 
                          y2={y2 - 8} 
                          stroke={strokeColor} 
                          strokeWidth={strokeWidth} 
                          strokeDasharray={strokeDash}
                          className="transition-all duration-300"
                        />
                      );
                    })}

                    {/* Branch circle nodes for values 1-9 */}
                    {branchStatuses.map((status, idx) => {
                      const angle = -150 + idx * 37.5;
                      const rad = (angle * Math.PI) / 180;
                      const length = 75;
                      const x = 200 + length * Math.sin(rad);
                      const y = 20 + length * Math.cos(rad);

                      let fill = '#0f172a';
                      let stroke = '#334155';
                      let textFill = '#64748b';
                      let glowClass = '';

                      if (status === 'active') {
                        fill = '#1d4ed8'; // blue dark
                        stroke = '#3b82f6'; // blue light
                        textFill = '#ffffff';
                        glowClass = 'animate-pulse';
                      } else if (status === 'success') {
                        fill = '#064e3b'; // green dark
                        stroke = '#10b981'; // green light
                        textFill = '#a7f3d0';
                      } else if (status === 'backtrack') {
                        fill = '#7f1d1d'; // red dark
                        stroke = '#ef4444'; // red light
                        textFill = '#fca5a5';
                      }

                      return (
                        <g key={`node-${idx}`} transform={`translate(${x}, ${y})`} className={glowClass}>
                          <circle r="9" fill={fill} stroke={stroke} strokeWidth="1.5" className="transition-all duration-300" />
                          <text dy="3.5" textAnchor="middle" fill={textFill} fontSize="9" fontWeight="bold" fontFamily="monospace">
                            {idx + 1}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Text Explanation Panel */}
                <div className="w-full md:w-44 flex flex-col justify-center space-y-2 border-t md:border-t-0 md:border-l border-white/5 pt-2 md:pt-0 md:pl-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-slate-300">Active Check ({currentStep.val})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-300">Valid Branch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-slate-300">Backtracked / Fail</span>
                  </div>
                  <div className="pt-2 text-[10px] text-slate-500 leading-normal">
                    {currentStep.type === 'place' ? (
                      <span className="text-emerald-400">
                        Placed {currentStep.val} at ({currentStep.row}, {currentStep.col}) and recurred.
                      </span>
                    ) : (
                      <span className="text-rose-400">
                        Conflict detected! Backtracked, clearing ({currentStep.row}, {currentStep.col}).
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center text-xs text-slate-500 italic">
                Awaiting first step...
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
