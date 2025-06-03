import Image from 'next/image';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface RelatedMarketCardProps {
  logoUrl: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  miniChartData?: number[]; // 価格推移データ（省略可）
  onClick?: () => void;
}

export default function RelatedMarketCard({
  logoUrl,
  name,
  symbol,
  price,
  change,
  changePercent,
  isPositive,
  miniChartData = [],
  onClick,
}: RelatedMarketCardProps) {
  // ミニチャート用のSVGパス生成
  const chartWidth = 90;
  const chartHeight = 40;
  let chartPath = '';
  if (miniChartData.length > 1) {
    const min = Math.min(...miniChartData);
    const max = Math.max(...miniChartData);
    const range = max - min || 1;
    chartPath = miniChartData
      .map((v, i) => {
        const x = (i / (miniChartData.length - 1)) * chartWidth;
        const y = chartHeight - ((v - min) / range) * (chartHeight - 8) - 4;
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
  }

  return (
    <div
      className="bg-[#F3F8FC] rounded-2xl p-3 flex flex-col justify-between min-w-[200px] max-w-[240px] h-[120px] shadow-sm cursor-pointer transition hover:shadow-md overflow-hidden"
      onClick={onClick}
      style={{ boxSizing: 'border-box' }}
    >
      <div className="flex items-center gap-2 mb-1 overflow-hidden">
        <Image
          src={logoUrl}
          alt={name}
          width={28}
          height={28}
          className="w-7 h-7 rounded-full bg-white object-contain flex-shrink-0"
        />
        <span className="font-bold text-[16px] text-[var(--color-gray-900)] mr-1 truncate max-w-[80px]">
          {name}
        </span>
        <span className="text-[13px] text-[var(--color-gray-400)] truncate">({symbol})</span>
      </div>
      <div className="flex items-end justify-between flex-1 w-full">
        <div className="min-w-0">
          <div className="text-[22px] font-bold text-[var(--color-gray-900)] leading-none truncate max-w-[110px]">
            {price}
          </div>
          <div
            className={`flex items-center text-[14px] font-semibold ${isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}
            style={{ lineHeight: 1.1 }}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4 mr-0.5" color="var(--color-success)" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-0.5" color="var(--color-danger)" />
            )}
            <span className="truncate">
              {change} ({changePercent})
            </span>
          </div>
        </div>
        {/* ミニチャート */}
        <svg
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="ml-2 flex-shrink-0"
          aria-hidden="true"
        >
          {miniChartData.length > 1 && (
            <path
              d={chartPath}
              fill="none"
              stroke={isPositive ? 'var(--color-success)' : 'var(--color-danger)'}
              strokeWidth={2}
            />
          )}
        </svg>
      </div>
    </div>
  );
}
