import React, { useEffect, useState } from 'react';
import { Cpu, Server } from 'lucide-react';
import { getHealthStatus } from '../services/api';

export default function Header() {
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await getHealthStatus();
        if (data && data.status === 'running') {
          setApiOnline(true);
        } else {
          setApiOnline(false);
        }
      } catch (err) {
        setApiOnline(false);
      }
    };
    
    checkHealth();
    const interval = setInterval(checkHealth, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 md:px-8 border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand/Logo */}
        <div className="flex items-center space-x-3 group cursor-default select-none">
          <div className="p-2 bg-indigo-600/30 rounded-lg border border-indigo-500/20 group-hover:border-indigo-500/50 group-hover:bg-indigo-600/40 transition-all duration-300">
            <Cpu className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
              SolverMind
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
              DFS Sudoku Solver
            </p>
          </div>
        </div>

        {/* API Connection Status */}
        <div className="flex items-center space-x-2 bg-slate-900/50 border border-white/5 rounded-full px-3 py-1.5">
          <Server className={`w-3.5 h-3.5 ${apiOnline ? 'text-emerald-400' : 'text-rose-400'}`} />
          <span className="text-xs font-semibold hidden md:inline text-slate-300 select-none">
            Engine:
          </span>
          <div className="flex items-center space-x-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${apiOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className={`text-[11px] font-bold ${apiOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
              {apiOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
