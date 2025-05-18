import { useRef, useState } from 'react';
import { WithdrawalYearData } from '@/types/simulation';

interface WithdrawalChartProps {
  data: WithdrawalYearData[];
}

export default function WithdrawalChart({ data }: WithdrawalChartProps) {
  const chartRef = useRef<SVGSVGElement>(null);
  const [selectedPoint, setSelectedPoint] = useState<{
    year: number;
    remainingBalance: number;
    withdrawalAmount: number;
    taxAmount: number;
    x: number;
    y: number;
  } | null>(null);

  // チャートのパスを生成
  const generateChartPath = () => {
    if (!data || data.length === 0) return { linePath: '', areaPath: '' };

    const width = 400;
    const height = 160;
    const padding = 10;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // 残高の最大値・最小値を計算
    const values = data.map((d) => d.remainingBalance);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const valueMargin = (max - min) * 0.1;
    const effectiveMin = min - valueMargin;
    const effectiveMax = max + valueMargin;
    const valueRange = effectiveMax - effectiveMin;

    // 各データポイントの位置を計算
    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y =
        padding + chartHeight - ((d.remainingBalance - effectiveMin) / valueRange) * chartHeight;
      return { x, y, data: d };
    });

    // 線のパス
    let linePath = '';
    if (points.length > 0) {
      linePath = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        linePath += ` L ${points[i].x} ${points[i].y}`;
      }
    }

    // 塗りつぶし領域のパス
    let areaPath = '';
    if (points.length > 0) {
      areaPath = linePath;
      areaPath += ` L ${points[points.length - 1].x} ${height - padding}`;
      areaPath += ` L ${points[0].x} ${height - padding}`;
      areaPath += ' Z';
    }

    return { linePath, areaPath, points };
  };

  const { linePath, areaPath, points } = generateChartPath();

  return (
    <div className="relative h-[200px] sm:h-[260px] lg:h-[320px] mb-6 rounded-lg">
      {/* 凡例 */}
      <div className="absolute left-4 top-2 flex gap-4 z-10 text-xs sm:text-sm">
        <span className="flex items-center gap-1">
          <span
            style={{
              display: 'inline-block',
              width: 16,
              height: 8,
              background: 'rgba(89,101,255,0.13)',
              borderRadius: 2,
            }}
          ></span>
          <span className="text-[var(--color-gray-700)]">残高</span>
        </span>
        <span className="flex items-center gap-1">
          <span
            style={{
              display: 'inline-block',
              width: 16,
              height: 8,
              background: 'rgba(89,101,255,0.38)',
              borderRadius: 2,
            }}
          ></span>
          <span className="text-[var(--color-gray-700)]">取り崩し額</span>
        </span>
      </div>

      {/* チャート */}
      <svg
        ref={chartRef}
        className="w-full h-full"
        viewBox="0 0 400 160"
        preserveAspectRatio="none"
        onClick={(e) => {
          if (!points || points.length === 0) return;

          const svg = e.currentTarget;
          const rect = svg.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 400;

          // クリック位置に最も近いポイントを探す
          const pointWidth = (400 - 20) / (points.length - 1);
          const dataIndex = Math.round((x - 10) / pointWidth);
          const validIndex = Math.max(0, Math.min(dataIndex, points.length - 1));
          const point = points[validIndex];

          setSelectedPoint({
            year: point.data.year,
            remainingBalance: point.data.remainingBalance,
            withdrawalAmount: point.data.withdrawalAmount,
            taxAmount: point.data.taxAmount,
            x: point.x,
            y: point.y,
          });
        }}
      >
        {/* 取り崩し額エリア */}
        {points && points.length > 0 && (
          <path
            d={areaPath}
            fill="rgba(89,101,255,0.38)"
            className="chart-area-animation"
            style={{
              opacity: 0,
              animation: 'chart-area-fade 0.5s ease-in-out 1s forwards',
            }}
          />
        )}

        {/* 残高の線 */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
            className="chart-line-animation"
            style={{
              strokeDasharray: '1000',
              strokeDashoffset: '1000',
              animation: 'chart-line-draw 1.5s ease-in-out forwards',
            }}
          />
        )}

        {/* 選択したポイントのマーカー */}
        {selectedPoint && (
          <>
            <line
              x1={selectedPoint.x}
              y1="10"
              x2={selectedPoint.x}
              y2="150"
              stroke="var(--color-primary)"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <circle
              cx={selectedPoint.x}
              cy={selectedPoint.y}
              r="4"
              fill="var(--color-primary)"
              stroke="white"
              strokeWidth="2"
            />
          </>
        )}
      </svg>

      {/* 選択したポイントの情報表示 */}
      {selectedPoint && (
        <div
          className="absolute left-1/2 top-0 bg-[var(--color-surface)] px-3 py-2 rounded-lg shadow-md text-center transform -translate-x-1/2 -translate-y-[calc(100%+5px)]"
          style={{
            left: `${(selectedPoint.x / 400) * 100}%`,
            maxWidth: '180px',
          }}
        >
          <div className="text-xs text-[var(--color-gray-400)]">{selectedPoint.year}年目</div>
          <div className="text-xs text-[var(--color-gray-700)] flex flex-col gap-1 mt-1">
            <span>
              <span
                className="inline-block w-2 h-2 rounded-sm mr-1 align-middle"
                style={{ background: 'rgba(89,101,255,0.13)' }}
              ></span>
              残高:{' '}
              <span className="font-medium text-[var(--color-gray-900)]">
                ¥{Math.round(selectedPoint.remainingBalance).toLocaleString()}
              </span>
            </span>
            <span>
              <span
                className="inline-block w-2 h-2 rounded-sm mr-1 align-middle"
                style={{ background: 'rgba(89,101,255,0.38)' }}
              ></span>
              取り崩し額:{' '}
              <span className="font-medium text-[var(--color-gray-900)]">
                ¥{Math.round(selectedPoint.withdrawalAmount).toLocaleString()}
              </span>
            </span>
            <span>
              <span
                className="inline-block w-2 h-2 rounded-sm mr-1 align-middle"
                style={{ background: 'var(--color-error)' }}
              ></span>
              課税額:{' '}
              <span className="font-medium text-[var(--color-error)]">
                ¥{Math.round(selectedPoint.taxAmount).toLocaleString()}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
