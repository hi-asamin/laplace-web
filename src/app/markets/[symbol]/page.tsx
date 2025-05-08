'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useRef } from 'react';
import { ChevronLeft, Bookmark, ChevronRight, TrendingUp, Search } from 'lucide-react';
import Link from 'next/link';
import Tooltip from '@/components/tooltip';
import { getMarketDetails, getChartData, getFundamentalData, getRelatedMarkets } from '@/lib/api';
import {
  MarketDetails,
  ChartData,
  FundamentalData,
  RelatedMarket,
  RelatedMarketsResponse,
} from '@/types/api';
import { generateChartPath } from '@/utils/chart';

// 期間選択のタブオプション
const PERIOD_OPTIONS = [
  { value: '1D', label: '1D', default: true },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
  { value: 'ALL', label: 'All' },
];

// 専門用語の説明
const TERM_EXPLANATIONS = {
  quarterlyEarnings: {
    title: '四半期業績推移',
    description: `四半期ごとの会社の収益を表示します。これにより収益の成長または減少のトレンドを確認できます。

【見方のポイント】
• 前年同期比で増加傾向にあるか確認する
• 季節要因を考慮する（多くの企業は特定の四半期に強い傾向がある）
• 急激な変動がある場合は、ニュースや決算説明資料で要因を確認する

【基準値の目安】
• 安定成長企業: 前年同期比5〜15%程度の成長
• 高成長企業: 前年同期比20%以上の成長
• 成熟企業: 0〜5%程度の安定した成長`,
  },
  avgVolume: {
    title: '平均出来高 (Average Volume)',
    description: `特定の期間（通常は30日間）における1日あたりの平均取引量を表します。株式の流動性や取引活発度を示す重要な指標です。

【見方のポイント】
• 高い出来高: 株式の流動性が高く、売買が活発に行われている
• 低い出来高: 株式の流動性が低く、大口注文で価格が大きく変動する可能性がある
• 通常より高い出来高: 企業に何らかのニュースや大きな動きがある可能性を示唆

【評価基準】
• 大型株: 日平均100万株以上は高流動性
• 中型株: 日平均10万〜50万株が一般的
• 小型株: 日平均1万株未満は低流動性の可能性

【注意点】
• 出来高の急増は、企業の重要なニュースや機関投資家の大口取引を示すことがある
• 出来高が著しく低い株は、売買スプレッドが広く、ポジションの構築や解消に時間がかかることがある`,
  },
  peRatio: {
    title: 'P/E RATIO（株価収益率）',
    description: `Price to Earnings Ratio（株価収益率）は、株価を1株当たり利益（EPS）で割った値です。企業の収益性に対する株価の割高・割安を判断する重要な指標です。

【計算式】
P/E RATIO = 株価 ÷ 1株当たり利益（EPS）

【見方のポイント】
• 一般的に低いほど割安、高いほど割高とされる
• 業種によって適正水準は大きく異なる
• 同業他社との比較が重要
• 成長率を考慮する必要がある

【基準値の目安】
• 成長企業: 20〜30倍程度
• 安定企業: 10〜15倍程度
• 成熟企業: 5〜10倍程度

【高いP/E RATIOの解釈】
• 将来の成長期待が高い
• 一時的な収益低下の可能性
• 過大評価の可能性

【低いP/E RATIOの解釈】
• 割安の可能性
• 収益性に課題がある可能性
• 一時的な収益増加の可能性

【注意点】
• 業種特性を考慮する必要がある
• 一時的な要因による変動に注意
• 将来の成長性も考慮する必要がある`,
  },
  eps: {
    title: 'EPS（一株当たり利益）',
    description: `Earnings Per Share（一株当たり利益）は、企業の純利益を発行済み株式数で割った数値です。株式投資の際の収益性を示す重要な指標です。

【見方のポイント】
• EPSが高いほど、一株あたりの収益性が高い
• 業種によって適正水準は大きく異なる
• EPSの成長率をチェックすることが重要（過去3〜5年の推移）

【基準値の目安】
• 優良企業: 毎年安定して5〜15%以上のEPS成長率
• 高い場合: 企業の収益性が高く、株価が上昇する可能性
• 低い場合: 企業の収益性に課題があるか、一時的な要因で収益が低下している可能性

【注意点】
• 一時的な特別利益や損失が含まれている可能性があるため、「調整後EPS」も確認するとよい`,
  },
  roe: {
    title: 'ROE（自己資本利益率）',
    description: `Return On Equity（自己資本利益率）は、企業が株主資本をどれだけ効率的に利益に変換しているかを示す指標です。高いROEは効率的な経営を示すことが多いです。

【計算式】
ROE = 当期純利益 ÷ 自己資本 × 100（%）

【見方のポイント】
• 一般的に15%以上であれば高いとされる
• 同業他社との比較が重要
• 持続的なROEの高さは企業の競争力を示す

【基準値の目安】
• 優良企業: 15%以上
• 良好: 10〜15%
• 平均的: 5〜10%
• 要注意: 5%未満

【高いROEの解釈】
• 経営効率が良い
• 株主資本を効率的に活用している
• ただし負債比率が高い場合は注意が必要

【低いROEの解釈】
• 収益性に課題がある可能性
• 過剰な内部留保がある可能性
• 企業が成熟期に入っている可能性`,
  },
  dividend: {
    title: '一株当たり配当金額',
    description: `一株当たりに支払われる配当金の金額です。配当利回りは、この配当金額を株価で割った比率で表されます。

【見方のポイント】
• 配当金額の絶対値よりも、配当利回り（配当金÷株価）を重視する
• 配当の持続性と成長性をチェック
• 企業の配当政策（安定配当か業績連動型か）を確認する

【基準値の目安】（配当利回りの場合）
• 高配当株: 4%以上
• 平均的: 2〜4%
• 低配当・成長株: 0〜2%

【高い配当の解釈】
• 株主還元に積極的
• 成熟企業で大きな成長が見込めない場合が多い
• 配当性向（純利益のうち配当に回す割合）が高すぎる場合は持続性に疑問

【低い配当の解釈】
• 成長投資を優先している可能性
• 事業拡大や研究開発に資金を投じている可能性
• 業績不振で配当余力がない可能性もある

【注意点】
• 異常に高い配当利回りは、株価下落による見かけ上の高さか、特別配当の可能性がある
• 配当の変化（増配・減配）にも注目する`,
  },
};

