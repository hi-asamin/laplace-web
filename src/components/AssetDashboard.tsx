'use client';

import { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

// 型定義
interface SectorData {
  name: string;
  value: number;
  color: string;
}

interface AssetGrowthData {
  date: string;
  value: number;
}

interface HoldingData {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  gainLoss: number;
  gainLossPercent: number;
  dividendYield: number;
  portfolioWeight: number;
}

// ① カウントアップアニメーション数値表示コンポーネント
const AnimatedNumber = ({
  value,
  prefix = '',
  suffix = '',
  className = '',
  duration = 2000,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // イージング関数（ease-out）
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(value * easeOut);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

// ② セクター別資産割合ドーナツチャート
const SectorAllocationChart = ({ data }: { data: SectorData[] }) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // ドーナツチャートのSVGパスを生成
  const createDonutSlice = (
    startAngle: number,
    endAngle: number,
    innerRadius: number,
    outerRadius: number,
    progress: number = 1
  ) => {
    const actualEndAngle = startAngle + (endAngle - startAngle) * progress;

    if (actualEndAngle <= startAngle) return '';

    const x1 = Math.cos(startAngle) * outerRadius;
    const y1 = Math.sin(startAngle) * outerRadius;
    const x2 = Math.cos(actualEndAngle) * outerRadius;
    const y2 = Math.sin(actualEndAngle) * outerRadius;

    const x3 = Math.cos(actualEndAngle) * innerRadius;
    const y3 = Math.sin(actualEndAngle) * innerRadius;
    const x4 = Math.cos(startAngle) * innerRadius;
    const y4 = Math.sin(startAngle) * innerRadius;

    const largeArcFlag = actualEndAngle - startAngle > Math.PI ? 1 : 0;

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -Math.PI / 2; // 12時方向から開始

  const segments = data.map((item, index) => {
    const startAngle = currentAngle;
    const endAngle = currentAngle + (item.value / totalValue) * 2 * Math.PI;

    // アニメーション進行率
    const segmentProgress = Math.max(0, Math.min(1, (animationProgress - index * 10) / 30));

    const path = createDonutSlice(startAngle, endAngle, 60, 100, segmentProgress);

    currentAngle = endAngle;

    return {
      ...item,
      path,
      startAngle,
      endAngle,
      index,
    };
  });

  return (
    <div className="flex items-center gap-8">
      {/* ドーナツチャート */}
      <div className="relative w-48 h-48 flex-shrink-0">
        <svg viewBox="-120 -120 240 240" className="w-full h-full">
          {segments.map((segment) => (
            <g key={segment.index}>
              <path
                d={segment.path}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                style={{
                  filter:
                    hoveredSegment === segment.index
                      ? 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
                      : 'none',
                  transform: hoveredSegment === segment.index ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: 'center',
                  transition: 'all 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredSegment(segment.index)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            </g>
          ))}

          {/* 中央のラベル */}
          <g>
            <text
              x="0"
              y="-5"
              textAnchor="middle"
              className="text-sm font-bold fill-[var(--color-lp-navy)] dark:fill-[var(--color-text-primary)]"
            >
              セクター分散
            </text>
            <text
              x="0"
              y="15"
              textAnchor="middle"
              className="text-xs fill-slate-500 dark:fill-[var(--color-text-muted)]"
            >
              {data.length}分野
            </text>
          </g>
        </svg>
      </div>

      {/* 凡例 */}
      <div className="flex-1 space-y-3">
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer ${
              hoveredSegment === index
                ? 'bg-gray-50 dark:bg-[var(--color-surface-3)] scale-105 shadow-sm'
                : 'hover:bg-gray-50 dark:hover:bg-[var(--color-surface-3)]'
            }`}
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1">
              <div className="font-semibold text-sm text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                {item.name}
              </div>
              <div className="text-[var(--color-lp-mint)] font-bold text-lg">{item.value}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ③ 資産推移面積グラフ
const AssetGrowthChart = ({ data }: { data: AssetGrowthData[] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('1年');
  const [animationProgress, setAnimationProgress] = useState(0);

  const periods = ['6ヶ月', '年初来', '1年', '全期間'];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  // データの最大値と最小値を計算
  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue;

  // SVGパスを生成
  const generatePath = (data: AssetGrowthData[], progress: number = 1) => {
    if (data.length === 0) return '';

    const width = 400;
    const height = 200;
    const padding = 20;

    const effectiveData = data.slice(0, Math.floor(data.length * progress));
    if (effectiveData.length === 0) return '';

    let path = '';

    effectiveData.forEach((point, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
      const y = padding + ((maxValue - point.value) / range) * (height - 2 * padding);

      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        // スムーズな曲線を描くためのベジェ曲線
        const prevPoint = effectiveData[index - 1];
        const prevX = padding + ((index - 1) / (data.length - 1)) * (width - 2 * padding);
        const prevY = padding + ((maxValue - prevPoint.value) / range) * (height - 2 * padding);

        const cp1x = prevX + (x - prevX) / 3;
        const cp1y = prevY;
        const cp2x = x - (x - prevX) / 3;
        const cp2y = y;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
      }
    });

    // 面積を作るために底辺に線を描く
    if (effectiveData.length > 0) {
      const lastX =
        padding + ((effectiveData.length - 1) / (data.length - 1)) * (width - 2 * padding);
      const firstX = padding;
      path += ` L ${lastX} ${height - padding} L ${firstX} ${height - padding} Z`;
    }

    return path;
  };

  const chartPath = generatePath(data, animationProgress / 100);

  return (
    <div className="space-y-4">
      {/* 期間選択タブ */}
      <div className="flex gap-2">
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedPeriod === period
                ? 'bg-[var(--color-lp-mint)] text-white dark:text-slate-900'
                : 'bg-gray-100 dark:bg-[var(--color-surface-3)] text-slate-600 dark:text-[var(--color-text-secondary)] hover:bg-gray-200 dark:hover:bg-[var(--color-surface-4)]'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* チャート */}
      <div className="relative">
        <svg viewBox="0 0 400 200" className="w-full h-48">
          {/* グリッドライン */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-lp-mint)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-lp-mint)" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Y軸のグリッドライン */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <g key={percent}>
              <line
                x1="20"
                y1={20 + (percent / 100) * 160}
                x2="380"
                y2={20 + (percent / 100) * 160}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* 面積グラフ */}
          <path
            d={chartPath}
            fill="url(#areaGradient)"
            stroke="var(--color-lp-mint)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* データポイント */}
          {data
            .slice(0, Math.floor((data.length * animationProgress) / 100))
            .map((point, index) => (
              <circle
                key={index}
                cx={20 + (index / (data.length - 1)) * 360}
                cy={20 + ((maxValue - point.value) / range) * 160}
                r="3"
                fill="var(--color-lp-mint)"
                className="hover:r-5 transition-all cursor-pointer"
              />
            ))}
        </svg>

        {/* 値の表示 */}
        <div className="flex justify-between text-xs text-slate-500 dark:text-[var(--color-text-muted)] mt-2">
          <span>¥{minValue.toLocaleString()}</span>
          <span>¥{maxValue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

// ④ 保有銘柄一覧テーブル
const HoldingsTable = ({ data }: { data: HoldingData[] }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof HoldingData | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // ソート処理
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // ソートハンドラー
  const handleSort = (key: keyof HoldingData) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  // ソートアイコン
  const SortIcon = ({ column }: { column: keyof HoldingData }) => {
    if (sortConfig.key !== column) {
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-[var(--color-surface-3)]">
            <th
              className="text-left py-3 px-4 font-semibold text-sm text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] cursor-pointer hover:bg-gray-50 dark:hover:bg-[var(--color-surface-3)] rounded-lg transition-colors"
              onClick={() => handleSort('symbol')}
            >
              <div className="flex items-center gap-2">
                銘柄
                <SortIcon column="symbol" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 font-semibold text-sm text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] cursor-pointer hover:bg-gray-50 dark:hover:bg-[var(--color-surface-3)] rounded-lg transition-colors"
              onClick={() => handleSort('quantity')}
            >
              <div className="flex items-center justify-end gap-2">
                保有数
                <SortIcon column="quantity" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 font-semibold text-sm text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] cursor-pointer hover:bg-gray-50 dark:hover:bg-[var(--color-surface-3)] rounded-lg transition-colors"
              onClick={() => handleSort('avgPrice')}
            >
              <div className="flex items-center justify-end gap-2">
                平均取得単価
                <SortIcon column="avgPrice" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 font-semibold text-sm text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] cursor-pointer hover:bg-gray-50 dark:hover:bg-[var(--color-surface-3)] rounded-lg transition-colors"
              onClick={() => handleSort('currentPrice')}
            >
              <div className="flex items-center justify-end gap-2">
                現在値
                <SortIcon column="currentPrice" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 font-semibold text-sm text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] cursor-pointer hover:bg-gray-50 dark:hover:bg-[var(--color-surface-3)] rounded-lg transition-colors"
              onClick={() => handleSort('marketValue')}
            >
              <div className="flex items-center justify-end gap-2">
                評価額
                <SortIcon column="marketValue" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 font-semibold text-sm text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] cursor-pointer hover:bg-gray-50 dark:hover:bg-[var(--color-surface-3)] rounded-lg transition-colors"
              onClick={() => handleSort('gainLossPercent')}
            >
              <div className="flex items-center justify-end gap-2">
                評価損益
                <SortIcon column="gainLossPercent" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 font-semibold text-sm text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] cursor-pointer hover:bg-gray-50 dark:hover:bg-[var(--color-surface-3)] rounded-lg transition-colors"
              onClick={() => handleSort('dividendYield')}
            >
              <div className="flex items-center justify-end gap-2">
                配当利回り
                <SortIcon column="dividendYield" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 font-semibold text-sm text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] cursor-pointer hover:bg-gray-50 dark:hover:bg-[var(--color-surface-3)] rounded-lg transition-colors"
              onClick={() => handleSort('portfolioWeight')}
            >
              <div className="flex items-center justify-end gap-2">
                構成比率
                <SortIcon column="portfolioWeight" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((holding, index) => (
            <tr
              key={holding.symbol}
              className="border-b border-gray-100 dark:border-[var(--color-surface-3)] hover:bg-gray-50 dark:hover:bg-[var(--color-surface-3)] transition-colors cursor-pointer"
              onClick={() => {
                // 将来的に銘柄詳細ページへの遷移を実装
                console.log(`Navigate to ${holding.symbol} details`);
              }}
            >
              <td className="py-4 px-4">
                <div>
                  <div className="font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                    {holding.symbol}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-[var(--color-text-muted)]">
                    {holding.name}
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-right font-medium text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                {holding.quantity}
              </td>
              <td className="py-4 px-4 text-right font-medium text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                ${holding.avgPrice.toFixed(2)}
              </td>
              <td className="py-4 px-4 text-right font-medium text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                ${holding.currentPrice.toFixed(2)}
              </td>
              <td className="py-4 px-4 text-right font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                ¥{holding.marketValue.toLocaleString()}
              </td>
              <td className="py-4 px-4 text-right">
                <div
                  className={`flex items-center justify-end gap-1 ${
                    holding.gainLoss >= 0
                      ? 'text-[var(--color-success)]'
                      : 'text-[var(--color-danger)]'
                  }`}
                >
                  {holding.gainLoss >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <div>
                    <div className="font-semibold">
                      {holding.gainLoss >= 0 ? '+' : ''}¥
                      {Math.abs(holding.gainLoss).toLocaleString()}
                    </div>
                    <div className="text-sm">
                      ({holding.gainLoss >= 0 ? '+' : ''}
                      {holding.gainLossPercent.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-right font-medium text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                {holding.dividendYield.toFixed(2)}%
              </td>
              <td className="py-4 px-4 text-right font-medium text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                {holding.portfolioWeight.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 個別エクスポート
export { AnimatedNumber, SectorAllocationChart, AssetGrowthChart, HoldingsTable };

// オブジェクトエクスポート
export const AssetDashboardComponents = {
  AnimatedNumber,
  SectorAllocationChart,
  AssetGrowthChart,
  HoldingsTable,
};
