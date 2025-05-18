import { useState, useEffect, useRef } from 'react';
import {
  WithdrawalPlan as WithdrawalPlanType,
  WithdrawalYearData,
  NisaTaxEffect,
} from '@/types/simulation';
import {
  calculateWithdrawalSimulation,
  calculateNisaTaxEffect,
} from '@/utils/withdrawalSimulation';
import Tooltip from '@/components/tooltip';

interface WithdrawalPlanProps {
  finalBalance: number;
  annualRate: number;
  mode?: 'chart' | 'input' | 'full';
}

export default function WithdrawalPlan({
  finalBalance,
  annualRate,
  mode = 'full',
}: WithdrawalPlanProps) {
  const [withdrawalPlan, setWithdrawalPlan] = useState<WithdrawalPlanType>({
    startAge: 65,
    endAge: 85,
    monthlyAmount: 100000,
    withdrawalType: 'fixed',
  });

  const [withdrawalData, setWithdrawalData] = useState<WithdrawalYearData[]>([]);
  const [nisaTaxEffect, setNisaTaxEffect] = useState<NisaTaxEffect | null>(null);

  const chartRef = useRef<SVGSVGElement>(null);
  const [selectedPoint, setSelectedPoint] = useState<{
    year: number;
    remainingBalance: number;
    withdrawalAmount: number;
    taxAmount: number;
    x: number;
    y: number;
  } | null>(null);

  const chartAreaClipId = 'withdrawal-chart-area-clip';
  const chartLineClass = 'withdrawal-chart-line-animation';

  useEffect(() => {
    const data = calculateWithdrawalSimulation(finalBalance, withdrawalPlan, annualRate);
    setWithdrawalData(data);
    setNisaTaxEffect(calculateNisaTaxEffect(data));
  }, [finalBalance, withdrawalPlan, annualRate]);

  // チャート外部クリックで選択解除
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
        setSelectedPoint(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // チャートアニメーション制御
  useEffect(() => {
    if (!(mode === 'chart' || mode === 'full')) return;
    const rect = document.getElementById(`${chartAreaClipId}-rect`);
    if (rect) {
      rect.setAttribute('width', '0');
      requestAnimationFrame(() => {
        rect.style.transition = 'width 1.5s cubic-bezier(0.4,0,0.2,1)';
        rect.setAttribute('width', '400');
      });
    }
    const line = document.querySelector(`.${chartLineClass}`);
    if (line) {
      (line as HTMLElement).style.animation = 'none';
      void (line as HTMLElement).offsetWidth;
      (line as HTMLElement).style.animation =
        'withdrawal-chart-line-draw 1.5s cubic-bezier(0.4,0,0.2,1) forwards';
    }
  }, [mode, withdrawalData]);

  return (
    <div className="lg:p-6 xl:p-8">
      {/* 取り崩し資産推移チャート */}
      {(mode === 'chart' || mode === 'full') && withdrawalData.length > 0 && (
        <div className="mb-8">
          <div className="relative h-[180px] sm:h-[220px] lg:h-[260px] rounded-lg bg-[var(--color-surface-alt)]">
            <svg
              ref={chartRef}
              className="w-full h-full"
              viewBox="0 0 400 140"
              preserveAspectRatio="none"
              onClick={(e) => {
                if (!withdrawalData || withdrawalData.length === 0) return;
                const svg = e.currentTarget;
                const rect = svg.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 400;
                const chartWidth = 400 - 20;
                const pointWidth = chartWidth / (withdrawalData.length - 1);
                const dataIndex = Math.round((x - 10) / pointWidth);
                const validIndex = Math.max(0, Math.min(dataIndex, withdrawalData.length - 1));
                const d = withdrawalData[validIndex];
                // Y座標計算
                const values = withdrawalData.map((d) => d.remainingBalance);
                const min = Math.min(...values);
                const max = Math.max(...values);
                const valueMargin = (max - min) * 0.1;
                const effectiveMin = min - valueMargin;
                const valueRange = (max - min) * 0.1 + (max - min);
                const chartHeight = 140 - 20;
                const y =
                  10 +
                  chartHeight -
                  ((d.remainingBalance - effectiveMin) / valueRange) * chartHeight;
                setSelectedPoint({
                  year: d.year,
                  remainingBalance: d.remainingBalance,
                  withdrawalAmount: d.withdrawalAmount,
                  taxAmount: d.taxAmount,
                  x: 10 + validIndex * pointWidth,
                  y,
                });
              }}
            >
              {/* アニメーション用clipPath */}
              <defs>
                <clipPath id={chartAreaClipId}>
                  <rect id={`${chartAreaClipId}-rect`} x="0" y="0" width="0" height="140" />
                </clipPath>
              </defs>
              {(() => {
                const data = withdrawalData;
                if (!data || data.length === 0) return null;
                // チャートスケール計算
                const values = data.map((d) => d.remainingBalance);
                const min = Math.min(...values);
                const max = Math.max(...values);
                const valueMargin = (max - min) * 0.1;
                const effectiveMin = min - valueMargin;
                const effectiveMax = max + valueMargin;
                const valueRange = effectiveMax - effectiveMin;
                const chartWidth = 400 - 20;
                const chartHeight = 140 - 20;
                // ポイント配列
                const points = data.map((d, i) => {
                  const x = 10 + (chartWidth / (data.length - 1)) * i;
                  const y =
                    10 +
                    chartHeight -
                    ((d.remainingBalance - effectiveMin) / valueRange) * chartHeight;
                  return { x, y, year: d.year };
                });
                // 折れ線パス
                let linePath = '';
                points.forEach((p, i) => {
                  linePath += i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`;
                });
                // エリアパス
                let areaPath = linePath;
                areaPath += `L${points[points.length - 1].x},${140 - 10}`;
                areaPath += `L${points[0].x},${140 - 10}Z`;
                // X軸ラベル
                const xLabels = [];
                if (data.length > 10) {
                  for (let i = 0; i < data.length; i++) {
                    const d = data[i];
                    if (d.year % 5 === 0) {
                      const x = 10 + (chartWidth / (data.length - 1)) * i;
                      xLabels.push(
                        <text
                          key={d.year}
                          x={x}
                          y={140 - 2}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#94A3B8"
                        >
                          {d.year}年
                        </text>
                      );
                    }
                  }
                } else {
                  for (let i = 0; i < data.length; i++) {
                    const d = data[i];
                    const x = 10 + (chartWidth / (data.length - 1)) * i;
                    xLabels.push(
                      <text
                        key={d.year}
                        x={x}
                        y={140 - 2}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#94A3B8"
                      >
                        {d.year}年
                      </text>
                    );
                  }
                }
                return (
                  <>
                    {/* X軸ラベル */}
                    {xLabels}
                    {/* エリア */}
                    <path
                      d={areaPath}
                      fill="rgba(89,101,255,0.13)"
                      clipPath={`url(#${chartAreaClipId})`}
                    />
                    {/* 折れ線 */}
                    <path
                      d={linePath}
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="2"
                      className={chartLineClass}
                      style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
                    />
                    {/* 選択ポイントのマーカー */}
                    {selectedPoint && (
                      <>
                        <line
                          x1={selectedPoint.x}
                          y1="10"
                          x2={selectedPoint.x}
                          y2="130"
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
                  </>
                );
              })()}
            </svg>
            {/* 選択ポイントの情報表示 */}
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
        </div>
      )}

      {/* 取り崩し設定 */}
      {(mode === 'input' || mode === 'full') && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <label className="block text-sm text-[var(--color-gray-400)] mb-1">
              取り崩し開始年齢
            </label>
            <select
              value={withdrawalPlan.startAge}
              onChange={(e) => {
                const v = Number(e.target.value);
                setWithdrawalPlan((prev) => ({
                  ...prev,
                  startAge: v,
                  endAge: Math.max(v + 5, prev.endAge), // 終了年齢が開始+5未満なら自動調整
                }));
              }}
              className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-lg text-base"
            >
              {[...Array(9)].map((_, i) => {
                const age = 40 + i * 5;
                return (
                  <option key={age} value={age}>
                    {age}歳
                  </option>
                );
              })}
            </select>
          </div>
          <div className="bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <label className="block text-sm text-[var(--color-gray-400)] mb-1">
              取り崩し終了年齢
            </label>
            <select
              value={withdrawalPlan.endAge}
              onChange={(e) =>
                setWithdrawalPlan((prev) => ({
                  ...prev,
                  endAge: Number(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-lg text-base"
            >
              {(() => {
                const options = [];
                for (let age = withdrawalPlan.startAge + 5; age <= 100; age += 5) {
                  options.push(
                    <option key={age} value={age}>
                      {age}歳
                    </option>
                  );
                }
                return options;
              })()}
            </select>
          </div>
          <div className="bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {withdrawalPlan.withdrawalType === 'fixed' ? (
              <>
                <label className="block text-sm text-[var(--color-gray-400)] mb-1">
                  月間取り崩し額
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={withdrawalPlan.monthlyAmount}
                    onChange={(e) =>
                      setWithdrawalPlan((prev) => ({
                        ...prev,
                        monthlyAmount: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-lg text-base"
                  />
                  <span className="text-base text-[var(--color-gray-700)]">円</span>
                </div>
              </>
            ) : (
              <>
                <label className="block text-sm text-[var(--color-gray-400)] mb-1">年率（%）</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={withdrawalPlan.monthlyAmount}
                    min={0}
                    max={100}
                    step={0.1}
                    onChange={(e) =>
                      setWithdrawalPlan((prev) => ({
                        ...prev,
                        monthlyAmount: Math.max(0, Math.min(100, Number(e.target.value))),
                      }))
                    }
                    className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-lg text-base"
                  />
                  <span className="text-base text-[var(--color-gray-700)]">%</span>
                </div>
              </>
            )}
          </div>
          <div className="bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <label className="block text-sm text-[var(--color-gray-400)] mb-1">
              取り崩しタイプ
              <Tooltip
                title="取り崩しタイプ"
                content={`定額取り崩し：毎年同じ金額を取り崩します。
定率取り崩し：残高に対して一定の割合を取り崩します。

【見方のポイント】
• 定額は「毎年決まった生活費を確保したい」場合に便利
• 定率は「資産寿命を延ばしたい」「残高に応じて柔軟に使いたい」場合に有効

【例】
• 定額：毎年120万円ずつ取り崩す
• 定率：毎年残高の4%ずつ取り崩す`}
              >
                <span className="sr-only">取り崩しタイプの説明</span>
              </Tooltip>
            </label>
            <select
              value={withdrawalPlan.withdrawalType}
              onChange={(e) =>
                setWithdrawalPlan((prev) => ({
                  ...prev,
                  withdrawalType: e.target.value as 'fixed' | 'percentage',
                }))
              }
              className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-lg text-base"
            >
              <option value="fixed">定額取り崩し</option>
              <option value="percentage">定率取り崩し</option>
            </select>
          </div>
        </div>
      )}
      <style>{`
        @keyframes withdrawal-chart-line-draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
