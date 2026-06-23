import React from 'react';
import { HelpCircle, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto py-6 border-t border-white/5 glass-panel">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
        
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-indigo-400" />
          <span>
            Built with <strong className="text-slate-200">FastAPI</strong> + <strong className="text-slate-200">React & Vite</strong> + <strong className="text-slate-200">Tailwind CSS</strong>
          </span>
        </div>

        <div className="text-center md:text-right">
          <p>© {new Date().getFullYear()} Interactive Pseudocode Puzzle Solver. All rights reserved.</p>
          <p className="text-[10px] text-indigo-400/60 mt-0.5">
            Depth-First Search (DFS) & Breadth-First Search (BFS) Visualizer Engine
          </p>
        </div>

      </div>
    </footer>
  );
}
