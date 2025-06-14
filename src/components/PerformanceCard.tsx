'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Tooltip from '@/components/tooltip';

interface PerformanceData {
  period: string;
  return: number; // パーセンテージ
  label: string;
}

interface PerformanceCardProps {
  performanceData: PerformanceData[];
  currentPrice: number;
  className?: string;
}

export default function PerformanceCard({
  performanceData,
  currentPrice,
  className = '',
}: PerformanceCardProps) {
  // 最大値を取得してスケールを計算
  const maxAbsReturn = useMemo(() => {
    return Math.max(...performanceData.map((data) => Math.abs(data.return)));
  }, [performanceData]);

  // 具体的な投資例を計算
  const investmentExample = useMemo(() => {
    const oneYearData = performanceData.find((data) => data.period === '1Y');
    if (!oneYearData) return null;

    const initialAmount = 1000000; // 100万円
    const currentAmount = initialAmount * (1 + oneYearData.return / 100);

    return {
      initial: initialAmount,
      current: Math.round(currentAmount),
      profit: Math.round(currentAmount - initialAmount),
      isPositive: oneYearData.return >= 0,
    };
  }, [performanceData]);

  return (
    <div
      className={`bg-[var(--color-surface)] rounded-2xl p-6 shadow-lg dark:bg-[var(--color-surface-2)] dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
            リターン実績 (Performance)
          </h3>
          <Tooltip
            content={`リターン実績は、過去の一定期間における株価の変動率を示します。

【計算方法】
リターン = (現在の株価 - 過去の株価) ÷ 過去の株価 × 100

【期間別リターンの見方】
• 1ヶ月：短期的な値動きの傾向
• 6ヶ月：中期的なトレンド
• 年初来（YTD）：その年の始めからの成績
• 1年：長期的なパフォーマンス

【注意点】
• 過去の実績は将来の成果を保証するものではありません
• 市場全体の動向や業界の状況も考慮が必要です
• リスクとリターンは表裏一体の関係にあります

【投資シミュレーション】
実際の投資額での具体例を示すことで、リターンの実感を得やすくしています。`}
            title="リターン実績について"
          >
            <span></span>
          </Tooltip>
        </div>
        <TrendingUp className="w-5 h-5 text-[var(--color-lp-mint)]" />
      </div>

      {/* 期間別リターン横棒グラフ */}
      <div className="space-y-4 mb-6">
        {performanceData.map((data, index) => {
          const isPositive = data.return >= 0;
          const barWidth = (Math.abs(data.return) / maxAbsReturn) * 100;

          return (
            <div key={data.period} className="flex items-center">
              <div className="w-12 text-xs text-[var(--color-gray-400)] font-medium">
                {data.label}
              </div>
              <div className="flex-1 mx-3 relative">
                <div className="h-6 bg-[var(--color-surface-alt)] dark:bg-[var(--color-surface-3)] rounded-full relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      isPositive ? 'bg-[var(--color-success)]' : 'bg-[var(--color-danger)]'
                    }`}
                    style={{
                      width: `${barWidth}%`,
                      animationDelay: `${index * 0.1}s`,
                      transform: 'scaleX(0)',
                      animation: `bar-grow 0.8s ease-out ${index * 0.1}s forwards`,
                    }}
                  />
                </div>
              </div>
              <div className="w-16 text-right">
                <span
                  className={`text-sm font-semibold ${
                    isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {data.return.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 具体的な投資例 */}
      {investmentExample && (
        <div className="bg-[var(--color-lp-mint)]/5 dark:bg-[var(--color-lp-mint)]/10 rounded-xl p-4 border border-[var(--color-lp-mint)]/20 dark:border-[var(--color-lp-mint)]/30">
          <div className="flex items-center mb-2">
            {investmentExample.isPositive ? (
              <TrendingUp className="w-4 h-4 text-[var(--color-success)] mr-2" />
            ) : (
              <TrendingDown className="w-4 h-4 text-[var(--color-danger)] mr-2" />
            )}
            <span className="text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-text-secondary)]">
              投資シミュレーション例
            </span>
          </div>
          <p className="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)]">
            もし1年前に
            <span className="font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
              {investmentExample.initial.toLocaleString()}円
            </span>
            投資していたら、今
            <span
              className={`font-semibold ${
                investmentExample.isPositive
                  ? 'text-[var(--color-success)]'
                  : 'text-[var(--color-danger)]'
              }`}
            >
              {investmentExample.current.toLocaleString()}円
            </span>
            になっています
            <span
              className={`ml-1 text-xs ${
                investmentExample.isPositive
                  ? 'text-[var(--color-success)]'
                  : 'text-[var(--color-danger)]'
              }`}
            >
              ({investmentExample.isPositive ? '+' : ''}
              {investmentExample.profit.toLocaleString()}円)
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
