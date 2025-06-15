import { useState, useEffect } from 'react';

interface ExchangeRateData {
  rate: number;
  base: string;
  target: string;
  timestamp: string;
  source: 'api' | 'fallback';
}

interface UseExchangeRateReturn {
  exchangeRate: number;
  isLoading: boolean;
  error: string | null;
  source: 'api' | 'fallback' | null;
  lastUpdated: string | null;
}

export function useExchangeRate(): UseExchangeRateReturn {
  const [exchangeRate, setExchangeRate] = useState<number>(140); // デフォルト140円
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'fallback' | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/exchange-rate');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setExchangeRate(result.data.rate);
          setSource(result.data.source);
          setLastUpdated(result.data.timestamp);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Failed to fetch exchange rate:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');

        // エラー時は固定レート140円を使用
        setExchangeRate(140);
        setSource('fallback');
        setLastUpdated(new Date().toISOString());
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRate();

    // 5分ごとに為替レートを更新
    const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    exchangeRate,
    isLoading,
    error,
    source,
    lastUpdated,
  };
}
