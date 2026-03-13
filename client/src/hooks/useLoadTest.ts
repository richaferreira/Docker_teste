import { useState, useCallback } from 'react';

export interface LoadTestMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  averageResponseTime: number;
  requestsPerSecond: number;
  responseTimes: number[];
}

export interface LoadTestResult {
  apache: LoadTestMetrics;
  nginx: LoadTestMetrics;
  timestamp: number;
}

const initialMetrics: LoadTestMetrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalTime: 0,
  minResponseTime: Infinity,
  maxResponseTime: 0,
  averageResponseTime: 0,
  requestsPerSecond: 0,
  responseTimes: [],
};

export function useLoadTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<LoadTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runLoadTest = useCallback(
    async (
      apachePort: number,
      nginxPort: number,
      numberOfRequests: number,
      concurrency: number
    ) => {
      setIsRunning(true);
      setError(null);
      setProgress(0);

      try {
        const apacheMetrics = await performLoadTest(
          `http://localhost:${apachePort}/`,
          numberOfRequests,
          concurrency,
          (current) => setProgress((current / (numberOfRequests * 2)) * 100)
        );

        const nginxMetrics = await performLoadTest(
          `http://localhost:${nginxPort}/`,
          numberOfRequests,
          concurrency,
          (current) => setProgress(50 + (current / (numberOfRequests * 2)) * 100)
        );

        const result: LoadTestResult = {
          apache: apacheMetrics,
          nginx: nginxMetrics,
          timestamp: Date.now(),
        };

        setResults(result);
        setProgress(100);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setIsRunning(false);
      }
    },
    []
  );

  return {
    isRunning,
    progress,
    results,
    error,
    runLoadTest,
    clearResults: () => setResults(null),
  };
}

async function performLoadTest(
  url: string,
  numberOfRequests: number,
  concurrency: number,
  onProgress: (current: number) => void
): Promise<LoadTestMetrics> {
  const responseTimes: number[] = [];
  let successfulRequests = 0;
  let failedRequests = 0;
  const startTime = performance.now();

  // Executar requisições em lotes (concorrência controlada)
  for (let i = 0; i < numberOfRequests; i += concurrency) {
    const batch = [];
    const batchSize = Math.min(concurrency, numberOfRequests - i);

    for (let j = 0; j < batchSize; j++) {
      batch.push(
        (async () => {
          try {
            const reqStart = performance.now();
            const response = await fetch(url, {
              method: 'GET',
              mode: 'no-cors',
              cache: 'no-cache',
            });
            const reqEnd = performance.now();
            const responseTime = reqEnd - reqStart;

            responseTimes.push(responseTime);
            if (response.ok || response.status === 0) {
              successfulRequests++;
            } else {
              failedRequests++;
            }
          } catch (err) {
            failedRequests++;
          }
        })()
      );
    }

    await Promise.all(batch);
    onProgress(i + batchSize);
  }

  const endTime = performance.now();
  const totalTime = endTime - startTime;

  const metrics: LoadTestMetrics = {
    totalRequests: numberOfRequests,
    successfulRequests,
    failedRequests,
    totalTime,
    minResponseTime: Math.min(...responseTimes),
    maxResponseTime: Math.max(...responseTimes),
    averageResponseTime:
      responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
    requestsPerSecond: (numberOfRequests / totalTime) * 1000,
    responseTimes,
  };

  return metrics;
}
