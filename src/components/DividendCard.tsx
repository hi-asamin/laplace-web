'use client';

import { useMemo } from 'react';
import { Calendar, TrendingUp, DollarSign } from 'lucide-react';
import Tooltip from '@/components/tooltip';

interface DividendHistoryData {
  year: string;
  dividend: number;
  isEstimate?: boolean;
}

interface DividendAnalysis {
  totalYears: number;
  dividendCutYears: {
    year: string;
    previousDividend: number;
    currentDividend: number;
    cutPercentage: number;
  }[];
  hasDividendCuts: boolean;
  dividendCutCount: number;
  consecutiveGrowthYears: number;
  averageGrowthRate: number;
  stability: 'excellent' | 'good' | 'stable' | 'moderate' | 'unstable' | 'insufficient-data';
}

interface DividendCardProps {
  currentYield: number; // パーセンテージ
  dividendHistory: DividendHistoryData[];
  nextExDate?: string; // 次の権利確定日 (YYYY-MM-DD)
  annualDividend?: number; // 年間配当額
  dividendAnalysis?: DividendAnalysis; // 減配分析結果
  className?: string;
}

export default function DividendCard({
  currentYield,
  dividendHistory,
  nextExDate,
  annualDividend,
  dividendAnalysis,
  className = '',
}: DividendCardProps) {
  // 配当の傾向を分析（実績データのみで判定、予想値は除外）
  const dividendTrend = useMemo(() => {
    if (dividendHistory.length < 2) return 'stable';

    // 実績データのみを抽出（予想値を除外）
    const actualData = dividendHistory.filter((item) => !item.isEstimate);
    if (actualData.length < 2) return 'stable';

    const recent = actualData.slice(-3); // 最新3年の実績データ
    const isIncreasing = recent.every(
      (item, index) => index === 0 || item.dividend >= recent[index - 1].dividend
    );
    const isDecreasing = recent.every(
      (item, index) => index === 0 || item.dividend <= recent[index - 1].dividend
    );

    if (isIncreasing && recent[recent.length - 1].dividend > recent[0].dividend) {
      return 'increasing';
    } else if (isDecreasing && recent[recent.length - 1].dividend < recent[0].dividend) {
      return 'decreasing';
    }
    return 'stable';
  }, [dividendHistory]);

  // 最大配当額を取得してスケールを計算
  const maxDividend = useMemo(() => {
    if (dividendHistory.length === 0) return 0;
    return Math.max(...dividendHistory.map((data) => data.dividend));
  }, [dividendHistory]);

  // 次の権利確定日をフォーマットし、過去かどうかを判定
  const exDateInfo = useMemo(() => {
    if (!nextExDate) return null;

    try {
      const date = new Date(nextExDate);
      const today = new Date();
      const isPast = date < today;

      const formattedDate = date.toLocaleDateString('ja-JP', {
        month: 'long',
        day: 'numeric',
      });

      return {
        formattedDate,
        isPast,
        rawDate: date,
      };
    } catch {
      return null;
    }
  }, [nextExDate]);

  const getTrendIcon = () => {
    switch (dividendTrend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />;
      case 'decreasing':
        return <TrendingUp className="w-4 h-4 text-[var(--color-danger)] rotate-180" />;
      default:
        return <DollarSign className="w-4 h-4 text-[var(--color-lp-blue)]" />;
    }
  };

  const getTrendText = () => {
    switch (dividendTrend) {
      case 'increasing':
        return '安定増配中';
      case 'decreasing':
        return '減配傾向';
      default:
        return '安定配当';
    }
  };

  return (
    <div
      className={`bg-[var(--color-surface)] rounded-2xl p-6 shadow-lg dark:bg-[var(--color-surface-2)] dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
            配当情報 (Dividends)
          </h3>
          <Tooltip
            content={`配当情報は、企業が株主に対して支払う利益の分配に関する情報です。

【配当利回り】
配当利回り = 年間配当額 ÷ 株価 × 100

【見方のポイント】
• 高い配当利回りは魅力的ですが、持続可能性も重要
• 配当の安定性や成長性を確認することが大切
• 業種によって適正水準は異なります

【配当推移の見方】
• 安定増配：毎年配当が増加している状態
• 安定配当：配当額が一定で安定している状態
• 減配傾向：配当額が減少している状態

【権利確定日】
配当を受け取る権利を得るために株式を保有している必要がある日付です。この日に株式を保有していれば配当を受け取ることができます。`}
            title="配当情報について"
          >
            <span></span>
          </Tooltip>
        </div>
        <DollarSign className="w-5 h-5 text-[var(--color-lp-mint)]" />
      </div>

      {/* 現在の配当利回り */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-[var(--color-lp-mint)] mb-2">
          {currentYield.toFixed(2)}%
        </div>
        <div className="flex items-center justify-center">
          {getTrendIcon()}
          <span className="ml-2 text-sm text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)]">
            {getTrendText()}
          </span>
        </div>
      </div>

      {/* 配当推移棒グラフ */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-text-secondary)] mb-4">
          配当推移（最新5年）
        </h4>
        <div className="flex items-end justify-between space-x-2 h-[120px] mb-4">
          {dividendHistory.slice(-5).map((data, index) => {
            const height = maxDividend > 0 ? (data.dividend / maxDividend) * 70 + 15 : 15; // 最小15px、最大85px（高さを調整）

            return (
              <div key={data.year} className="flex flex-col items-center flex-1">
                <div
                  className={`w-full rounded-t-lg transition-all duration-1000 ease-out ${
                    data.isEstimate
                      ? 'bg-[var(--color-lp-blue)]/50 border-2 border-dashed border-[var(--color-lp-blue)]'
                      : 'bg-[var(--color-lp-mint)]'
                  }`}
                  style={{
                    height: `${height}px`,
                    transform: 'scaleY(0)',
                    transformOrigin: 'bottom',
                    animation: `bar-grow 0.8s ease-out ${index * 0.1}s forwards`,
                  }}
                />
              </div>
            );
          })}
        </div>
        {/* 年と配当額の表示を分離 */}
        <div className="flex justify-between space-x-2 mb-2">
          {dividendHistory.slice(-5).map((data) => (
            <div key={`year-${data.year}`} className="flex-1 text-center">
              <div className="text-xs text-[var(--color-gray-400)]">
                {data.year}
                {data.isEstimate && <span className="text-[var(--color-lp-blue)] ml-1">*</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between space-x-2">
          {dividendHistory.slice(-5).map((data) => (
            <div key={`amount-${data.year}`} className="flex-1 text-center">
              <div className="text-xs font-medium text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)]">
                ¥{data.dividend}
              </div>
            </div>
          ))}
        </div>
        {dividendHistory.some((data) => data.isEstimate) && (
          <p className="text-xs text-[var(--color-gray-400)] mt-2">* 予想値</p>
        )}
      </div>

      {/* 減配分析結果 */}
      {dividendAnalysis && dividendAnalysis.stability !== 'insufficient-data' && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-text-secondary)] mb-4">
            配当安定性分析（過去{dividendAnalysis.totalYears}年）
          </h4>

          {/* 安定性スコア */}
          <div className="flex items-center justify-between mb-4 p-4 rounded-xl bg-[var(--color-lp-off-white)] dark:bg-[var(--color-surface-3)]">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-3 ${
                  dividendAnalysis.stability === 'excellent'
                    ? 'bg-green-500'
                    : dividendAnalysis.stability === 'good'
                      ? 'bg-blue-500'
                      : dividendAnalysis.stability === 'stable'
                        ? 'bg-[var(--color-lp-mint)]'
                        : dividendAnalysis.stability === 'moderate'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                }`}
              />
              <span className="text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-text-secondary)]">
                {dividendAnalysis.stability === 'excellent'
                  ? '優秀'
                  : dividendAnalysis.stability === 'good'
                    ? '良好'
                    : dividendAnalysis.stability === 'stable'
                      ? '安定'
                      : dividendAnalysis.stability === 'moderate'
                        ? '普通'
                        : '不安定'}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-[var(--color-gray-500)] dark:text-[var(--color-text-muted)]">
                平均成長率
              </div>
              <div
                className={`text-sm font-semibold ${
                  dividendAnalysis.averageGrowthRate > 0
                    ? 'text-[var(--color-success)]'
                    : dividendAnalysis.averageGrowthRate < 0
                      ? 'text-[var(--color-danger)]'
                      : 'text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)]'
                }`}
              >
                {dividendAnalysis.averageGrowthRate > 0 ? '+' : ''}
                {dividendAnalysis.averageGrowthRate}%
              </div>
            </div>
          </div>

          {/* 減配実績 */}
          {dividendAnalysis.hasDividendCuts ? (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-4 h-4 text-red-500 rotate-180 mr-2" />
                <span className="text-sm font-medium text-red-700 dark:text-red-400">
                  減配実績あり（{dividendAnalysis.dividendCutCount}回）
                </span>
              </div>
              <div className="space-y-2">
                {dividendAnalysis.dividendCutYears.map((cut) => (
                  <div key={cut.year} className="text-xs text-red-600 dark:text-red-400">
                    {cut.year}年: ¥{cut.previousDividend} → ¥{cut.currentDividend}
                    <span className="ml-2 font-medium">(-{cut.cutPercentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  減配実績なし
                </span>
                {dividendAnalysis.consecutiveGrowthYears > 0 && (
                  <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                    （連続増配{dividendAnalysis.consecutiveGrowthYears}年）
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 次の権利確定日 */}
      {exDateInfo && (
        <div
          className={`rounded-xl p-4 border ${
            exDateInfo.isPast
              ? 'bg-[var(--color-gray-100)] dark:bg-[var(--color-surface-3)] border-[var(--color-gray-300)] dark:border-[var(--color-surface-4)]'
              : 'bg-[var(--color-lp-blue)]/5 dark:bg-[var(--color-lp-blue)]/10 border-[var(--color-lp-blue)]/20 dark:border-[var(--color-lp-blue)]/30'
          }`}
        >
          <div className="flex items-center">
            <Calendar
              className={`w-4 h-4 mr-2 ${
                exDateInfo.isPast ? 'text-[var(--color-gray-500)]' : 'text-[var(--color-lp-blue)]'
              }`}
            />
            <span className="text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-text-secondary)]">
              {exDateInfo.isPast ? '前回の権利確定日' : '次の権利確定日'}
            </span>
            {exDateInfo.isPast && (
              <span className="ml-2 text-xs bg-[var(--color-gray-200)] dark:bg-[var(--color-surface-4)] text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)] px-2 py-1 rounded-full">
                過去
              </span>
            )}
          </div>
          <p
            className={`text-lg font-semibold mt-1 ${
              exDateInfo.isPast
                ? 'text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)]'
                : 'text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]'
            }`}
          >
            {exDateInfo.formattedDate}
          </p>
          {annualDividend && (
            <p className="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)] mt-1">
              年間配当予想: ¥{annualDividend}
            </p>
          )}
          {exDateInfo.isPast && (
            <p className="text-xs text-[var(--color-gray-500)] dark:text-[var(--color-text-muted)] mt-2">
              ※ この日付は過去のものです。最新の配当情報については企業の発表をご確認ください。
            </p>
          )}
        </div>
      )}
    </div>
  );
}
