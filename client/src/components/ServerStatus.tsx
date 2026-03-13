import { useEffect, useState } from 'react';
import { Activity, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

interface ServerStatusProps {
  name: string;
  port: number;
  icon: string;
  color: 'orange' | 'cyan';
}

export default function ServerStatus({ name, port, icon, color }: ServerStatusProps) {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setStatus('loading');
    setError(null);
    const startTime = performance.now();

    try {
      const response = await fetch(`http://localhost:${port}/`, {
        method: 'HEAD',
        mode: 'no-cors',
      });
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setStatus('online');
    } catch (err) {
      setStatus('offline');
      setError('Connection failed');
      setResponseTime(null);
    }
  };

  useEffect(() => {
    testConnection();
    const interval = setInterval(testConnection, 5000);
    return () => clearInterval(interval);
  }, [port]);

  const glowClass = color === 'orange' ? 'glow-orange' : 'glow-cyan';
  const borderColor = color === 'orange' ? 'border-orange-500/30' : 'border-cyan-400/30';
  const statusColor = 
    status === 'online' ? 'text-green-400' :
    status === 'offline' ? 'text-red-500' :
    'text-yellow-400';

  return (
    <div className={`terminal-border ${borderColor} p-6 rounded-sm ${glowClass} transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={icon} alt={name} className="w-12 h-12 opacity-80" />
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-wider">{name}</h3>
            <p className="text-xs text-muted-foreground font-mono">PORT {port}</p>
          </div>
        </div>
        <div className={`status-indicator status-${status}`} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-mono">STATUS</span>
          <div className={`flex items-center gap-2 ${statusColor} font-mono text-sm font-bold`}>
            {status === 'online' && <CheckCircle2 size={16} />}
            {status === 'offline' && <AlertCircle size={16} />}
            {status === 'loading' && <Activity size={16} className="animate-spin" />}
            <span>{status.toUpperCase()}</span>
          </div>
        </div>

        {responseTime !== null && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-mono">RESPONSE</span>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm">
              <Zap size={14} />
              <span>{responseTime}ms</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs text-red-500 font-mono bg-red-500/10 p-2 rounded-sm border border-red-500/30">
            {error}
          </div>
        )}

        <button
          onClick={testConnection}
          disabled={status === 'loading'}
          className="w-full mt-4 px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 rounded-sm font-mono text-xs font-bold tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'TESTING...' : 'TEST CONNECTION'}
        </button>
      </div>
    </div>
  );
}
