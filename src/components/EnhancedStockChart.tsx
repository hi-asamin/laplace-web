'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { generateChartPath } from '@/utils/chart';
import Tooltip from '@/components/tooltip';

interface ChartDataPoint {
  date: string;
  close: number;
}

interface EnhancedStockChartProps {
  data: ChartDataPoint[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  className?: string;
}

const PERIOD_OPTIONS = [
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
  { value: '2Y', label: '2Y' },
  { value: '5Y', label: '5Y' },
  { value: '10Y', label: '10Y' },
  { value: 'ALL', label: 'ALL' },
];

export default function EnhancedStockChart({
  data,
  selectedPeriod,
  onPeriodChange,
  className = '',
}: EnhancedStockChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    data: ChartDataPoint;
    x: number;
    y: number;
  } | null>(null);

  const chartRef = useRef<SVGSVGElement>(null);

  // チャートデータの処理
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const prices = data.map((d) => d.close);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      prices,
      minPrice,
      maxPrice,
      priceRange: maxPrice - minPrice,
    };
  }, [data]);

  // チャートパスの生成
  const chartPaths = useMemo(() => {
    if (!data || data.length < 2 || !processedData) {
      return { linePath: '', areaPath: '' };
    }

    try {
      const chartData = data.map((d) => ({ date: d.date, close: d.close }));
      const paths = generateChartPath(chartData as any, 400, 200);
      return paths;
    } catch (err) {
      console.error('チャートパス生成エラー:', err);
      return { linePath: '', areaPath: '' };
    }
  }, [data, processedData]);

  // マウスイベントハンドラー
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!data || !chartRef.current) return;

      const rect = chartRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 400;

      const dataIndex = Math.round(((x - 10) / 380) * (data.length - 1));
      const validIndex = Math.max(0, Math.min(dataIndex, data.length - 1));

      if (data[validIndex]) {
        setHoveredPoint({
          data: data[validIndex],
          x: 10 + (validIndex / (data.length - 1)) * 380,
          y: e.clientY - rect.top,
        });
      }
    },
    [data]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredPoint(null);
  }, []);

  return (
    <div
      className={`bg-[var(--color-surface)] rounded-2xl p-6 shadow-lg dark:bg-[var(--color-surface-2)] dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
            株価チャート (Price Chart)
          </h3>
          <Tooltip
            content={`株価チャートは、時系列での株価の推移を視覚的に表示したものです。

【チャートの見方】
• 線の傾きで株価のトレンドを把握できます
• 上昇トレンド：右肩上がりの線
• 下降トレンド：右肩下がりの線
• 横ばい：水平に近い線

【期間選択の活用】
• 1D〜1W：短期的な値動きの確認
• 1M〜6M：中期的なトレンド分析
• 1Y〜5Y：長期的な成長性の評価
• 10Y〜ALL：企業の歴史的な株価推移

【チャート分析のポイント】
• 過去の高値・安値の水準を確認
• 長期的な成長トレンドの把握
• 市場全体との比較検討

【注意事項】
• 過去の株価推移は将来の値動きを保証するものではありません
• 他の財務指標と合わせて総合的に判断することが重要です`}
            title="株価チャートについて"
          >
            <span></span>
          </Tooltip>
        </div>
      </div>

      {/* 期間選択タブ */}
      <div className="flex justify-between w-full mb-6 overflow-x-auto no-scrollbar gap-1">
        {PERIOD_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 min-w-[50px] relative ${
              selectedPeriod === option.value
                ? 'bg-[var(--color-lp-mint)]/10 text-[var(--color-lp-mint)] font-semibold border-2 border-[var(--color-lp-mint)] shadow-sm'
                : 'text-[var(--color-gray-400)] hover:text-[var(--color-lp-mint)] hover:bg-[var(--color-lp-mint)]/5 border-2 border-transparent'
            }`}
            onClick={() => onPeriodChange(option.value)}
          >
            {option.label}
            {selectedPeriod === option.value && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-[var(--color-lp-mint)] rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* チャート */}
      <div className="relative">
        {data && data.length >= 2 ? (
          <svg
            ref={chartRef}
            className="w-full"
            viewBox="0 0 400 220"
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* 価格チャート */}
            <g>
              {/* エリアチャート */}
              {chartPaths.areaPath && (
                <path d={chartPaths.areaPath} fill="url(#priceGradient)" className="opacity-20" />
              )}
              {/* ラインチャート */}
              {chartPaths.linePath && (
                <path
                  d={chartPaths.linePath}
                  fill="none"
                  stroke="var(--color-lp-mint)"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                />
              )}
            </g>

            {/* ホバー時の縦線とポイント */}
            {hoveredPoint && (
              <g>
                <line
                  x1={hoveredPoint.x}
                  y1="10"
                  x2={hoveredPoint.x}
                  y2="210"
                  stroke="var(--color-lp-mint)"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.7"
                />
                <circle
                  cx={hoveredPoint.x}
                  cy={
                    10 +
                    180 -
                    ((hoveredPoint.data.close - (processedData?.minPrice || 0)) /
                      (processedData?.priceRange || 1)) *
                      180
                  }
                  r="4"
                  fill="var(--color-lp-mint)"
                  stroke="white"
                  strokeWidth="2"
                />
              </g>
            )}

            {/* グラデーション定義 */}
            <defs>
              <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--color-lp-mint)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--color-lp-mint)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        ) : (
          <div className="flex items-center justify-center h-64 text-[var(--color-gray-400)]">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">この期間のチャートデータはありません</p>
            </div>
          </div>
        )}

        {/* ホバー時の情報表示 */}
        {hoveredPoint && (
          <div
            className="absolute bg-[var(--color-surface)] dark:bg-[var(--color-surface-3)] px-3 py-2 rounded-lg shadow-lg border border-[var(--color-surface-alt)] dark:border-[var(--color-surface-3)] pointer-events-none z-10"
            style={{
              left: `${(hoveredPoint.x / 400) * 100}%`,
              top: '10px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-xs text-[var(--color-gray-400)] mb-1">
              {new Date(hoveredPoint.data.date).toLocaleDateString('ja-JP')}
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between space-x-4">
                <span className="text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)]">
                  終値:
                </span>
                <span className="font-medium text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)]">
                  ¥{hoveredPoint.data.close.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
