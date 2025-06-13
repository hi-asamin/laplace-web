'use client';

import { useRef, useState, useEffect } from 'react';
import { SimulationYearData, SimulationPurpose } from '@/types/simulationTypes';

interface SimulationChartProps {
  data: SimulationYearData[];
  purpose: SimulationPurpose;
  width?: number;
  height?: number;
}

export default function SimulationChart({
  data,
  purpose,
  width = 400,
  height = 300,
}: SimulationChartProps) {
  const chartRef = useRef<SVGSVGElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    year: number;
    totalAssets: number;
    principal: number;
    dividendProfit: number;
    withdrawalAmount?: number;
    x: number;
    y: number;
    principalY: number;
  } | null>(null);

  const chartAreaClipId = 'simulation-chart-area-clip';

  // パディング定数
  const leftPadding = 60;
  const rightPadding = 20;
  const topPadding = 40;
  const bottomPadding = 40;

  // チャート外部クリックでホバー解除
  useEffect(() => {
    const handleMouseLeave = () => {
      setHoveredPoint(null);
    };

    if (chartRef.current) {
      chartRef.current.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        chartRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  // チャートアニメーション制御
  useEffect(() => {
    const rect = document.getElementById(`${chartAreaClipId}-rect`);
    if (rect) {
      rect.setAttribute('width', '0');
      requestAnimationFrame(() => {
        rect.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)';
        rect.setAttribute('width', width.toString());
      });
    }
  }, [data, width]);

  // チャートパスとエリアの生成
  const generateChartElements = () => {
    if (!data || data.length === 0) return null;

    const leftPadding = 60; // Y軸ラベル用に左側のパディングを増加
    const rightPadding = 20; // 右側の余白を削減
    const topPadding = 40;
    const bottomPadding = 40;
    const chartWidth = width - leftPadding - rightPadding;
    const chartHeight = height - topPadding - bottomPadding;

    // スケール計算
    const values = data.map((d) => d.totalAssets);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const valueMargin = (max - min) * 0.1;
    const effectiveMin = Math.max(0, min - valueMargin); // 0以下にならないよう調整
    const effectiveMax = max + valueMargin;
    const valueRange = effectiveMax - effectiveMin;

    // データポイントの座標計算
    const points = data.map((d, i) => {
      const x = leftPadding + (i / (data.length - 1)) * chartWidth;
      const y =
        topPadding + chartHeight - ((d.totalAssets - effectiveMin) / valueRange) * chartHeight;
      return { x, y, data: d };
    });

    const principalPoints = data.map((d, i) => {
      const x = leftPadding + (i / (data.length - 1)) * chartWidth;
      const y =
        topPadding + chartHeight - ((d.principal - effectiveMin) / valueRange) * chartHeight;
      return { x, y };
    });

    // メインライン（総資産）パス
    let mainLinePath = '';
    if (points.length > 0) {
      mainLinePath = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        // スムーズな曲線を作成
        const prevPoint = points[i - 1];
        const currentPoint = points[i];
        const controlPointX = (prevPoint.x + currentPoint.x) / 2;
        mainLinePath += ` Q ${controlPointX} ${prevPoint.y} ${currentPoint.x} ${currentPoint.y}`;
      }
    }

    // 積立元本ライン
    let principalLinePath = '';
    if (principalPoints.length > 0) {
      principalLinePath = `M ${principalPoints[0].x} ${principalPoints[0].y}`;
      for (let i = 1; i < principalPoints.length; i++) {
        const prevPoint = principalPoints[i - 1];
        const currentPoint = principalPoints[i];
        const controlPointX = (prevPoint.x + currentPoint.x) / 2;
        principalLinePath += ` Q ${controlPointX} ${prevPoint.y} ${currentPoint.x} ${currentPoint.y}`;
      }
    }

    // エリアパス生成
    let principalAreaPath = '';
    let profitAreaPath = '';

    if (purpose === 'save') {
      // 積立元本エリア（底辺から元本ラインまで）
      principalAreaPath = `M ${principalPoints[0].x} ${height - bottomPadding}`;
      // 元本ラインを描画
      principalPoints.forEach((p, i) => {
        if (i === 0) principalAreaPath += `L ${p.x} ${p.y}`;
        else {
          const prevPoint = principalPoints[i - 1];
          const controlPointX = (prevPoint.x + p.x) / 2;
          principalAreaPath += ` Q ${controlPointX} ${prevPoint.y} ${p.x} ${p.y}`;
        }
      });
      // 右端から底辺に戻って閉じる
      principalAreaPath += `L ${principalPoints[principalPoints.length - 1].x} ${height - bottomPadding}`;
      principalAreaPath += `L ${principalPoints[0].x} ${height - bottomPadding} Z`;

      // 複利利益エリア（元本ラインから総資産ラインまで）
      profitAreaPath = `M ${principalPoints[0].x} ${principalPoints[0].y}`;
      // まず元本ラインをたどる
      principalPoints.forEach((p, i) => {
        if (i === 0) {
          // 開始点は既に設定済み
        } else {
          const prevPoint = principalPoints[i - 1];
          const controlPointX = (prevPoint.x + p.x) / 2;
          profitAreaPath += ` Q ${controlPointX} ${prevPoint.y} ${p.x} ${p.y}`;
        }
      });
      // 最後の元本ポイントから総資産の最後のポイントへ
      profitAreaPath += `L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
      // 総資産ラインを逆順でたどる
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        if (i === points.length - 1) {
          // 既に最後のポイントは設定済み
        } else {
          const nextPoint = points[i + 1];
          const controlPointX = (p.x + nextPoint.x) / 2;
          profitAreaPath += ` Q ${controlPointX} ${nextPoint.y} ${p.x} ${p.y}`;
        }
      }
      // 最初の総資産ポイントから最初の元本ポイントに戻って閉じる
      profitAreaPath += ` Z`;
    } else {
      // 使うモード：資産残高エリア
      principalAreaPath = mainLinePath;
      principalAreaPath += `L ${points[points.length - 1].x} ${height - bottomPadding}`;
      principalAreaPath += `L ${points[0].x} ${height - bottomPadding} Z`;
    }

    // Y軸の目盛り線を生成（改善版）
    const gridLines = [];

    // データの値に基づいて適切な目盛り間隔を計算
    const range = effectiveMax - effectiveMin;
    let step: number;

    // 適切な目盛り間隔を決定
    if (range <= 5000000) {
      // 500万以下
      step = 1000000; // 100万刻み
    } else if (range <= 10000000) {
      // 1000万以下
      step = 2000000; // 200万刻み
    } else if (range <= 50000000) {
      // 5000万以下
      step = 5000000; // 500万刻み
    } else {
      step = 10000000; // 1000万刻み
    }

    // 開始値を最も近い step の倍数に調整
    const startValue = Math.floor(effectiveMin / step) * step;
    const endValue = Math.ceil(effectiveMax / step) * step;

    for (let value = startValue; value <= endValue; value += step) {
      if (value >= effectiveMin && value <= effectiveMax) {
        const y = topPadding + chartHeight - ((value - effectiveMin) / valueRange) * chartHeight;

        gridLines.push(
          <g key={`grid-${value}`}>
            <line
              x1={leftPadding}
              y1={y}
              x2={width - rightPadding}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="0.5"
              opacity="0.4"
            />
            <text
              x={leftPadding - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill="#94A3B8"
              fontFamily="Inter, sans-serif"
            >
              {Math.round(value / 10000)}万
            </text>
          </g>
        );
      }
    }

    // X軸ラベル（改善版）
    const xLabels = [];
    const maxLabels = Math.min(6, data.length); // 最大6個のラベル
    const labelInterval = Math.max(1, Math.floor(data.length / maxLabels));

    for (let i = 0; i < data.length; i += labelInterval) {
      const d = data[i];
      const x = leftPadding + (i / (data.length - 1)) * chartWidth;
      xLabels.push(
        <text
          key={`xlabel-${d.year}`}
          x={x}
          y={height - 8}
          textAnchor="middle"
          fontSize="12"
          fill="#94A3B8"
          fontFamily="Inter, sans-serif"
        >
          {d.year}年
        </text>
      );
    }

    return {
      mainLinePath,
      principalLinePath,
      principalAreaPath,
      profitAreaPath,
      points,
      principalPoints,
      gridLines,
      xLabels,
      effectiveMin,
      effectiveMax,
      valueRange,
      chartWidth,
      chartHeight,
    };
  };

  const chartElements = generateChartElements();

  return (
    <div className="relative w-full">
      {/* 凡例 */}
      <div className="flex gap-6 mb-6 text-sm justify-center">
        {purpose === 'save' ? (
          <>
            <span className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-sm"
                style={{
                  background: 'var(--color-primary)',
                  opacity: 0.1,
                }}
              ></span>
              <span className="text-[var(--color-gray-700)]">積立元本</span>
            </span>
            <span className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-sm"
                style={{
                  background: 'var(--color-primary)',
                  opacity: 0.25,
                }}
              ></span>
              <span className="text-[var(--color-gray-700)]">複利利益</span>
            </span>
            <span className="flex items-center gap-2">
              <span
                className="w-4 h-1 rounded-sm"
                style={{
                  background: 'var(--color-primary)',
                }}
              ></span>
              <span className="text-[var(--color-gray-700)]">資産総額</span>
            </span>
          </>
        ) : (
          <span className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-sm"
              style={{
                background: 'var(--color-primary)',
                opacity: 0.3,
              }}
            ></span>
            <span className="text-[var(--color-gray-700)]">資産残高</span>
          </span>
        )}
      </div>

      {/* チャートSVG */}
      <svg
        ref={chartRef}
        className="w-full cursor-crosshair"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={(e) => {
          if (!chartElements?.points || chartElements.points.length === 0) return;

          const svg = e.currentTarget;
          const rect = svg.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * width;

          // 最も近いポイントを探す
          const pointWidth = chartElements.chartWidth / (chartElements.points.length - 1);
          const dataIndex = Math.round((x - 60) / pointWidth);
          const validIndex = Math.max(0, Math.min(dataIndex, chartElements.points.length - 1));
          const point = chartElements.points[validIndex];
          const principalPoint = chartElements.principalPoints[validIndex];

          if (point && principalPoint) {
            setHoveredPoint({
              year: point.data.year,
              totalAssets: point.data.totalAssets,
              principal: point.data.principal,
              dividendProfit: point.data.dividendProfit,
              withdrawalAmount: point.data.withdrawalAmount,
              x: point.x,
              y: point.y,
              principalY: principalPoint.y,
            });
          }
        }}
        onMouseLeave={() => setHoveredPoint(null)}
      >
        {/* アニメーション用clipPath */}
        <defs>
          <clipPath id={chartAreaClipId}>
            <rect id={`${chartAreaClipId}-rect`} x="0" y="0" width="0" height={height} />
          </clipPath>
        </defs>

        {chartElements && (
          <>
            {/* Y軸目盛り線 */}
            {chartElements.gridLines}

            {/* X軸ラベル */}
            {chartElements.xLabels}

            {/* エリア描画 */}
            {purpose === 'save' ? (
              <>
                {/* 積立元本エリア */}
                <path
                  d={chartElements.principalAreaPath}
                  fill="var(--color-primary)"
                  fillOpacity="0.1"
                  clipPath={`url(#${chartAreaClipId})`}
                  style={{
                    opacity: 0,
                    animation: 'chart-area-fade 0.8s ease-in-out 0.3s forwards',
                  }}
                />
                {/* 複利利益エリア */}
                <path
                  d={chartElements.profitAreaPath}
                  fill="var(--color-primary)"
                  fillOpacity="0.2"
                  clipPath={`url(#${chartAreaClipId})`}
                  style={{
                    opacity: 0,
                    animation: 'chart-area-fade 0.8s ease-in-out 0.6s forwards',
                  }}
                />
              </>
            ) : (
              /* 資産残高エリア */
              <path
                d={chartElements.principalAreaPath}
                fill="var(--color-primary)"
                fillOpacity="0.15"
                clipPath={`url(#${chartAreaClipId})`}
                style={{
                  opacity: 0,
                  animation: 'chart-area-fade 0.8s ease-in-out 0.3s forwards',
                }}
              />
            )}

            {/* メインライン（総資産） */}
            <path
              d={chartElements.mainLinePath}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                strokeDasharray: 1000,
                strokeDashoffset: 1000,
                filter: 'drop-shadow(0 2px 4px rgba(74, 144, 226, 0.2))',
                animation: 'chart-line-draw 1.2s cubic-bezier(0.4,0,0.2,1) 0.8s forwards',
              }}
            />

            {/* ホバー時のマーカーと垂直線 */}
            {hoveredPoint && (
              <>
                {/* 垂直線 */}
                <line
                  x1={hoveredPoint.x}
                  y1={topPadding}
                  x2={hoveredPoint.x}
                  y2={height - bottomPadding}
                  stroke="var(--color-primary)"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  strokeDasharray="4,4"
                />
                {/* 総資産マーカー */}
                <circle
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="6"
                  fill="white"
                  stroke="var(--color-primary)"
                  strokeWidth="3"
                  style={{
                    filter: 'drop-shadow(0 2px 8px rgba(74, 144, 226, 0.3))',
                  }}
                />
                {/* 積立元本マーカー（資産形成モードのみ） */}
                {purpose === 'save' && (
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.principalY}
                    r="4"
                    fill="white"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeOpacity="0.7"
                  />
                )}
              </>
            )}
          </>
        )}
      </svg>

      {/* インタラクティブツールチップ */}
      {hoveredPoint && (
        <div
          className="absolute bg-white rounded-lg p-4 shadow-lg pointer-events-none z-10 border border-gray-100"
          style={{
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: '10px',
            transform: 'translateX(-50%)',
            minWidth: '200px',
          }}
        >
          <div className="text-lg font-bold text-[var(--color-primary)] mb-2">
            {hoveredPoint.year}年後
          </div>
          <div className="space-y-2 text-sm">
            {purpose === 'save' ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ background: 'var(--color-primary)', opacity: 0.1 }}
                    ></span>
                    積立元本
                  </span>
                  <span className="font-medium">
                    {Math.round(hoveredPoint.principal / 10000)}万円
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ background: 'var(--color-primary)', opacity: 0.25 }}
                    ></span>
                    複利利益
                  </span>
                  <span className="font-medium">
                    {Math.round(hoveredPoint.dividendProfit / 10000)}万円
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                  <span className="flex items-center gap-2 font-medium">
                    <span
                      className="w-3 h-1 rounded-sm"
                      style={{ background: 'var(--color-primary)' }}
                    ></span>
                    資産総額
                  </span>
                  <span className="font-bold text-[var(--color-primary)]">
                    {Math.round(hoveredPoint.totalAssets / 10000)}万円
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ background: 'var(--color-primary)', opacity: 0.3 }}
                    ></span>
                    残高
                  </span>
                  <span className="font-medium">
                    {Math.round(hoveredPoint.totalAssets / 10000)}万円
                  </span>
                </div>
                {hoveredPoint.withdrawalAmount && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">取り崩し額</span>
                    <span className="font-medium">
                      {Math.round(hoveredPoint.withdrawalAmount / 10000)}万円
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