export default function MarketDetailPage() {
  const router = useRouter();
  const { symbol } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('1D');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<{
    price: number;
    date: string;
    x: number;
    y: number;
  } | null>(null);

  // チャート参照用のrefを作成
  const chartRef = useRef<SVGSVGElement>(null);

  // データ状態
  const [marketData, setMarketData] = useState<MarketDetails | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [fundamentalData, setFundamentalData] = useState<FundamentalData | null>(null);
  const [relatedMarkets, setRelatedMarkets] = useState<RelatedMarket[]>([]);
  const [error, setError] = useState<string | null>(null);

  // シンボルをデコードする（例：URLでエンコードされた9432.Tなど）
  const decodedSymbol = typeof symbol === 'string' ? decodeURIComponent(symbol) : '';

  // 国旗アイコンを取得する関数
  const getFlagIcon = (market: string): string => {
    switch (market?.toLowerCase()) {
      case 'japan':
        return '/flags/japan.svg'; // 日本の国旗
      case 'us':
        return '/flags/us.svg'; // アメリカの国旗
      default:
        return '/flags/global.svg'; // グローバル市場またはその他
    }
  };

  // ブックマークの切り替え
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // 実際の実装ではここでブックマークの保存処理を行う
    // 例: localStorage や API 呼び出しなど
  };

  // チャートデータを読み込む
  const loadChartData = async (symbolValue: string, period: string) => {
    try {
      const data = await getChartData(symbolValue, period);
      setChartData(data);
    } catch (err) {
      console.error('チャートデータの読み込みエラー:', err);
      setError('チャートデータを取得できませんでした');
    }
  };

  // 期間変更ハンドラー
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    loadChartData(decodedSymbol, period);
  };

  // チャート外部をクリックしたときの処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // chartRefがnullでない、かつクリックした要素がチャート内の要素でない場合
      if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
        setSelectedPoint(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // API呼び出しでデータを取得
    const loadData = async () => {
      if (!decodedSymbol) {
        setError('銘柄シンボルが指定されていません');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // 並列でデータを取得
        const [marketDetailsData, chartData, fundamentalsData, relatedData] = await Promise.all([
          getMarketDetails(decodedSymbol),
          getChartData(decodedSymbol, selectedPeriod),
          getFundamentalData(decodedSymbol),
          getRelatedMarkets(decodedSymbol),
        ]);

        setMarketData(marketDetailsData);
        setChartData(chartData);
        setFundamentalData(fundamentalsData);
        setRelatedMarkets(relatedData.items || []);

        setIsLoading(false);
      } catch (error) {
        console.error('データの読み込みエラー:', error);
        setError('データの取得中にエラーが発生しました');
        setIsLoading(false);
      }
    };

    loadData();
  }, [decodedSymbol, selectedPeriod]);

  // チャートのパスを生成
  const chartPaths = useMemo(() => {
    // データがない場合や不正な形式の場合は空のパスを返す
    if (!chartData?.data || chartData.data.length < 2) {
      return { linePath: '', areaPath: '', minValue: 0, maxValue: 0 };
    }

    // データ検証 - NaNや無効な値が含まれていないか確認
    const hasInvalidData = chartData.data.some(
      (point) => isNaN(point.close) || point.close === null || point.close === undefined
    );

    if (hasInvalidData) {
      console.warn('チャートデータに無効な値が含まれています:', chartData.data);
      return { linePath: '', areaPath: '', minValue: 0, maxValue: 0 };
    }

    // 有効なデータでパスを生成
    try {
      return generateChartPath(chartData.data, 400, 160);
    } catch (err) {
      console.error('チャートパス生成エラー:', err);
      return { linePath: '', areaPath: '', minValue: 0, maxValue: 0 };
    }
  }, [chartData]);

  // 取引情報を表示用にフォーマット
  const tradingInfoItems = marketData?.tradingInfo
    ? [
        { label: 'PREVIOUS CLOSE', value: marketData.tradingInfo.previousClose || '-' },
        { label: 'AVG VOLUME', value: marketData.tradingInfo.avgVolume || '-' },
        { label: 'P/E RATIO', value: marketData.tradingInfo.peRatio || '-' },
        { label: 'PRIMARY EXCHANGE', value: marketData.tradingInfo.primaryExchange || '-' },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)] p-2 sm:p-4">
      <div className="max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto sm:px-4">
        {/* ヘッダー: 戻るボタンとブックマークボタン */}
        <div className="flex justify-between items-center mb-2">
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
          <div className="flex items-center space-x-3 mb-6 animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-6 w-full">
            {/* 左: ロゴ＋銘柄名 */}
            <div className="flex items-center space-x-3">
              <img
                src={marketData?.logoUrl || getFlagIcon(marketData?.market || 'global')}
                alt={marketData?.name}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getFlagIcon(marketData?.market || 'global');
                }}
              />
              <h1 className="text-[22px] font-semibold text-[var(--color-gray-900)]">
                {marketData?.name}
              </h1>
            </div>
            {/* 右: データ取得日時＋リアルタイム */}
            {marketData?.lastUpdated && (
              <div className="flex flex-col items-end text-xs text-[var(--color-gray-400)] min-w-[70px]">
                <span>
                  {(() => {
                    try {
                      // 不正なISO8601（+09:00Zなど）を修正
                      const fixed = marketData.lastUpdated.replace(/([+-]\d{2}:\d{2})Z$/, '$1');
                      const d = new Date(fixed);
                      if (isNaN(d.getTime())) return '';
                      const jstDate = d.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' }); // 例: 2025/05/08
                      const match = jstDate.match(/(\d{4})\/(\d{2})\/(\d{2})/);
                      if (match) {
                        return `${match[2]}/${match[3]}`;
                      }
                      return jstDate;
                    } catch {
                      return '';
                    }
                  })()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* 価格情報 */}
        {isLoading ? (
          <div className="mb-6 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-md w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="text-[36px] font-bold text-[var(--color-gray-900)]">
              {marketData?.price}
            </div>
            <div
              className={`flex items-center text-base ${
                marketData?.isPositive
                  ? 'text-[var(--color-success)]'
                  : 'text-[var(--color-danger)]'
              }`}
            >
              <span className="mr-1">{marketData?.isPositive ? '↑' : '↓'}</span>
              <span>
                {marketData?.change} ({marketData?.changePercent})
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
              onClick={() => handlePeriodChange(option.value)}
              style={{ minHeight: 44 }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* チャート */}
        {isLoading ? (
          <div className="h-[200px] sm:h-[260px] lg:h-[320px] bg-gray-200 rounded-md mb-6 animate-pulse"></div>
        ) : (
          <div className="relative h-[200px] sm:h-[260px] lg:h-[320px] mb-6 rounded-lg">
            {chartData?.data &&
            chartData.data.length >= 2 &&
            !chartData.data.some((p) => isNaN(p.close)) ? (
              <svg
                ref={chartRef}
                className="w-full h-full"
                viewBox="0 0 400 160"
                preserveAspectRatio="none"
                onClick={(e) => {
                  if (!chartData?.data) return;

                  // クリック位置を取得
                  const svg = e.currentTarget;
                  const rect = svg.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 400;

                  // x座標に最も近いデータポイントを見つける
                  const chartWidth = 400 - 20; // パディングを考慮
                  const pointWidth = chartWidth / (chartData.data.length - 1);
                  const dataIndex = Math.round((x - 10) / pointWidth); // パディングを考慮して調整

                  // 範囲チェック
                  const validIndex = Math.max(0, Math.min(dataIndex, chartData.data.length - 1));
                  const point = chartData.data[validIndex];

                  if (point) {
                    const values = chartData.data.map((p) => p.close);
                    const min = Math.min(...values);
                    const max = Math.max(...values);
                    const valueMargin = (max - min) * 0.1;
                    const effectiveMin = min - valueMargin;
                    const effectiveMax = max + valueMargin;
                    const valueRange = effectiveMax - effectiveMin;

                    // Y座標を計算
                    const chartHeight = 160 - 20; // パディングを考慮
                    const y =
                      10 + chartHeight - ((point.close - effectiveMin) / valueRange) * chartHeight;

                    setSelectedPoint({
                      price: point.close,
                      date: point.date,
                      x: 10 + validIndex * pointWidth,
                      y,
                    });
                  }
                }}
              >
                {/* チャートの線 */}
                {chartPaths.linePath && (
                  <path
                    d={chartPaths.linePath}
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
                {chartPaths.areaPath && (
                  <path
                    d={chartPaths.areaPath}
                    fill="rgba(89, 101, 255, 0.1)"
                    className="chart-area-animation"
                    style={{
                      opacity: 0,
                      animation: 'chart-area-fade 0.5s ease-in-out 1s forwards',
                    }}
                  />
                )}

                {/* 最高値・最安値マーカー */}
                {(() => {
                  const data = chartData.data;
                  if (!data || data.length === 0) return null;
                  const closeValues = data.map((d) => d.close);
                  const max = Math.max(...closeValues);
                  const min = Math.min(...closeValues);
                  const maxIndex = closeValues.indexOf(max);
                  const minIndex = closeValues.indexOf(min);
                  // パディング・スケール計算
                  const padding = 10;
                  const chartWidth = 400 - 2 * padding;
                  const chartHeight = 160 - 2 * padding;
                  const valueMargin = (max - min) * 0.1;
                  const effectiveMin = min - valueMargin;
                  const effectiveMax = max + valueMargin;
                  const valueRange = effectiveMax - effectiveMin;
                  // X,Y座標
                  const getXY = (i: number, value: number) => ({
                    x: padding + (i / (data.length - 1)) * chartWidth,
                    y: padding + chartHeight - ((value - effectiveMin) / valueRange) * chartHeight,
                  });
                  const maxPt = getXY(maxIndex, max);
                  const minPt = getXY(minIndex, min);
                  return (
                    <>
                      {/* 最高値マーカー（同系色・控えめサイズ） */}
                      <circle
                        cx={maxPt.x}
                        cy={maxPt.y}
                        r="4"
                        fill="var(--color-primary)"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      <text
                        x={maxPt.x}
                        y={maxPt.y - 8}
                        textAnchor="middle"
                        fontSize="11"
                        fill="var(--color-primary)"
                        fontWeight="bold"
                        style={{ pointerEvents: 'none', opacity: 0.7 }}
                      >
                        {max.toLocaleString()}
                      </text>
                      {/* 最安値マーカー（同系色・控えめサイズ・淡色） */}
                      <circle
                        cx={minPt.x}
                        cy={minPt.y}
                        r="4"
                        fill="#BFC6FF" // --color-primaryの淡色
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      <text
                        x={minPt.x}
                        y={minPt.y + 16}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#BFC6FF"
                        fontWeight="bold"
                        style={{ pointerEvents: 'none', opacity: 0.7 }}
                      >
                        {min.toLocaleString()}
                      </text>
                    </>
                  );
                })()}

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
            ) : (
              <div className="flex items-center justify-center h-full text-[var(--color-gray-400)] text-sm">
                この期間のチャートデータはありません
              </div>
            )}

            {/* 選択したポイントの情報表示 */}
            {selectedPoint && (
              <div
                className="absolute left-1/2 top-0 bg-[var(--color-surface)] px-3 py-2 rounded-lg shadow-md text-center transform -translate-x-1/2 -translate-y-[calc(100%+5px)]"
                style={{
                  left: `${(selectedPoint.x / 400) * 100}%`,
                  maxWidth: '150px',
                }}
              >
                <div className="text-xs text-[var(--color-gray-400)]">
                  {new Date(selectedPoint.date).toLocaleDateString()}
                </div>
                <div className="text-sm font-medium text-[var(--color-gray-900)]">
                  {selectedPoint.price.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* シミュレーションページ遷移ボタン */}
        <button
          className="w-full h-12 mt-2 mb-6 rounded-full bg-[var(--color-primary)] text-white font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-[var(--color-primary-dark)] transition"
          onClick={() => router.push(`/markets/${symbol}/simulation`)}
          aria-label={`${marketData?.name || ''}の資産シミュレーションページへ遷移`}
        >
          <TrendingUp className="w-5 h-5" />
          この銘柄でシミュレーション
        </button>

        {/* ニュースエリア */}
        {!isLoading && (
          <div className="bg-[var(--color-surface)] rounded-xl p-3 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] lg:p-6 xl:p-8">
            <h3 className="text-base font-medium text-[var(--color-gray-900)] mb-2">
              {marketData?.name} share price {marketData?.isPositive ? 'up' : 'down'}{' '}
              {marketData?.changePercent?.replace('-', '').replace('+', '') || '0%'} in a week
            </h3>
            <p className="text-sm text-[var(--color-gray-700)] mb-3">
              The {marketData?.name}, which is {marketData?.isPositive ? 'up' : 'down'} around{' '}
              {Math.abs(
                parseFloat(marketData?.changePercent?.replace('%', '') || '0') * 1.2
              ).toFixed(1)}
              % so far this year, has been stuck in a narrow range...
            </p>
            <div className="flex justify-end">
              <button className="text-sm text-[var(--color-primary)] flex items-center">
                View more <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* 取引情報 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {(isLoading ? Array(4).fill(null) : tradingInfoItems).map((info, index) => (
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
                    {info?.label === 'AVG VOLUME' && (
                      <Tooltip
                        content={TERM_EXPLANATIONS.avgVolume.description}
                        title={TERM_EXPLANATIONS.avgVolume.title}
                      >
                        <span className="sr-only">平均出来高の説明</span>
                      </Tooltip>
                    )}
                    {info?.label === 'P/E RATIO' && (
                      <Tooltip
                        content={TERM_EXPLANATIONS.peRatio.description}
                        title={TERM_EXPLANATIONS.peRatio.title}
                      >
                        <span className="sr-only">P/E RATIOの説明</span>
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

        {/* ファンダメンタル分析セクション */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <TrendingUp className="h-5 w-5 mr-2 text-[var(--color-gray-900)]" />
            <h2 className="text-base font-medium text-[var(--color-gray-900)]">
              ファンダメンタル分析
            </h2>
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-40 bg-gray-200 rounded-xl"></div>
              <div className="grid grid-cols-3 gap-3">
                <div className="h-20 bg-gray-200 rounded-xl"></div>
                <div className="h-20 bg-gray-200 rounded-xl"></div>
                <div className="h-20 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ) : (
            <>
              {/* 四半期業績推移 */}
              <div className="bg-[var(--color-surface)] rounded-xl p-3 mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] lg:p-6 xl:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-[var(--color-gray-900)]">
                      四半期業績推移
                    </span>
                    <Tooltip
                      content={TERM_EXPLANATIONS.quarterlyEarnings.description}
                      title={TERM_EXPLANATIONS.quarterlyEarnings.title}
                    >
                      <span className="sr-only">四半期業績推移の説明</span>
                    </Tooltip>
                  </div>
                </div>

                <div className="flex justify-between items-end space-x-2 h-[100px]">
                  {(fundamentalData?.quarterlyEarnings || [])
                    .slice(0, 4)
                    .reverse() // 配列を反転して新しい四半期から表示
                    .map((earning, index) => {
                      // データポイントの値から高さを計算
                      const values = (fundamentalData?.quarterlyEarnings || [])
                        .slice(0, 4)
                        .reverse() // 配列を反転
                        .map((e) => parseFloat(e.value.replace(/[$,]/g, '')));

                      const min = Math.min(...values);
                      const max = Math.max(...values);
                      const range = max - min;

                      // 値から高さを計算（最小30px、最大80px）
                      const value = parseFloat(earning.value.replace(/[$,]/g, ''));
                      const height =
                        range === 0
                          ? 60 // すべて同じ値の場合
                          : 30 + ((value - min) / range) * 50;

                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div
                            className="w-full bg-[var(--color-primary)] bg-opacity-15 rounded-t-lg"
                            style={{
                              height: `${height}px`,
                              background:
                                'linear-gradient(180deg, var(--color-primary) 0%, rgba(89, 101, 255, 0.6) 100%)',
                              boxShadow: '0 2px 6px rgba(89, 101, 255, 0.2)',
                              transform: 'scaleY(0)',
                              animation: `bar-grow 0.8s ease-out ${index * 0.1}s forwards`,
                            }}
                          ></div>
                          <div className="mt-2 text-xs text-[var(--color-gray-400)]">
                            {earning.quarter}
                          </div>
                          <div className="text-xs font-medium text-[var(--color-gray-900)]">
                            {earning.value}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* その他のファンダメンタル指標 */}
              <div className="grid grid-cols-3 gap-3">
                {/* EPS (一株当たり利益) */}
                <div className="bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center mb-1">
                    <span className="text-xs text-[var(--color-gray-400)]">EPS</span>
                    <Tooltip
                      content={TERM_EXPLANATIONS.eps.description}
                      title={TERM_EXPLANATIONS.eps.title}
                    >
                      <span className="sr-only">EPSの説明</span>
                    </Tooltip>
                  </div>
                  <div className="text-base font-semibold text-[var(--color-gray-900)]">
                    {fundamentalData?.keyMetrics?.eps || '-'}
                  </div>
                </div>

                {/* ROE (自己資本利益率) */}
                <div className="bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center mb-1">
                    <span className="text-xs text-[var(--color-gray-400)]">ROE</span>
                    <Tooltip
                      content={TERM_EXPLANATIONS.roe.description}
                      title={TERM_EXPLANATIONS.roe.title}
                    >
                      <span className="sr-only">ROEの説明</span>
                    </Tooltip>
                  </div>
                  <div className="text-base font-semibold text-[var(--color-gray-900)]">
                    {fundamentalData?.keyMetrics?.roe || '-'}
                  </div>
                </div>

                {/* 一株当たり配当金額 */}
                <div className="bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center mb-1">
                    <span className="text-xs text-[var(--color-gray-400)]">配当 / 株</span>
                    <Tooltip
                      content={TERM_EXPLANATIONS.dividend.description}
                      title={TERM_EXPLANATIONS.dividend.title}
                    >
                      <span className="sr-only">一株当たり配当金額の説明</span>
                    </Tooltip>
                  </div>
                  <div className="text-base font-semibold text-[var(--color-gray-900)]">
                    {fundamentalData?.dividendData?.dividend || '-'}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 関連銘柄 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-medium text-[var(--color-gray-900)]">
              この銘柄を見た人がよく見ている銘柄
            </h2>
            <Link href="/search" className="text-xs text-[var(--color-primary)]">
              See all
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(isLoading ? Array(2).fill(null) : relatedMarkets.slice(0, 2)).map((stock, index) => (
              <div
                key={stock?.symbol || index}
                className="bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                onClick={() => stock && router.push(`/markets/${stock.symbol}`)}
              >
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-5 bg-gray-200 rounded-md w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                    </div>
                  </div>
                ) : (
                  stock && (
                    <>
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={stock.logoUrl || '/flags/global.svg'}
                          alt={stock.name}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/flags/global.svg';
                          }}
                        />
                        <div className="text-sm font-medium text-[var(--color-gray-900)]">
                          {stock.name} ({stock.symbol})
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-base font-semibold text-[var(--color-gray-900)]">
                          {stock.price || '-'}
                        </div>
                        <div
                          className={`text-xs ${
                            stock.isPositive
                              ? 'text-[var(--color-success)]'
                              : 'text-[var(--color-danger)]'
                          }`}
                        >
                          {stock.change || '-'}
                        </div>
                      </div>
                    </>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
