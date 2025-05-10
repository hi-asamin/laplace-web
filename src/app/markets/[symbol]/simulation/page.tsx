'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Bookmark, Search } from 'lucide-react';
import { getMarketDetails, MarketDetails } from '@/lib/api';
import { generateChartPath } from '@/utils/chart';
import { getFlagIcon } from '@/utils';
import Tooltip from '@/components/tooltip';

// シミュレーション期間のオプション
const PERIOD_OPTIONS = [
  { value: '1Y', label: '1年' },
  { value: '3Y', label: '3年' },
  { value: '5Y', label: '5年' },
  { value: '10Y', label: '10年' },
  { value: '20Y', label: '20年' },
  { value: '30Y', label: '30年' },
  { value: '40Y', label: '40年' },
];

// 投資方法のオプション
const INVESTMENT_OPTIONS = [
  { value: 'lump', label: '一括投資' },
  { value: 'monthly', label: '積立投資' },
];

// モックデータ型
interface SimYearData {
  year: number;
  price: number;
  dividend: number;
  total: number;
  principal: number;
  profit: number;
}

// モックデータ
const generateMockData = (
  years: number,
  startAmount: number,
  monthlyAmount: number,
  annualRate: number
) => {
  const data = [];
  let principal = startAmount;
  let total = startAmount;
  let cumulativeDividend = 0;
  for (let i = 1; i <= years; i++) {
    if (i > 1) {
      if (monthlyAmount > 0) {
        principal += monthlyAmount * 12;
        total += monthlyAmount * 12;
      }
    }
    // 配当金（運用益）は前年までの合計資産に年利をかけて複利で加算
    const dividend = total * (annualRate / 100);
    cumulativeDividend += dividend;
    total += dividend;
    data.push({
      year: i,
      price: total, // priceは合計値と同じでOK
      dividend: cumulativeDividend, // 累積配当金
      total: total,
      principal: principal,
      profit: cumulativeDividend, // profitは配当金（運用益）
    });
  }
  return data;
};

// 各項目の説明（充実版）
const SIMULATION_TERM_EXPLANATIONS: Record<string, { title: string; description: string }> = {
  平均利回り率: {
    title: '平均利回り率',
    description:
      'シミュレーションで仮定する「1年あたりの資産増加率（年平均リターン）」です。たとえば5%なら、毎年資産が平均して5%ずつ増える前提で計算します。\n\n初期値はAIが銘柄や市場データから自動算出した推奨値を入力しています。初心者でも迷わず使えるよう設計されています。',
  },
  初期投資元本: {
    title: '初期投資元本',
    description:
      'シミュレーション開始時点で初期投資する金額です。\n\nここが0円の場合は「積立のみ」で運用を始める想定です。',
  },
  毎月積立金額: {
    title: '毎月積立金額',
    description:
      '毎月追加で投資する金額です。たとえば「3万円」と設定すると、毎月3万円ずつ積み立てていきます。\n\nここが0円の場合は「初期投資金額」のみで運用を始める想定です。',
  },
  シミュレーション年数: {
    title: 'シミュレーション年数',
    description: '資産運用を何年間続けるかの期間です。期間が長いほど「複利効果」が大きくなります。',
  },
  合計投資額: {
    title: '合計投資額',
    description:
      'シミュレーション期間中に実際に投資した元本の合計です。\n例：毎月3万円×12ヶ月×20年＝720万円',
  },
};

