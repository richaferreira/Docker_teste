import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LoadTestResult } from '@/hooks/useLoadTest';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface LoadTestResultsProps {
  results: LoadTestResult;
}

export default function LoadTestResults({ results }: LoadTestResultsProps) {
  const { apache, nginx } = results;

  // Preparar dados para gráficos
  const comparisonData = [
    {
      name: 'Apache',
      avgResponse: Math.round(apache.averageResponseTime),
      minResponse: Math.round(apache.minResponseTime),
      maxResponse: Math.round(apache.maxResponseTime),
      rps: Math.round(apache.requestsPerSecond * 100) / 100,
    },
    {
      name: 'Nginx',
      avgResponse: Math.round(nginx.averageResponseTime),
      minResponse: Math.round(nginx.minResponseTime),
      maxResponse: Math.round(nginx.maxResponseTime),
      rps: Math.round(nginx.requestsPerSecond * 100) / 100,
    },
  ];

  const successData = [
    { name: 'Successful', value: apache.successfulRequests, fill: '#00ff88' },
    { name: 'Failed', value: apache.failedRequests, fill: '#ff3366' },
  ];

  const nginxSuccessData = [
    { name: 'Successful', value: nginx.successfulRequests, fill: '#00ff88' },
    { name: 'Failed', value: nginx.failedRequests, fill: '#ff3366' },
  ];

  // Calcular percentis para distribuição de tempo de resposta
  const getPercentile = (arr: number[], percentile: number) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  };

  const apacheP50 = Math.round(getPercentile(apache.responseTimes, 50));
  const apacheP95 = Math.round(getPercentile(apache.responseTimes, 95));
  const apacheP99 = Math.round(getPercentile(apache.responseTimes, 99));

  const nginxP50 = Math.round(getPercentile(nginx.responseTimes, 50));
  const nginxP95 = Math.round(getPercentile(nginx.responseTimes, 95));
  const nginxP99 = Math.round(getPercentile(nginx.responseTimes, 99));

  const isBetter = (apacheValue: number, nginxValue: number, lowerIsBetter = true) => {
    if (lowerIsBetter) {
      return apacheValue < nginxValue ? 'apache' : 'nginx';
    }
    return apacheValue > nginxValue ? 'apache' : 'nginx';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="terminal-border border-orange-400/30 p-4 rounded-sm glow-orange">
          <h3 className="text-sm font-bold text-orange-400 mb-3 tracking-wider">APACHE SUMMARY</h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Response:</span>
              <span className="text-orange-400">{Math.round(apache.averageResponseTime)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Success Rate:</span>
              <span className="text-green-400">
                {((apache.successfulRequests / apache.totalRequests) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Requests/sec:</span>
              <span className="text-cyan-400">{apache.requestsPerSecond.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Time:</span>
              <span className="text-yellow-400">{(apache.totalTime / 1000).toFixed(2)}s</span>
            </div>
          </div>
        </div>

        <div className="terminal-border border-cyan-400/30 p-4 rounded-sm glow-cyan">
          <h3 className="text-sm font-bold text-cyan-400 mb-3 tracking-wider">NGINX SUMMARY</h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Response:</span>
              <span className="text-cyan-400">{Math.round(nginx.averageResponseTime)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Success Rate:</span>
              <span className="text-green-400">
                {((nginx.successfulRequests / nginx.totalRequests) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Requests/sec:</span>
              <span className="text-cyan-400">{nginx.requestsPerSecond.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Time:</span>
              <span className="text-yellow-400">{(nginx.totalTime / 1000).toFixed(2)}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Charts */}
      <div className="terminal-border border-lime-400/30 p-4 rounded-sm glow-lime">
        <h3 className="text-sm font-bold text-lime-400 mb-4 tracking-wider">RESPONSE TIME COMPARISON</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
            <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.5)" />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 14, 39, 0.9)',
                border: '1px solid rgba(0, 217, 255, 0.3)',
              }}
              labelStyle={{ color: '#00d9ff' }}
            />
            <Legend />
            <Bar dataKey="avgResponse" fill="#00d9ff" name="Avg (ms)" />
            <Bar dataKey="minResponse" fill="#00ff88" name="Min (ms)" />
            <Bar dataKey="maxResponse" fill="#ff6b35" name="Max (ms)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Requests Per Second */}
      <div className="terminal-border border-cyan-400/30 p-4 rounded-sm glow-cyan">
        <h3 className="text-sm font-bold text-cyan-400 mb-4 tracking-wider">THROUGHPUT (Requests/Second)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
            <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.5)" />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 14, 39, 0.9)',
                border: '1px solid rgba(0, 217, 255, 0.3)',
              }}
              labelStyle={{ color: '#00d9ff' }}
            />
            <Bar dataKey="rps" fill="#ffd700" name="RPS" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Success Rate */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="terminal-border border-orange-400/30 p-4 rounded-sm glow-orange">
          <h3 className="text-sm font-bold text-orange-400 mb-4 tracking-wider">APACHE SUCCESS RATE</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={successData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {successData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 14, 39, 0.9)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="terminal-border border-cyan-400/30 p-4 rounded-sm glow-cyan">
          <h3 className="text-sm font-bold text-cyan-400 mb-4 tracking-wider">NGINX SUCCESS RATE</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={nginxSuccessData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {nginxSuccessData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 14, 39, 0.9)',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Percentile Analysis */}
      <div className="terminal-border border-yellow-400/30 p-4 rounded-sm">
        <h3 className="text-sm font-bold text-yellow-400 mb-4 tracking-wider">RESPONSE TIME PERCENTILES</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-black/50 p-3 rounded-sm border border-yellow-400/20">
            <p className="text-xs text-muted-foreground font-mono mb-2">P50 (Median)</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-orange-400 font-mono">Apache: {apacheP50}ms</p>
                <p className="text-xs text-cyan-400 font-mono">Nginx: {nginxP50}ms</p>
              </div>
              {isBetter(apacheP50, nginxP50) === 'apache' ? (
                <TrendingUp size={16} className="text-green-400" />
              ) : (
                <TrendingDown size={16} className="text-green-400" />
              )}
            </div>
          </div>

          <div className="bg-black/50 p-3 rounded-sm border border-yellow-400/20">
            <p className="text-xs text-muted-foreground font-mono mb-2">P95</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-orange-400 font-mono">Apache: {apacheP95}ms</p>
                <p className="text-xs text-cyan-400 font-mono">Nginx: {nginxP95}ms</p>
              </div>
              {isBetter(apacheP95, nginxP95) === 'apache' ? (
                <TrendingUp size={16} className="text-green-400" />
              ) : (
                <TrendingDown size={16} className="text-green-400" />
              )}
            </div>
          </div>

          <div className="bg-black/50 p-3 rounded-sm border border-yellow-400/20">
            <p className="text-xs text-muted-foreground font-mono mb-2">P99</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-orange-400 font-mono">Apache: {apacheP99}ms</p>
                <p className="text-xs text-cyan-400 font-mono">Nginx: {nginxP99}ms</p>
              </div>
              {isBetter(apacheP99, nginxP99) === 'apache' ? (
                <TrendingUp size={16} className="text-green-400" />
              ) : (
                <TrendingDown size={16} className="text-green-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overall Winner */}
      <div className="terminal-border border-lime-400/30 p-4 rounded-sm glow-lime">
        <h3 className="text-sm font-bold text-lime-400 mb-3 tracking-wider">PERFORMANCE ANALYSIS</h3>
        <div className="space-y-2 text-xs font-mono">
          <p className="text-foreground">
            <span className="text-cyan-400">Nginx</span> is{' '}
            <span className="text-green-400 font-bold">
              {(
                ((apache.averageResponseTime - nginx.averageResponseTime) /
                  apache.averageResponseTime) *
                100
              ).toFixed(1)}%
            </span>{' '}
            faster in average response time
          </p>
          <p className="text-foreground">
            <span className="text-cyan-400">Nginx</span> handles{' '}
            <span className="text-green-400 font-bold">
              {(
                ((nginx.requestsPerSecond - apache.requestsPerSecond) /
                  apache.requestsPerSecond) *
                100
              ).toFixed(1)}%
            </span>{' '}
            more requests per second
          </p>
        </div>
      </div>
    </div>
  );
}
