import { useState } from 'react';
import { Play, RotateCcw, Zap } from 'lucide-react';
import { useLoadTest } from '@/hooks/useLoadTest';
import LoadTestResults from './LoadTestResults';

export default function LoadTestPanel() {
  const [numberOfRequests, setNumberOfRequests] = useState(100);
  const [concurrency, setConcurrency] = useState(10);
  const { isRunning, progress, results, error, runLoadTest, clearResults } =
    useLoadTest();

  const handleStartTest = async () => {
    await runLoadTest(8080, 8081, numberOfRequests, concurrency);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="terminal-border border-yellow-400/30 p-6 rounded-sm">
        <h2 className="text-lg font-bold text-yellow-400 mb-4 tracking-wider">
          LOAD TEST CONFIGURATION
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground font-mono mb-2">
              TOTAL REQUESTS
            </label>
            <input
              type="number"
              min="1"
              max="10000"
              value={numberOfRequests}
              onChange={(e) => setNumberOfRequests(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={isRunning}
              className="w-full px-3 py-2 bg-black/50 border border-yellow-400/30 rounded-sm text-foreground font-mono text-sm focus:outline-none focus:border-yellow-400 disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground font-mono mt-1">
              Number of HTTP requests to send to each server
            </p>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground font-mono mb-2">
              CONCURRENCY LEVEL
            </label>
            <input
              type="number"
              min="1"
              max={numberOfRequests}
              value={concurrency}
              onChange={(e) =>
                setConcurrency(Math.max(1, Math.min(numberOfRequests, parseInt(e.target.value) || 1)))
              }
              disabled={isRunning}
              className="w-full px-3 py-2 bg-black/50 border border-yellow-400/30 rounded-sm text-foreground font-mono text-sm focus:outline-none focus:border-yellow-400 disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground font-mono mt-1">
              Number of simultaneous requests per batch
            </p>
          </div>

          {error && (
            <div className="text-xs text-red-500 font-mono bg-red-500/10 p-3 rounded-sm border border-red-500/30">
              ERROR: {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleStartTest}
              disabled={isRunning}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 disabled:bg-yellow-500/10 text-yellow-400 border border-yellow-500/50 rounded-sm font-mono font-bold tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap size={16} />
              {isRunning ? 'TESTING...' : 'START LOAD TEST'}
            </button>

            {results && (
              <button
                onClick={clearResults}
                disabled={isRunning}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 rounded-sm font-mono font-bold tracking-wider transition-all duration-200 disabled:opacity-50"
              >
                <RotateCcw size={16} />
                CLEAR
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <div className="terminal-border border-cyan-400/30 p-4 rounded-sm glow-cyan">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-cyan-400 font-mono font-bold">PROGRESS</span>
            <span className="text-sm text-cyan-400 font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-black/50 rounded-sm overflow-hidden border border-cyan-400/20">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-lime-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {results && <LoadTestResults results={results} />}
    </div>
  );
}
