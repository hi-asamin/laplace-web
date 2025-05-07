'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, TrendingUp, DollarSign, PieChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { generateChartPath } from '@/utils/chart';
import { ChartDataPoint } from '@/types/api';

// シミュレーション期間のオプション
const PERIOD_OPTIONS = [
  { value: '1Y', label: '1年' },
  { value: '3Y', label: '3年' },
  { value: '5Y', label: '5年' },
  { value: '10Y', label: '10年' },
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
}

// モックデータ
const generateMockData = (years: number) => {
  const data = [];
  let price = 100;
  let dividend = 2;
  let total = 102;

  for (let i = 1; i <= years; i++) {
    // 株価の変動（ランダムな上昇）
    const priceChange = (Math.random() * 10 - 2) / 100; // -2% から +8% の範囲
    price *= 1 + priceChange;

    // 配当金の変動（株価に連動）
    dividend = price * 0.02; // 2%の配当利回りを維持

    // 合計（株価 + 配当金）
    total = price + dividend;

    data.push({
      year: i,
      price: Math.round(price * 100) / 100,
      dividend: Math.round(dividend * 100) / 100,
      total: Math.round(total * 100) / 100,
    });
  }

  return data;
};

export default function SimulationPage() {
  const { symbol } = useParams();
  const [selectedPeriod, setSelectedPeriod] = useState('5Y');
  const [investmentAmount, setInvestmentAmount] = useState(1000000);
  const [investmentType, setInvestmentType] = useState('lump');
  const [reinvestDividends, setReinvestDividends] = useState(true);
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

  useEffect(() => {
    const years = parseInt(selectedPeriod);
    setSimulationData({
      baseScenario: generateMockData(years),
      optimisticScenario: generateMockData(years).map((d) => ({
        ...d,
        price: d.price * 1.1,
        total: d.total * 1.1,
      })),
      pessimisticScenario: generateMockData(years).map((d) => ({
        ...d,
        price: d.price * 0.9,
        total: d.total * 0.9,
      })),
    });
    setSelectedPoint(null);
  }, [selectedPeriod]);

  // 年間収益率の計算
  const calculateAnnualReturn = (data: SimYearData[]) => {
    if (!data || data.length === 0) return '0.0';
    const firstYear = data[0];
    const lastYear = data[data.length - 1];
    if (!firstYear || !lastYear) return '0.0';
    const totalReturn = (lastYear.total - firstYear.total) / firstYear.total;
    return (totalReturn * 100).toFixed(1);
  };

  // 配当利回りの計算
  const calculateDividendYield = (data: SimYearData[]) => {
    if (!data || data.length === 0) return '0.0';
    const lastYear = data[data.length - 1];
    if (!lastYear) return '0.0';
    return ((lastYear.dividend / lastYear.price) * 100).toFixed(1);
  };

  // 配当金の累積額計算
  const calculateTotalDividends = (data: SimYearData[]) => {
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, year) => sum + year.dividend, 0);
  };

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
    <div className="min-h-screen bg-[var(--color-surface-alt)] p-2">
      <div className="max-w-lg mx-auto py-3">
        {/* ヘッダー */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-[var(--color-gray-700)]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* 期間選択タブ */}
        <div className="flex justify-between w-full mb-4 overflow-x-auto no-scrollbar">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                selectedPeriod === option.value
                  ? 'bg-[var(--color-primary)] bg-opacity-10 text-white font-medium'
                  : 'text-[var(--color-gray-400)]'
              }`}
              onClick={() => setSelectedPeriod(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* チャート */}
        <div className="relative h-[200px] mb-6 rounded-lg">
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
            {/* チャートの線 */}
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

            {/* チャートの塗りつぶし領域 */}
            {chartPaths.baseScenario.areaPath && (
              <path
                d={chartPaths.baseScenario.areaPath}
                fill="rgba(89, 101, 255, 0.1)"
                className="chart-area-animation"
                style={{
                  opacity: 0,
                  animation: 'chart-area-fade 0.5s ease-in-out 1s forwards',
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
          {selectedPoint && (
            <div
              className="absolute left-1/2 top-0 bg-[var(--color-surface)] px-3 py-2 rounded-lg shadow-md text-center transform -translate-x-1/2 -translate-y-[calc(100%+5px)]"
              style={{
                left: `${(selectedPoint.x / 400) * 100}%`,
                maxWidth: '150px',
              }}
            >
              <div className="text-xs text-[var(--color-gray-400)]">{selectedPoint.year}年目</div>
              <div className="text-sm font-medium text-[var(--color-gray-900)]">
                ¥{Math.round((selectedPoint.price * investmentAmount) / 100).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* 投資条件設定 */}
        <div className="bg-[var(--color-surface)] rounded-xl p-4 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h2 className="text-base font-medium text-[var(--color-gray-900)] mb-4">
            投資条件を設定
          </h2>

          {/* 投資金額 */}
          <div className="mb-4">
            <label className="block text-sm text-[var(--color-gray-700)] mb-2">投資金額</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]">
                ¥
              </span>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full h-[44px] pl-8 pr-4 rounded-lg border border-[var(--color-gray-400)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20"
              />
            </div>
          </div>

          {/* 投資方法 */}
          <div className="mb-4">
            <label className="block text-sm text-[var(--color-gray-700)] mb-2">投資方法</label>
            <div className="flex space-x-2">
              {INVESTMENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setInvestmentType(option.value)}
                  className={`flex-1 h-[44px] rounded-lg border transition-colors duration-200 ${
                    investmentType === option.value
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] bg-opacity-10 text-white font-medium'
                      : 'border-[var(--color-gray-400)] text-[var(--color-gray-700)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 配当再投資 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="reinvestDividends"
              checked={reinvestDividends}
              onChange={(e) => setReinvestDividends(e.target.checked)}
              className="w-4 h-4 text-[var(--color-primary)] border-[var(--color-gray-400)] rounded"
            />
            <label
              htmlFor="reinvestDividends"
              className="ml-2 text-sm text-[var(--color-gray-700)]"
            >
              配当金を再投資する
            </label>
          </div>
        </div>

        {/* 予想チャート */}
        <div className="bg-[var(--color-surface)] rounded-xl p-4 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h2 className="text-base font-medium text-[var(--color-gray-900)] mb-4">資産推移予想</h2>
          <div className="h-[300px]">
            {simulationData.baseScenario.length > 0 ? (
              <LineChart
                width={400}
                height={300}
                data={simulationData.baseScenario}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="var(--color-primary)" name="株価" />
                <Line
                  type="monotone"
                  dataKey="dividend"
                  stroke="var(--color-success)"
                  name="配当金"
                />
                <Line type="monotone" dataKey="total" stroke="var(--color-gray-900)" name="合計" />
              </LineChart>
            ) : (
              <p>データが読み込まれていません。</p>
            )}
          </div>
        </div>

        {/* 予想指標 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[var(--color-surface)] rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-[var(--color-primary)] mr-2" />
              <h3 className="text-sm font-medium text-[var(--color-gray-900)]">年間収益予想</h3>
            </div>
            {simulationData.baseScenario.length > 0 ? (
              <div className="text-2xl font-bold text-[var(--color-gray-900)]">
                +{calculateAnnualReturn(simulationData.baseScenario)}%
              </div>
            ) : (
              <div className="text-2xl font-bold text-[var(--color-gray-900)]">+0.0%</div>
            )}
            <div className="text-sm text-[var(--color-gray-400)]">
              株価上昇: +
              {(parseFloat(calculateAnnualReturn(simulationData.baseScenario)) * 0.8).toFixed(1)}%
            </div>
            <div className="text-sm text-[var(--color-gray-400)]">
              配当金: +
              {(parseFloat(calculateAnnualReturn(simulationData.baseScenario)) * 0.2).toFixed(1)}%
            </div>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-[var(--color-success)] mr-2" />
              <h3 className="text-sm font-medium text-[var(--color-gray-900)]">配当利回り予想</h3>
            </div>
            {simulationData.baseScenario.length > 0 ? (
              <div className="text-2xl font-bold text-[var(--color-gray-900)]">
                {calculateDividendYield(simulationData.baseScenario)}%
              </div>
            ) : (
              <div className="text-2xl font-bold text-[var(--color-gray-900)]">0.0%</div>
            )}
            <div className="text-sm text-[var(--color-gray-400)]">
              年間配当金: ¥
              {Math.round(
                investmentAmount *
                  (parseFloat(calculateDividendYield(simulationData.baseScenario)) / 100)
              ).toLocaleString()}
            </div>
          </div>
        </div>

        {/* 詳細分析 */}
        <div className="bg-[var(--color-surface)] rounded-xl p-4 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center mb-4">
            <PieChart className="w-5 h-5 text-[var(--color-gray-900)] mr-2" />
            <h2 className="text-base font-medium text-[var(--color-gray-900)]">
              配当金の貢献度分析
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--color-gray-700)]">配当金の累積額</span>
                <span className="font-medium text-[var(--color-gray-900)]">
                  ¥
                  {Math.round(
                    (calculateTotalDividends(simulationData.baseScenario) * investmentAmount) / 100
                  ).toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-[var(--color-gray-200)] rounded-full">
                <div
                  className="h-full bg-[var(--color-success)] rounded-full"
                  style={{ width: '25%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--color-gray-700)]">資産総額に占める割合</span>
                <span className="font-medium text-[var(--color-gray-900)]">25%</span>
              </div>
              <div className="h-2 bg-[var(--color-gray-200)] rounded-full">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full"
                  style={{ width: '25%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-[var(--color-surface)] rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
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
