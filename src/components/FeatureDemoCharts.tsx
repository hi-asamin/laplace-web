'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, BarChart3, Shield, CheckCircle, AlertTriangle, PieChart } from 'lucide-react';

// ワンクリック自動入力デモ
export const AutoInputDemo = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const stocks = [
    {
      symbol: 'AAPL',
      name: 'アップル',
      fullName: 'Apple Inc.',
      price: '$185.92',
      change: '+$2.34',
      changePercent: '+1.28%',
      sector: 'テクノロジー',
      marketCap: '時価総額: $2.9T',
    },
    {
      symbol: 'GOOGL',
      name: 'アルファベット',
      fullName: 'Alphabet Inc.',
      price: '$138.21',
      change: '+$0.95',
      changePercent: '+0.69%',
      sector: 'テクノロジー',
      marketCap: '時価総額: $1.7T',
    },
  ];

  const handleStockSelect = (stock: (typeof stocks)[0]) => {
    setSelectedStock(stock.symbol);
    setShowDetails(false);
    setTimeout(() => {
      setShowDetails(true);
    }, 300);
  };

  const selectedStockData = stocks.find((s) => s.symbol === selectedStock);

  if (!selectedStock || !showDetails) {
    return (
      <div className="h-64 bg-white dark:bg-[var(--color-surface-1)] rounded-2xl shadow-inner p-6 flex flex-col justify-center">
        {/* 選択前の状態 */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 bg-[var(--color-lp-mint)] rounded-full"></div>
            <span className="text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-text-secondary)]">
              銘柄を選択
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {stocks.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => handleStockSelect(stock)}
                className="p-4 rounded-xl border-2 border-gray-200 dark:border-[var(--color-surface-3)] hover:border-[var(--color-lp-mint)]/50 
                          transition-all text-center hover:scale-105 active:scale-95 bg-white dark:bg-[var(--color-surface-2)]"
              >
                <div className="font-mono text-lg font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-1">
                  {stock.symbol}
                </div>
                <div className="text-xs text-gray-600 dark:text-[var(--color-text-muted)]">
                  {stock.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedStock && !showDetails && (
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-[var(--color-lp-mint)] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span className="text-sm text-[var(--color-lp-mint)] font-medium">
              データを取得中...
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-64 bg-white dark:bg-[var(--color-surface-1)] rounded-2xl shadow-inner p-6 flex flex-col">
      {/* 選択後の詳細表示 */}
      <div className="flex-1 animate-in fade-in duration-500">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="font-mono text-xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
              {selectedStockData!.symbol}
            </div>
            <div className="w-4 h-4 text-[var(--color-lp-blue)]">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.22 2.97a.75.75 0 0 0-1.06 0L4.28 5.84a.75.75 0 0 0 1.06 1.06L7 5.23V12a.75.75 0 0 0 1.5 0V5.23l1.66 1.67a.75.75 0 0 0 1.06-1.06L8.22 2.97Z" />
              </svg>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-[var(--color-success)] font-medium">
              {selectedStockData!.changePercent}
            </div>
          </div>
        </div>

        {/* 会社情報 */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-1">
            {selectedStockData!.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-[var(--color-text-secondary)]">
            {selectedStockData!.fullName}
          </p>
        </div>

        {/* 価格情報 */}
        <div className="mb-4">
          <div className="text-3xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-1">
            {selectedStockData!.price}
          </div>
          <div className="text-sm text-[var(--color-success)] font-medium">
            {selectedStockData!.change}
          </div>
        </div>

        {/* フッター情報 */}
        <div className="flex justify-between items-center text-xs">
          <div className="px-3 py-1 bg-[var(--color-lp-blue)]/10 dark:bg-[var(--color-lp-blue)]/20 rounded-full text-[var(--color-lp-blue)]">
            {selectedStockData!.sector}
          </div>
          <div className="text-gray-500 dark:text-[var(--color-text-muted)]">
            {selectedStockData!.marketCap}
          </div>
        </div>

        {/* リセットボタン */}
        <button
          onClick={() => {
            setSelectedStock(null);
            setShowDetails(false);
          }}
          className="mt-4 w-full py-2 text-sm text-[var(--color-lp-mint)] hover:bg-[var(--color-lp-mint)]/5 
                     rounded-lg transition-all"
        >
          別の銘柄を選択
        </button>
      </div>
    </div>
  );
};

// シナリオ横並び比較デモ
export const ScenarioComparisonDemo = () => {
  const [activeScenario, setActiveScenario] = useState(0);

  const scenarios = [
    {
      name: 'AAPL集中投資',
      color: 'var(--color-lp-mint)',
      finalAmount: 2850,
      risk: '高',
      data: [1000, 1200, 1450, 1650, 1900, 2200, 2500, 2850],
    },
    {
      name: 'S&P500 ETF',
      color: 'var(--color-lp-blue)',
      finalAmount: 2150,
      risk: '中',
      data: [1000, 1100, 1250, 1400, 1600, 1750, 1950, 2150],
    },
    {
      name: '定期預金',
      color: '#94a3b8',
      finalAmount: 1080,
      risk: '低',
      data: [1000, 1010, 1020, 1030, 1040, 1050, 1065, 1080],
    },
  ];

  const generatePath = (data: number[]) => {
    const width = 200;
    const height = 80;
    const padding = 10;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const valueRange = max - min;

    const points = data.map((value, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((value - min) / valueRange) * chartHeight;
      return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }

    return path;
  };

  return (
    <div className="h-64 bg-white dark:bg-[var(--color-surface-1)] rounded-2xl shadow-inner p-6">
      {/* シナリオタブ */}
      <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-[var(--color-surface-2)] rounded-lg p-1">
        {scenarios.map((scenario, index) => (
          <button
            key={index}
            onClick={() => setActiveScenario(index)}
            className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
              activeScenario === index
                ? 'bg-white dark:bg-[var(--color-surface-1)] text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] shadow-sm'
                : 'text-gray-600 dark:text-[var(--color-text-muted)] hover:text-gray-800 dark:hover:text-[var(--color-text-secondary)]'
            }`}
          >
            {scenario.name}
          </button>
        ))}
      </div>

      {/* 比較チャート */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {scenarios.map((scenario, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
              activeScenario === index
                ? 'border-[var(--color-lp-mint)] bg-[var(--color-lp-mint)]/5'
                : 'border-gray-200 dark:border-[var(--color-surface-3)] hover:border-gray-300 dark:hover:border-[var(--color-surface-4)]'
            }`}
            onClick={() => setActiveScenario(index)}
          >
            <div className="text-center mb-2">
              <div className="text-lg font-bold" style={{ color: scenario.color }}>
                {scenario.finalAmount}万
              </div>
              <div className="text-xs text-gray-600 dark:text-[var(--color-text-muted)]">
                {scenario.risk}リスク
              </div>
            </div>

            <svg viewBox="0 0 200 80" className="w-full h-8">
              <path
                d={generatePath(scenario.data)}
                fill="none"
                stroke={scenario.color}
                strokeWidth="2"
                opacity={activeScenario === index ? 1 : 0.6}
                style={{
                  filter:
                    activeScenario === index
                      ? 'drop-shadow(0 1px 3px rgba(74, 144, 226, 0.3))'
                      : 'none',
                }}
              />
            </svg>
          </div>
        ))}
      </div>

      {/* アクティブシナリオの詳細 */}
      <div className="bg-gray-50 dark:bg-[var(--color-surface-2)] rounded-lg p-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
            {scenarios[activeScenario].name}
          </span>
          <span className="text-sm text-gray-600 dark:text-[var(--color-text-secondary)]">
            10年後:{' '}
            <span className="font-bold text-[var(--color-lp-mint)]">
              {scenarios[activeScenario].finalAmount}万円
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

// リスクの可視化デモ
export const RiskVisualizationDemo = () => {
  const [showRisk, setShowRisk] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowRisk((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const generatePath = (data: number[], opacity = 1) => {
    const width = 280;
    const height = 120;
    const padding = 20;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const valueRange = max - min;

    const points = data.map((value, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((value - min) / valueRange) * chartHeight;
      return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }

    return path;
  };

  // 期待値シナリオ
  const expectedScenario = [1000, 1100, 1250, 1400, 1600, 1800, 2000, 2200, 2450, 2700];

  // 悲観シナリオ（下位5%）
  const pessimisticScenario = [1000, 950, 900, 1050, 1200, 1100, 1300, 1450, 1600, 1800];

  // 楽観シナリオ（上位5%）
  const optimisticScenario = [1000, 1250, 1600, 1850, 2100, 2400, 2700, 3100, 3500, 3900];

  return (
    <div className="h-64 bg-white dark:bg-[var(--color-surface-1)] rounded-2xl shadow-inner p-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[var(--color-lp-blue)]" />
          <span className="text-sm font-medium text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
            リスクシナリオ分析
          </span>
        </div>
        <button
          onClick={() => setShowRisk(!showRisk)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            showRisk
              ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300'
              : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
          }`}
        >
          {showRisk ? '最悪ケース表示中' : '期待値表示中'}
        </button>
      </div>

      {/* チャートエリア */}
      <div className="relative">
        <svg viewBox="0 0 280 120" className="w-full h-24 mb-4">
          {/* 背景グリッド */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="280" height="120" fill="url(#grid)" />

          {/* 信頼区間エリア */}
          {showRisk && (
            <>
              <path
                d={`${generatePath(optimisticScenario)} L 260 ${120 - 20} L 20 ${120 - 20} Z`}
                fill="var(--color-lp-mint)"
                fillOpacity="0.1"
              />
              <path
                d={`${generatePath(pessimisticScenario)} L 260 ${120 - 20} L 20 ${120 - 20} Z`}
                fill="orange"
                fillOpacity="0.1"
              />
            </>
          )}

          {/* メインライン（期待値） */}
          <path
            d={generatePath(expectedScenario)}
            fill="none"
            stroke="var(--color-lp-mint)"
            strokeWidth="3"
            strokeDasharray={showRisk ? 'none' : '5,5'}
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(0, 212, 161, 0.3))',
              transition: 'stroke-dasharray 0.5s ease-in-out',
            }}
          />

          {/* リスクライン */}
          {showRisk && (
            <>
              <path
                d={generatePath(optimisticScenario)}
                fill="none"
                stroke="var(--color-lp-mint)"
                strokeWidth="2"
                strokeOpacity="0.7"
                strokeDasharray="3,3"
              />
              <path
                d={generatePath(pessimisticScenario)}
                fill="none"
                stroke="orange"
                strokeWidth="2"
                strokeOpacity="0.8"
                strokeDasharray="3,3"
              />
            </>
          )}
        </svg>

        {/* 凡例 */}
        <div className="grid grid-cols-1 gap-2 text-xs text-[var(--color-text-secondary)]">
          {showRisk ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-[var(--color-lp-mint)]"></div>
                <span>期待値シナリオ (平均的な成果)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-orange-500"></div>
                <span>悲観シナリオ (下位5%の成果)</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-orange-500 dark:text-orange-400" />
                <span className="text-orange-700 dark:text-orange-300">
                  最悪の場合でも元本割れリスクは限定的
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[var(--color-lp-mint)]"></div>
              <span>期待リターン: 年率7%の複利成長</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ポートフォリオ円グラフ可視化デモ
export const PortfolioVisualizationDemo = () => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // ポートフォリオデータ
  const portfolioData = [
    { name: '米国株式', value: 35, color: '#00d4a1', darkColor: '#00ffc4' },
    { name: '先進国株式', value: 25, color: '#4a90e2', darkColor: '#60a5fa' },
    { name: '新興国株式', value: 15, color: '#f39c12', darkColor: '#fb923c' },
    { name: '国内株式', value: 10, color: '#9b59b6', darkColor: '#c084fc' },
    { name: 'その他', value: 15, color: '#95a5a6', darkColor: '#94a3b8' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // 円グラフのSVGパスを生成する関数
  const createPieSlice = (
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

  const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -Math.PI / 2; // 12時方向から開始

  const segments = portfolioData.map((item, index) => {
    const startAngle = currentAngle;
    const endAngle = currentAngle + (item.value / totalValue) * 2 * Math.PI;
    const midAngle = (startAngle + endAngle) / 2;

    // アニメーション進行率に基づく進行
    const segmentProgress = Math.max(0, Math.min(1, (animationProgress - index * 10) / 20));

    const path = createPieSlice(startAngle, endAngle, 40, 80, segmentProgress);

    currentAngle = endAngle;

    return {
      ...item,
      path,
      startAngle,
      endAngle,
      midAngle,
      index,
    };
  });

  return (
    <div className="h-64 bg-white dark:bg-[var(--color-surface-1)] rounded-2xl shadow-inner p-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="w-5 h-5 text-[var(--color-lp-mint)]" />
        <span className="text-sm font-medium text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
          資産配分の可視化
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 h-44">
        {/* 左側: 円グラフ */}
        <div className="relative w-40 h-40 flex-shrink-0">
          <svg viewBox="-100 -100 200 200" className="w-full h-full">
            {segments.map((segment) => (
              <g key={segment.index}>
                <path
                  d={segment.path}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="1"
                  style={{
                    filter:
                      hoveredSegment === segment.index
                        ? 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2))'
                        : 'none',
                    transform: hoveredSegment === segment.index ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'center',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredSegment(segment.index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
                {/* 中央の値表示 */}
                {hoveredSegment === segment.index && (
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-bold fill-[var(--color-lp-navy)] dark:fill-[var(--color-text-primary)]"
                    style={{ pointerEvents: 'none' }}
                  >
                    {segment.value}%
                  </text>
                )}
              </g>
            ))}

            {/* 中央の円 */}
            <circle
              cx="0"
              cy="0"
              r="35"
              fill="var(--color-lp-off-white)"
              className="dark:fill-[var(--color-surface-2)]"
            />

            {/* 中央のラベル */}
            {hoveredSegment === null && (
              <g>
                <text
                  x="0"
                  y="-6"
                  textAnchor="middle"
                  className="text-xs font-bold fill-[var(--color-lp-navy)] dark:fill-[var(--color-text-primary)]"
                  fontSize="10"
                >
                  総資産
                </text>
                <text
                  x="0"
                  y="8"
                  textAnchor="middle"
                  className="text-xs fill-[var(--color-lp-mint)]"
                  fontSize="11"
                >
                  1,540万円
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* 右側: 凡例 */}
        <div className="flex-1 ml-6 space-y-1">
          {portfolioData.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${
                hoveredSegment === index
                  ? 'bg-gray-50 dark:bg-[var(--color-surface-2)] scale-105'
                  : 'hover:bg-gray-50 dark:hover:bg-[var(--color-surface-2)]'
              }`}
              onMouseEnter={() => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <div className="font-medium text-xs text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                  {item.name}
                </div>
                <div className="text-[var(--color-lp-mint)] font-bold text-sm">{item.value}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
