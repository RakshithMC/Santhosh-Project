import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { BarChart3, Clock, Layers, HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function SolverStats({ stats, comparisonData = null }) {
  if (!stats) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full flex flex-col items-center justify-center text-slate-500 min-h-[300px]">
        <HelpCircle className="w-10 h-10 mb-2 stroke-1 text-slate-600" />
        <p className="text-sm font-medium">Awaiting Telemetry</p>
        <p className="text-xs mt-1 text-slate-600 text-center max-w-xs">
          Solve a puzzle to populate real-time execution graphs and complexity profiles.
        </p>
      </div>
    );
  }

  const { success, runtime, states, backtracks, max_depth, limit_exceeded } = stats;

  // Format runtime to human readable
  const formattedRuntime = (runtime * 1000).toFixed(2); // Convert to ms

  // Pie chart data: Backtracks vs Progress (Non-backtrack states)
  const pieData = {
    labels: ['Dead-Ends (Backtracks)', 'Progress States'],
    datasets: [
      {
        data: [backtracks, Math.max(0, states - backtracks)],
        backgroundColor: ['rgba(239, 68, 68, 0.75)', 'rgba(34, 197, 94, 0.75)'],
        borderColor: ['#ef4444', '#22c55e'],
        borderWidth: 1.5,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Outfit', size: 10 }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: 'Outfit', size: 12 },
        bodyFont: { family: 'monospace', size: 11 },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
      }
    }
  };

  // Check if comparison metrics exist
  const hasComparison = comparisonData && comparisonData.dfs && comparisonData.bfs;

  // Comparison Bar Chart (DFS vs BFS)
  const comparisonStatesData = hasComparison ? {
    labels: ['States Explored', 'Dead-ends / Backtracks'],
    datasets: [
      {
        label: 'DFS Solver',
        data: [comparisonData.dfs.states, comparisonData.dfs.backtracks],
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: '#4f46e5',
        borderWidth: 1
      },
      {
        label: 'BFS Solver',
        data: [comparisonData.bfs.states, comparisonData.bfs.backtracks],
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderColor: '#8b5cf6',
        borderWidth: 1
      }
    ]
  } : null;

  const comparisonRuntimeData = hasComparison ? {
    labels: ['Execution Time (ms)'],
    datasets: [
      {
        label: 'DFS Solver',
        data: [comparisonData.dfs.runtime * 1000],
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: '#22c55e',
        borderWidth: 1
      },
      {
        label: 'BFS Solver',
        data: [comparisonData.bfs.runtime * 1000],
        backgroundColor: 'rgba(245, 158, 11, 0.7)',
        borderColor: '#f59e0b',
        borderWidth: 1
      }
    ]
  } : null;

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Outfit', size: 10 }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        ticks: { color: '#94a3b8', font: { family: 'monospace', size: 10 } },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      x: {
        ticks: { color: '#94a3b8', font: { family: 'Outfit', size: 10 } },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Telemetry Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Status / Success Card */}
        <div className="glass-card p-4 rounded-xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[95px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold tracking-wider uppercase">Solver Status</span>
            {success ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className="mt-2">
            <span className={`text-xl font-bold tracking-tight ${success ? 'text-emerald-400' : 'text-rose-400'}`}>
              {success ? 'SUCCESS' : limit_exceeded ? 'ABORTED' : 'UNSOLVABLE'}
            </span>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">
              {limit_exceeded ? 'BFS state limit hit' : success ? 'Board matches rules' : 'Contradiction found'}
            </p>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Runtime Card */}
        <div className="glass-card p-4 rounded-xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[95px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold tracking-wider uppercase">Solve Duration</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">
              {formattedRuntime}
            </span>
            <span className="text-xs text-indigo-400 ml-1 font-bold">ms</span>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">
              {runtime.toFixed(6)} sec
            </p>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* States Explored Card */}
        <div className="glass-card p-4 rounded-xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[95px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold tracking-wider uppercase">States Explored</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">
              {states.toLocaleString()}
            </span>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">
              Total board versions checked
            </p>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Backtracks Card */}
        <div className="glass-card p-4 rounded-xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[95px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold tracking-wider uppercase">Backtracks</span>
            <BarChart3 className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">
              {backtracks.toLocaleString()}
            </span>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">
              Tree search dead-ends met
            </p>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

      </div>

      {/* Charts Panel */}
      <div className="glass-card p-5 rounded-2xl border border-white/5">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">
          {hasComparison ? 'DFS vs BFS Performance Metrics' : 'DFS Telemetry Breakdown'}
        </h4>

        {hasComparison ? (
          <div className="space-y-6">
            {/* Compare States */}
            <div className="h-44">
              <p className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Node Evaluations</p>
              <Bar data={comparisonStatesData} options={barOptions} />
            </div>
            
            {/* Compare Runtime */}
            <div className="h-44">
              <p className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Execution Time (ms)</p>
              <Bar data={comparisonRuntimeData} options={barOptions} />
            </div>

            {comparisonData.bfs.limit_exceeded && (
              <div className="text-[11px] bg-rose-950/30 text-rose-400 border border-rose-900/30 p-2.5 rounded-lg">
                <span className="font-bold">Notice:</span> BFS solver was aborted after {comparisonData.bfs.states} evaluations to protect memory. This demonstrates BFS space complexity constraints on sparse constraint-grids.
              </div>
            )}
          </div>
        ) : (
          /* Normal Pie Chart */
          <div className="h-56 relative flex items-center justify-center">
            {states > 0 ? (
              <Pie data={pieData} options={pieOptions} />
            ) : (
              <div className="text-xs text-slate-500 italic">No search states to display.</div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