export default function SimulationPage() {
  const router = useRouter();
  const { symbol } = useParams();
  // シンボルをデコードする（例：URLでエンコードされた9432.Tなど）
  const decodedSymbol = typeof symbol === 'string' ? decodeURIComponent(symbol) : '';

  const [marketData, setMarketData] = useState<MarketDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('20Y');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [investmentType, setInvestmentType] = useState('lump');
  const [selectedPoint, setSelectedPoint] = useState<{
    price: number;
    year: number;
    x: number;
    y: number;
  } | null>(null);
  const [simulationData, setSimulationData] = useState<{
    baseScenario: SimYearData[];
    optimisticScenario: SimYearData[];
    pessimisticScenario: SimYearData[];
  }>({
    baseScenario: [],
    optimisticScenario: [],
    pessimisticScenario: [],
  });

  // チャート参照用のrefを作成
  const chartRef = useRef<SVGSVGElement>(null);

  // 変数のstate
  const [averageYield, setAverageYield] = useState(5.0); // %
  const [initialPrincipal, setInitialPrincipal] = useState(0); // 円
  const [monthlyAmount, setMonthlyAmount] = useState(30000); // 円

  // 銘柄データ取得
  useEffect(() => {
    if (!decodedSymbol) return;
    setIsLoading(true);
    setMarketError(null);
    getMarketDetails(decodedSymbol)
      .then((data) => {
        setMarketData(data);
        setIsLoading(false);
      })
      .catch((e) => {
        setMarketError('取得できませんでした');
        setIsLoading(false);
      });
  }, [decodedSymbol]);

  // ブックマークの切り替え
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // 実際の実装ではここでブックマークの保存処理を行う
    // 例: localStorage や API 呼び出しなど
  };

  useEffect(() => {
    const years = parseInt(selectedPeriod);
    const yearNum = isNaN(years) && selectedPeriod.endsWith('Y') ? parseInt(selectedPeriod) : years;
    setSimulationData({
      baseScenario: generateMockData(yearNum, initialPrincipal, monthlyAmount, averageYield),
      optimisticScenario: generateMockData(
        yearNum,
        initialPrincipal,
        monthlyAmount,
        averageYield + 2
      ),
      pessimisticScenario: generateMockData(
        yearNum,
        initialPrincipal,
        monthlyAmount,
        Math.max(0, averageYield - 3)
      ),
    });
    setSelectedPoint(null);
  }, [selectedPeriod, initialPrincipal, monthlyAmount, averageYield, investmentType]);

  // チャート外部をクリックしたときの処理
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

  // チャートのパスを生成
  const chartPaths = {
    baseScenario: generateChartPath(
      simulationData.baseScenario.map((d) => ({
        date: d.year.toString(),
        open: d.total,
        high: d.total,
        low: d.total,
        close: d.total,
        volume: 0,
      })),
      400,
      160
    ),
    optimisticScenario: generateChartPath(
      simulationData.optimisticScenario.map((d) => ({
        date: d.year.toString(),
        open: d.total,
        high: d.total,
        low: d.total,
        close: d.total,
        volume: 0,
      })),
      400,
      160
    ),
    pessimisticScenario: generateChartPath(
      simulationData.pessimisticScenario.map((d) => ({
        date: d.year.toString(),
        open: d.total,
        high: d.total,
        low: d.total,
        close: d.total,
        volume: 0,
      })),
      400,
      160
    ),
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)] p-2 sm:p-4">
      <div className="max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto sm:px-4">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[var(--color-gray-700)] h-11 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-1">
            <button
              onClick={toggleBookmark}
              className={`h-11 rounded-full flex items-center justify-center text-[var(--color-gray-700)] ${isBookmarked ? 'text-[var(--color-primary)]' : ''}`}
            >
              <Bookmark className="w-6 h-6" fill={isBookmarked ? 'var(--color-primary)' : 'none'} />
            </button>
            <button
              onClick={() => router.push('/search')}
              className="h-11 rounded-full flex items-center justify-center text-[var(--color-gray-700)]"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 銘柄情報ヘッダー */}
        {isLoading ? (
          <div className="flex items-center space-x-3 mb-2 animate-pulse">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-2 w-full">
            {/* 左: ロゴ＋銘柄名 */}
            <div className="flex items-center space-x-3 px-2">
              <img
                src={marketData?.logoUrl || getFlagIcon(marketData?.market || 'global')}
                alt={marketData?.name}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getFlagIcon(marketData?.market || 'global');
                }}
              />
              <h1 className="text-[22px] font-semibold text-[var(--color-gray-900)]">
                {marketData?.name}
              </h1>
            </div>
          </div>
        )}

        {/* 資産情報 */}
        {isLoading ? (
          <div className="mb-2 px-2 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-md w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
          </div>
        ) : (
          <div className="mb-2 px-2">
            {/* 総資産額 */}
            <div className="mb-0.5 flex items-center gap-1">
              <span className="text-xs text-[var(--color-gray-400)]">貯まる金額</span>
              <Tooltip
                title="トータル資産額"
                content="シミュレーション終了時点での総資産額（元本＋複利利益の合計）です。"
              >
                <span className="sr-only">貯まる金額の説明</span>
              </Tooltip>
            </div>
            <div className="text-[36px] font-bold text-[var(--color-gray-900)]">
              {simulationData.baseScenario.length > 0
                ? `¥ ${Math.round(simulationData.baseScenario[simulationData.baseScenario.length - 1].total).toLocaleString()}`
                : '-'}
            </div>
            {/* 累積配当金（複利利益） */}
            <div className="mb-0.5 flex items-center gap-1 mt-2">
              <span className="text-xs text-[var(--color-gray-400)]">累積配当金（複利利益）</span>
              <Tooltip
                title="累積配当金（複利利益）"
                content="運用期間中に得られた配当金や運用益の累計額です。トータル資産額のうち、元本を除いた増加分を示します。"
              >
                <span className="sr-only">累積配当金（複利利益）の説明</span>
              </Tooltip>
            </div>
            <div className="flex items-center text-base text-[var(--color-success)]">
              <span className="mr-1">＋</span>
              <span>
                {simulationData.baseScenario.length > 0
                  ? `¥ ${Math.round(simulationData.baseScenario[simulationData.baseScenario.length - 1].dividend).toLocaleString()}`
                  : '-'}
              </span>
            </div>
          </div>
        )}

        {/* 期間選択タブ */}
        <div className="flex justify-between w-full mb-4 overflow-x-auto no-scrollbar gap-1 sm:gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 min-w-[56px] sm:min-w-[72px] lg:min-w-[88px] ${
                selectedPeriod === option.value
                  ? 'bg-[var(--color-primary)] bg-opacity-10 text-white font-medium'
                  : 'text-[var(--color-gray-400)]'
              }`}
              onClick={() => setSelectedPeriod(option.value)}
              style={{ minHeight: 44 }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* チャート */}
        <div className="relative h-[200px] sm:h-[260px] lg:h-[320px] mb-6 rounded-lg">
          {/* 色の使い分け説明（凡例） */}
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
              <span className="text-[var(--color-gray-700)]">積立元本</span>
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
              <span className="text-[var(--color-gray-700)]">複利利益</span>
            </span>
          </div>
          <svg
            ref={chartRef}
            className="w-full h-full"
            viewBox="0 0 400 160"
            preserveAspectRatio="none"
            onClick={(e) => {
              if (!simulationData.baseScenario) return;

              // クリック位置を取得
              const svg = e.currentTarget;
              const rect = svg.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 400;

              // x座標に最も近いデータポイントを見つける
              const chartWidth = 400 - 20; // パディングを考慮
              const pointWidth = chartWidth / (simulationData.baseScenario.length - 1);
              const dataIndex = Math.round((x - 10) / pointWidth); // パディングを考慮して調整

              // 範囲チェック
              const validIndex = Math.max(
                0,
                Math.min(dataIndex, simulationData.baseScenario.length - 1)
              );
              const point = simulationData.baseScenario[validIndex];

              if (point) {
                const values = simulationData.baseScenario.map((p) => p.total);
                const min = Math.min(...values);
                const max = Math.max(...values);
                const valueMargin = (max - min) * 0.1;
                const effectiveMin = min - valueMargin;
                const effectiveMax = max + valueMargin;
                const valueRange = effectiveMax - effectiveMin;

                // Y座標を計算
                const chartHeight = 160 - 20; // パディングを考慮
                const y =
                  10 + chartHeight - ((point.total - effectiveMin) / valueRange) * chartHeight;

                setSelectedPoint({
                  price: point.total,
                  year: point.year,
                  x: 10 + validIndex * pointWidth,
                  y,
                });
              }
            }}
          >
            {/* --- ここから積立元本・利回り分エリアの描画 --- */}
            {(() => {
              const data = simulationData.baseScenario;
              if (!data || data.length === 0) return null;
              // チャートスケール計算
              const values = data.map((p) => p.total);
              const min = Math.min(...values);
              const max = Math.max(...values);
              const valueMargin = (max - min) * 0.1;
              const effectiveMin = min - valueMargin;
              const effectiveMax = max + valueMargin;
              const valueRange = effectiveMax - effectiveMin;
              const chartWidth = 400 - 20;
              const chartHeight = 160 - 20;
              // 積立元本配列
              const principalPoints = data.map((d, i) => {
                const x = 10 + (chartWidth / (data.length - 1)) * i;
                const y =
                  10 + chartHeight - ((d.principal - effectiveMin) / valueRange) * chartHeight;
                return [x, y];
              });
              // 配当金エリア配列（元本＋配当金まで）
              const dividendPoints = data.map((d, i) => {
                const x = 10 + (chartWidth / (data.length - 1)) * i;
                const y =
                  10 +
                  chartHeight -
                  ((d.principal + d.dividend - effectiveMin) / valueRange) * chartHeight;
                return [x, y];
              });
              // 元本エリアパス
              let principalPath = '';
              principalPoints.forEach(([x, y], i) => {
                principalPath += i === 0 ? `M${x},${y}` : `L${x},${y}`;
              });
              principalPath += `L${10 + chartWidth},${10 + chartHeight}L10,${10 + chartHeight}Z`;
              // 配当金エリアパス（上辺：配当金、下辺：元本）
              let dividendPath = '';
              dividendPoints.forEach(([x, y], i) => {
                dividendPath += i === 0 ? `M${x},${y}` : `L${x},${y}`;
              });
              for (let i = data.length - 1; i >= 0; i--) {
                const [x, y] = principalPoints[i];
                dividendPath += `L${x},${y}`;
              }
              dividendPath += 'Z';
              return (
                <>
                  {/* 配当金エリア（上層、ブルー系濃色） */}
                  <path d={dividendPath} fill="rgba(89,101,255,0.38)" />
                  {/* 元本エリア（下層、ブルー系淡色） */}
                  <path d={principalPath} fill="rgba(89,101,255,0.13)" />
                </>
              );
            })()}
            {/* --- ここまでエリア描画 --- */}
            {/* 既存の折れ線チャート（資産推移） */}
            {chartPaths.baseScenario.linePath && (
              <path
                d={chartPaths.baseScenario.linePath}
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
                {/* 垂直線 */}
                <line
                  x1={selectedPoint.x}
                  y1="10"
                  x2={selectedPoint.x}
                  y2="150"
                  stroke="var(--color-primary)"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                {/* ポイントマーカー */}
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
          {selectedPoint &&
            (() => {
              const data = simulationData.baseScenario.find((d) => d.year === selectedPoint.year);
              if (!data) return null;
              return (
                <div
                  className="absolute left-1/2 top-0 bg-[var(--color-surface)] px-3 py-2 rounded-lg shadow-md text-center transform -translate-x-1/2 -translate-y-[calc(100%+5px)]"
                  style={{
                    left: `${(selectedPoint.x / 400) * 100}%`,
                    maxWidth: '180px',
                  }}
                >
                  <div className="text-xs text-[var(--color-gray-400)]">
                    {selectedPoint.year}年目
                  </div>
                  <div className="text-xs text-[var(--color-gray-700)] flex flex-col gap-1 mt-1">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-sm mr-1 align-middle"
                        style={{ background: 'rgba(89,101,255,0.13)' }}
                      ></span>
                      元本:{' '}
                      <span className="font-medium text-[var(--color-gray-900)]">
                        ¥{Math.round(data.principal).toLocaleString()}
                      </span>
                    </span>
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-sm mr-1 align-middle"
                        style={{ background: 'rgba(89,101,255,0.38)' }}
                      ></span>
                      複利利益:{' '}
                      <span className="font-medium text-[var(--color-gray-900)]">
                        ¥{Math.round(data.dividend).toLocaleString()}
                      </span>
                    </span>
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-sm mr-1 align-middle"
                        style={{ background: 'var(--color-primary)' }}
                      ></span>
                      合計:{' '}
                      <span className="font-medium text-[var(--color-primary)]">
                        ¥{Math.round(data.total).toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })()}
        </div>

        {/* 取引情報（シミュレーション変数表示） */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {(isLoading
            ? Array(4).fill(null)
            : [
                {
                  label: '平均利回り率',
                  value: (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        min={0}
                        max={99.9}
                        value={averageYield}
                        onChange={(e) =>
                          setAverageYield(Math.max(0, Math.min(99.9, Number(e.target.value))))
                        }
                        className="w-16 px-1 py-0.5 border border-[var(--color-gray-300)] rounded text-right text-base font-semibold text-[var(--color-gray-900)] focus:outline-none focus:border-[var(--color-primary)]"
                      />
                      <span className="text-base font-semibold text-[var(--color-gray-900)]">
                        %
                      </span>
                    </div>
                  ),
                },
                {
                  label: '初期投資元本',
                  value: (
                    <div className="flex items-center gap-1">
                      <span className="text-base font-semibold text-[var(--color-gray-900)]">
                        ¥
                      </span>
                      <input
                        type="number"
                        step="1"
                        min={0}
                        value={initialPrincipal}
                        onChange={(e) => setInitialPrincipal(Math.max(0, Number(e.target.value)))}
                        className="w-24 px-1 py-0.5 border border-[var(--color-gray-300)] rounded text-right text-base font-semibold text-[var(--color-gray-900)] focus:outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                  ),
                },
                {
                  label: '毎月積立金額',
                  value: (
                    <div className="flex items-center gap-1">
                      <span className="text-base font-semibold text-[var(--color-gray-900)]">
                        ¥
                      </span>
                      <input
                        type="number"
                        step="1"
                        min={0}
                        value={monthlyAmount}
                        onChange={(e) => setMonthlyAmount(Math.max(0, Number(e.target.value)))}
                        className="w-24 px-1 py-0.5 border border-[var(--color-gray-300)] rounded text-right text-base font-semibold text-[var(--color-gray-900)] focus:outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                  ),
                },
                {
                  label: 'シミュレーション年数',
                  value: `${(() => {
                    const years = parseInt(selectedPeriod);
                    return isNaN(years) && selectedPeriod.endsWith('Y')
                      ? parseInt(selectedPeriod)
                      : years;
                  })()} 年`,
                },
                {
                  label: '合計投資額',
                  value: `¥ ${(() => {
                    const years = (() => {
                      const y = parseInt(selectedPeriod);
                      return isNaN(y) && selectedPeriod.endsWith('Y')
                        ? parseInt(selectedPeriod)
                        : y;
                    })();
                    return (initialPrincipal + years * monthlyAmount * 12).toLocaleString();
                  })()}`,
                },
              ]
          ).map((info, index) => (
            <div
              key={index}
              className="bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-3 bg-gray-200 rounded-md w-2/3 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center mb-1">
                    <span className="text-xs text-[var(--color-gray-400)]">{info?.label}</span>
                    {SIMULATION_TERM_EXPLANATIONS[info?.label] && (
                      <Tooltip
                        content={SIMULATION_TERM_EXPLANATIONS[info.label].description}
                        title={SIMULATION_TERM_EXPLANATIONS[info.label].title}
                      >
                        <span className="sr-only">{`${SIMULATION_TERM_EXPLANATIONS[info.label].title}の説明`}</span>
                      </Tooltip>
                    )}
                  </div>
                  <div className="text-base font-semibold text-[var(--color-gray-900)]">
                    {info?.value}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* 注意事項 */}
        <div className="bg-[var(--color-surface)] rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] lg:p-6 xl:p-8">
          <h2 className="text-base font-medium text-[var(--color-gray-900)] mb-2">注意事項</h2>
          <ul className="text-sm text-[var(--color-gray-700)] space-y-2">
            <li>
              •
              このシミュレーションは過去の実績に基づく予想であり、将来の結果を保証するものではありません。
            </li>
            <li>• 株価は市場環境により大きく変動する可能性があります。</li>
            <li>• 配当金は企業の業績により変更される可能性があります。</li>
            <li>• 投資にはリスクが伴います。投資判断は自己責任でお願いします。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
