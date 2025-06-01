'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Bookmark, Search } from 'lucide-react';
import { getMarketDetails, MarketDetails } from '@/lib/api';
import { generateChartPath } from '@/utils/chart';
import { getFlagIcon } from '@/utils';
import Tooltip from '@/components/tooltip';
import WithdrawalPlan from '@/components/WithdrawalPlan';
import WithdrawalChart from '@/components/WithdrawalChart';

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
  annualRate: number,
  contributionYears: number
) => {
  const data = [];
  let principal = startAmount;
  let total = startAmount;
  let cumulativeDividend = 0;
  for (let i = 1; i <= years; i++) {
    // 積立継続年数以内であれば積立金額を加算
    if (i <= contributionYears && monthlyAmount > 0) {
      principal += monthlyAmount * 12;
      total += monthlyAmount * 12;
    }
    // 配当金（運用益）は積立後の合計資産に年利をかけて複利で加算
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

// 各項目の説明（リッチ版）
const SIMULATION_TERM_EXPLANATIONS: Record<string, { title: string; description: string }> = {
  平均利回り率: {
    title: '平均利回り率',
    description: `資産運用で1年あたりどれくらい増えるかの平均リターン（年率）です。

【見方のポイント】
• 5%なら「毎年平均5%ずつ増える」前提で計算
• 初期値は銘柄や市場データを参照して自動算出
• 長期運用ほど小さな差が大きな差に

【目安】
• 日本株・ETF: 3〜6%
• 米国株・ETF: 5〜8%
• 債券・預金: 0.1〜2%`,
  },
  初期投資元本: {
    title: '初期投資元本',
    description: `シミュレーション開始時に一括で投資する金額です。

【見方のポイント】
• ここが0円なら「積立のみ」運用
• まとまった資金がある場合はここに入力

【例】
• 100万円を一括投資→「初期投資元本」に100万円`,
  },
  毎月積立金額: {
    title: '毎月積立金額',
    description: `毎月追加で投資する金額です。

【見方のポイント】
• 0円の場合は「一括投資のみ」
• 毎月コツコツ積み立てる場合に入力

【例】
• 毎月3万円積立→「毎月積立金額」に3万円`,
  },
  シミュレーション年数: {
    title: 'シミュレーション年数',
    description: `資産運用を何年間続けるかの期間です。

【見方のポイント】
• 期間が長いほど「複利効果」が大きくなる
• 退職や目標時期に合わせて設定

【例】
• 20年運用→「シミュレーション年数」に20年`,
  },
  合計投資額: {
    title: '合計投資額',
    description: `シミュレーション期間中に実際に投資した元本の合計です。

【見方のポイント】
• 初期投資元本＋毎月積立金額×積立継続年数
• 運用益（利益）は含まれません

【例】
• 初期100万円＋毎月3万円×20年積立＝820万円`,
  },
  貯まる金額: {
    title: '貯まる金額',
    description: `シミュレーション終了時点での総資産額（元本＋複利利益の合計）です。

【見方のポイント】
• 積立・運用を続けた場合の「最終的な手元資産」
• 元本と運用益（複利利益）の合計
• 途中で取り崩しや売却しなければこの金額が貯まります

【例】
• 20年後に1,200万円貯まる
• 30年後に2,000万円貯まる など`,
  },
  積立継続年数: {
    title: '積立継続年数',
    description: `毎月の積立投資を何年間続けるかの期間です。

【見方のポイント】
• 3年〜40年の範囲で設定可能
• この期間が終了した後は、追加の積立は行わず、それまでの資産を複利運用します。
• 「シミュレーション年数」と同じ場合は、シミュレーション期間中ずっと積み立てを継続します。

【例】
• 30年シミュレーションのうち、最初の10年間だけ積立→「積立継続年数」に10年`,
  },
  累積配当金: {
    title: '累積配当金（複利利益）',
    description: `運用期間中に得られた配当金や運用益の累計額です。トータル資産額のうち、元本を除いた増加分を示します。

【見方のポイント】
• 配当再投資や複利効果による「増えた分」
• 元本を除いた純粋な利益
• 長期運用ほど複利効果が大きくなる

【例】
• 20年で元本800万円→累積配当金400万円
• 30年で元本1,000万円→累積配当金1,200万円 など`,
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
  const [contributionYears, setContributionYears] = useState(20); // 積立継続年数（デフォルト20年）

  // 目標金額（初期値は空）
  const [targetAmount, setTargetAmount] = useState<string>('');
  // 逆算対象: 'yield' | 'contributionYears' | 'monthlyAmount' | 'initialPrincipal'
  const [reverseTarget, setReverseTarget] = useState<
    'yield' | 'contributionYears' | 'monthlyAmount' | 'initialPrincipal'
  >('yield');
  // 逆算結果state
  const [reverseYield, setReverseYield] = useState<number | null>(null);
  const [reverseYears, setReverseYears] = useState<number | null>(null);
  const [reverseMonthly, setReverseMonthly] = useState<number | null>(null);
  const [reversePrincipal, setReversePrincipal] = useState<number | null>(null);
  const [reverseError, setReverseError] = useState<string | null>(null);

  // 目標金額入力時は逆算モード
  const isReverseMode =
    targetAmount !== '' && !isNaN(Number(targetAmount)) && Number(targetAmount) > 0;

  // 目標金額入力時にデフォルトで利回り率を逆算対象に
  useEffect(() => {
    if (isReverseMode) setReverseTarget('yield');
  }, [isReverseMode]);

  // 逆算ロジック
  useEffect(() => {
    if (!isReverseMode) {
      setReverseYield(null);
      setReverseYears(null);
      setReverseMonthly(null);
      setReversePrincipal(null);
      setReverseError(null);
      return;
    }
    setReverseError(null);
    // 変数
    const FV = Number(targetAmount);
    let P = initialPrincipal;
    let PMT = monthlyAmount * 12;
    let r = averageYield / 100;
    let n = contributionYears;
    // 利回り逆算
    if (reverseTarget === 'yield') {
      // forループシミュレーションベースで逆算
      let lower = 0.0001;
      let upper = 0.5; // 50%まで探索
      let bestR = lower;
      let minDiff = Infinity;
      for (let iter = 0; iter < 30; iter++) {
        let mid = (lower + upper) / 2;
        // forループでシミュレーション
        let principal = P;
        let total = P;
        let cumulativeDividend = 0;
        for (let i = 1; i <= n; i++) {
          if (monthlyAmount > 0) {
            principal += monthlyAmount * 12;
            total += monthlyAmount * 12;
          }
          const dividend = total * mid;
          cumulativeDividend += dividend;
          total += dividend;
        }
        const diff = total - FV;
        if (Math.abs(diff) < Math.abs(minDiff)) {
          minDiff = diff;
          bestR = mid;
        }
        if (Math.abs(diff) < 0.01) break;
        if (diff > 0) {
          upper = mid;
        } else {
          lower = mid;
        }
      }
      let result = Math.round(bestR * 10000) / 100;
      if (Math.abs(result - averageYield) < 0.01) {
        result = averageYield;
      }
      if (!isFinite(result) || result < 0) {
        setReverseError('目標金額に到達できません');
        setReverseYield(null);
      } else {
        setReverseYield(result);
      }
    }
    // 積立継続年数逆算
    if (reverseTarget === 'contributionYears') {
      // forループシミュレーションベースで逆算
      let lower = 1;
      let upper = 50;
      let bestN = lower;
      let minDiff = Infinity;
      for (let iter = 0; iter < 30; iter++) {
        let mid = (lower + upper) / 2;
        let nTest = Math.round(mid);
        let principal = P;
        let total = P;
        let cumulativeDividend = 0;
        for (let i = 1; i <= nTest; i++) {
          if (monthlyAmount > 0) {
            principal += monthlyAmount * 12;
            total += monthlyAmount * 12;
          }
          const dividend = total * r;
          cumulativeDividend += dividend;
          total += dividend;
        }
        const diff = total - FV;
        if (Math.abs(diff) < Math.abs(minDiff)) {
          minDiff = diff;
          bestN = nTest;
        }
        if (Math.abs(diff) < 0.01) break;
        if (diff > 0) {
          upper = mid;
        } else {
          lower = mid;
        }
      }
      let result = Math.round(bestN);
      if (Math.abs(result - n) < 1) {
        result = n;
      }
      if (!isFinite(result) || result < 1) {
        setReverseError('目標金額に到達できません');
        setReverseYears(null);
      } else {
        setReverseYears(result);
      }
    }
    // 毎月積立金額逆算
    if (reverseTarget === 'monthlyAmount') {
      // forループシミュレーションベースで逆算
      let lower = 0;
      let upper = (FV / n / 12) * 2 + 1; // 目標金額からざっくり上限推定
      let bestPMT = lower;
      let minDiff = Infinity;
      for (let iter = 0; iter < 30; iter++) {
        let mid = (lower + upper) / 2;
        let principal = P;
        let total = P;
        let cumulativeDividend = 0;
        for (let i = 1; i <= n; i++) {
          if (mid > 0) {
            principal += mid * 12;
            total += mid * 12;
          }
          const dividend = total * r;
          cumulativeDividend += dividend;
          total += dividend;
        }
        const diff = total - FV;
        if (Math.abs(diff) < Math.abs(minDiff)) {
          minDiff = diff;
          bestPMT = mid;
        }
        if (Math.abs(diff) < 0.01) break;
        if (diff > 0) {
          upper = mid;
        } else {
          lower = mid;
        }
      }
      let result = Math.round(bestPMT);
      if (Math.abs(result - monthlyAmount) < 1) {
        result = monthlyAmount;
      }
      if (!isFinite(result) || result < 0) {
        setReverseError('目標金額に到達できません');
        setReverseMonthly(null);
      } else {
        setReverseMonthly(result);
      }
    }
    // 初期投資元本逆算
    if (reverseTarget === 'initialPrincipal') {
      const pow = Math.pow(1 + r, n);
      const denom = pow;
      if (denom === 0) {
        setReverseError('目標金額に到達できません');
        setReversePrincipal(null);
      } else {
        let principal = (FV - (PMT * (pow - 1)) / r) / denom;
        let result = Math.round(principal * 100) / 100;
        if (Math.abs(result - initialPrincipal) < 0.01) {
          result = initialPrincipal;
        }
        if (!isFinite(result) || result < 0) {
          setReverseError('目標金額に到達できません');
          setReversePrincipal(null);
        } else {
          setReversePrincipal(result);
        }
      }
    }
  }, [
    isReverseMode,
    reverseTarget,
    targetAmount,
    initialPrincipal,
    monthlyAmount,
    averageYield,
    contributionYears,
  ]);

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
    setSimulationData({
      baseScenario: generateMockData(
        contributionYears,
        initialPrincipal,
        monthlyAmount,
        averageYield,
        contributionYears
      ),
      optimisticScenario: generateMockData(
        contributionYears,
        initialPrincipal,
        monthlyAmount,
        averageYield + 2,
        contributionYears
      ),
      pessimisticScenario: generateMockData(
        contributionYears,
        initialPrincipal,
        monthlyAmount,
        Math.max(0, averageYield - 3),
        contributionYears
      ),
    });
    setSelectedPoint(null);
  }, [initialPrincipal, monthlyAmount, averageYield, investmentType, contributionYears]);

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

  // シミュレーション/取り崩しモード切替
  const [mode, setMode] = useState<'simulation' | 'withdrawal'>('simulation');

  // チャートのclipPathアニメーションを制御
  useEffect(() => {
    if (mode !== 'simulation') return;
    // 1フレーム遅延でclipPathをリセット→再アニメーション
    const rect = document.getElementById('chart-area-clip-rect');
    if (rect) {
      rect.setAttribute('width', '0');
      // 次フレームでwidthを400に
      requestAnimationFrame(() => {
        rect.style.transition = 'width 1.5s cubic-bezier(0.4,0,0.2,1)';
        rect.setAttribute('width', '400');
      });
    }
    // 線のアニメーションも同様に再発火
    const line = document.querySelector('.chart-line-animation');
    if (line) {
      (line as HTMLElement).style.animation = 'none';
      void (line as HTMLElement).offsetWidth;
      (line as HTMLElement).style.animation =
        'chart-line-draw 1.5s cubic-bezier(0.4,0,0.2,1) forwards';
    }
  }, [mode, simulationData.baseScenario]);

  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)] p-2 sm:p-4">
      <div className="max-w-3xl 2xl:max-w-5xl mx-auto px-2 sm:px-4 lg:px-8 xl:px-12">
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
        ) : !marketError ? (
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
        ) : null}

        {/* 資産情報 */}
        {isLoading ? (
          <div className="mb-2 px-2 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-md w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
          </div>
        ) : (
          <div className="mb-2 px-2">
            {/* 総資産額 */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-[var(--color-gray-400)]">
                {mode === 'withdrawal' ? '使える金額' : '貯まる金額'}
              </span>
              <Tooltip
                title={
                  mode === 'withdrawal'
                    ? '使える金額'
                    : SIMULATION_TERM_EXPLANATIONS['貯まる金額'].title
                }
                content={
                  mode === 'withdrawal'
                    ? `取り崩しプランに基づき、期間中に使える金額の目安です。運用・取り崩し条件によって変動します。`
                    : `あなたは${contributionYears}年間で、合計${
                        isReverseMode && targetAmount !== '' && !reverseError
                          ? '¥' + Number(targetAmount).toLocaleString() + '（目標）'
                          : simulationData.baseScenario.length > 0
                            ? '¥' +
                              Math.round(
                                simulationData.baseScenario[simulationData.baseScenario.length - 1]
                                  .total
                              ).toLocaleString()
                            : '-'
                      }貯まります。

${SIMULATION_TERM_EXPLANATIONS['貯まる金額'].description}`
                }
              >
                <span className="sr-only">
                  {mode === 'withdrawal' ? '使える金額の説明' : '貯まる金額の説明'}
                </span>
              </Tooltip>
            </div>
            <div className="text-[36px] font-bold text-[var(--color-gray-900)]">
              {isReverseMode && targetAmount !== '' && !reverseError
                ? `¥ ${Number(targetAmount).toLocaleString()}`
                : simulationData.baseScenario.length > 0
                  ? `¥ ${Math.round(simulationData.baseScenario[simulationData.baseScenario.length - 1].total).toLocaleString()}`
                  : '-'}
            </div>
            {/* 複利利益 */}
            {mode === 'simulation' && (
              <>
                <div className="mb-0.5 flex items-center gap-1 mt-2">
                  <span className="text-xs text-[var(--color-gray-400)]">複利利益</span>
                  <Tooltip
                    title={SIMULATION_TERM_EXPLANATIONS['累積配当金'].title}
                    content={SIMULATION_TERM_EXPLANATIONS['累積配当金'].description}
                  >
                    <span className="sr-only">複利利益の説明</span>
                  </Tooltip>
                </div>
                <div className="flex items-center text-base text-[var(--color-success)]">
                  <span className="mr-1">＋</span>
                  <span>
                    {(() => {
                      if (isReverseMode && targetAmount !== '' && !reverseError) {
                        let currentInitialPrincipal = initialPrincipal;
                        let currentMonthlyAmount = monthlyAmount;
                        let currentContributionYears = contributionYears;

                        if (reverseTarget === 'initialPrincipal' && reversePrincipal !== null) {
                          currentInitialPrincipal = reversePrincipal;
                        }
                        if (reverseTarget === 'monthlyAmount' && reverseMonthly !== null) {
                          currentMonthlyAmount = reverseMonthly;
                        }
                        if (reverseTarget === 'contributionYears' && reverseYears !== null) {
                          currentContributionYears = reverseYears;
                        }

                        const totalInvested =
                          currentInitialPrincipal +
                          currentContributionYears * currentMonthlyAmount * 12;
                        const profit = Number(targetAmount) - totalInvested;
                        return profit >= 0
                          ? `¥ ${Math.round(profit).toLocaleString()}`
                          : '算出不可';
                      } else if (simulationData.baseScenario.length > 0) {
                        return `¥ ${Math.round(simulationData.baseScenario[simulationData.baseScenario.length - 1].dividend).toLocaleString()}`;
                      } else {
                        return '-';
                      }
                    })()}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* チャートエリア：シミュレーション or 取り崩しプラン */}
        {mode === 'simulation' ? (
          <div className="relative h-[200px] sm:h-[260px] lg:h-[320px] mb-6 rounded-lg w-full">
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
              {/* 背景アニメーション用clipPath */}
              <defs>
                <clipPath id="chart-area-clip">
                  <rect id="chart-area-clip-rect" x="0" y="0" width="0" height="160" />
                </clipPath>
              </defs>
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
                // X軸ラベル（年）
                const xLabels = [];
                if (data.length > 10) {
                  // 5年ごと（5,10,15...）
                  for (let i = 0; i < data.length; i++) {
                    const d = data[i];
                    if (d.year % 5 === 0) {
                      const x = 10 + (chartWidth / (data.length - 1)) * i;
                      xLabels.push(
                        <text
                          key={d.year}
                          x={x}
                          y={160 - 2}
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
                  // 1年ごと
                  for (let i = 0; i < data.length; i++) {
                    const d = data[i];
                    const x = 10 + (chartWidth / (data.length - 1)) * i;
                    xLabels.push(
                      <text
                        key={d.year}
                        x={x}
                        y={160 - 2}
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
                    {/* 配当金エリア（上層、ブルー系濃色） */}
                    <path
                      d={dividendPath}
                      fill="rgba(89,101,255,0.38)"
                      clipPath="url(#chart-area-clip)"
                      className="chart-area-fade"
                    />
                    {/* 元本エリア（下層、ブルー系淡色） */}
                    <path
                      d={principalPath}
                      fill="rgba(89,101,255,0.13)"
                      clipPath="url(#chart-area-clip)"
                      className="chart-area-fade"
                    />
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
                    strokeDasharray: 1000,
                    strokeDashoffset: 1000,
                    animation: 'chart-line-draw 1.5s cubic-bezier(0.4,0,0.2,1) forwards',
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
                // ポップアップ位置ロジック
                let popupStyle: React.CSSProperties = { maxWidth: '180px', top: 0 };
                let popupClass =
                  'absolute bg-[var(--color-surface)] px-3 py-2 rounded-lg shadow-md text-center';
                if (selectedPoint.x < 90) {
                  // 左端
                  popupStyle.left = 10;
                  popupClass += ' '; // transformなし
                } else if (selectedPoint.x > 310) {
                  // 右端
                  popupStyle.right = 10;
                  popupStyle.left = 'auto';
                  popupClass += ' '; // transformなし
                } else {
                  // 中央付近
                  popupStyle.left = selectedPoint.x;
                  popupClass += ' transform -translate-x-1/2';
                }
                popupClass += ' -translate-y-[calc(100%+5px)]';
                return (
                  <div className={popupClass} style={popupStyle}>
                    <div className="text-xs text-[var(--color-gray-400)]">
                      {selectedPoint.year}年後
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
        ) : (
          <div className="mb-6 w-full">
            <WithdrawalPlan
              finalBalance={
                simulationData.baseScenario.length > 0
                  ? simulationData.baseScenario[simulationData.baseScenario.length - 1].total
                  : 0
              }
              annualRate={averageYield}
              mode="chart"
            />
          </div>
        )}

        {/* CTAボタン：x年後にいくら使える？ */}
        <button
          className="w-full mb-6 py-3 rounded-xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] text-lg font-bold bg-transparent transition hover:bg-[var(--color-primary)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          type="button"
          onClick={() => setMode(mode === 'simulation' ? 'withdrawal' : 'simulation')}
        >
          {mode === 'simulation'
            ? `${contributionYears}年後にいくら使える？`
            : 'シミュレーションをやり直す'}
        </button>

        {/* 取引情報（シミュレーション変数表示 or 取り崩しプラン） */}
        {mode === 'simulation' ? (
          <div className="grid grid-cols-2 gap-3 mb-6 w-full">
            {/* 平均利回り率カード（逆算対象にできる） */}
            <div
              className={`bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 ${isReverseMode && reverseTarget === 'yield' ? 'ring-2 ring-[var(--color-primary)] bg-[var(--color-primary)]/10' : ''} ${isReverseMode ? 'cursor-pointer hover:ring-2 hover:ring-[var(--color-primary)]/60' : ''}`}
              aria-pressed={isReverseMode && reverseTarget === 'yield'}
              tabIndex={isReverseMode ? 0 : -1}
              onClick={() => isReverseMode && setReverseTarget('yield')}
            >
              <div className="flex items-center mb-1 cursor-pointer select-none">
                <span className="text-xs text-[var(--color-gray-400)]">平均利回り率</span>
                {isReverseMode && reverseTarget === 'yield' && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[var(--color-primary)] text-white font-semibold">
                    逆算中
                  </span>
                )}
                <Tooltip
                  content={SIMULATION_TERM_EXPLANATIONS['平均利回り率'].description}
                  title={SIMULATION_TERM_EXPLANATIONS['平均利回り率'].title}
                >
                  <span className="sr-only">平均利回り率の説明</span>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={99.9}
                  value={
                    isReverseMode && reverseTarget === 'yield' && reverseYield !== null
                      ? reverseYield
                      : averageYield
                  }
                  onChange={(e) =>
                    setAverageYield(Math.max(0, Math.min(99.9, Number(e.target.value))))
                  }
                  className={`w-16 px-1 py-0.5 border border-[var(--color-gray-300)] rounded text-right text-base font-semibold focus:outline-none focus:border-[var(--color-primary)] ${isReverseMode && reverseTarget === 'yield' ? 'bg-[var(--color-surface-alt)] text-[var(--color-primary)] font-bold' : 'text-[var(--color-gray-900)]'}`}
                  readOnly={isReverseMode && reverseTarget === 'yield'}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-base font-semibold text-[var(--color-gray-900)]">%</span>
              </div>
            </div>
            {/* 初期投資元本カード（逆算対象にできる） */}
            <div
              className={`bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 ${isReverseMode && reverseTarget === 'initialPrincipal' ? 'ring-2 ring-[var(--color-primary)] bg-[var(--color-primary)]/10' : ''} ${isReverseMode ? 'cursor-pointer hover:ring-2 hover:ring-[var(--color-primary)]/60' : ''}`}
              aria-pressed={isReverseMode && reverseTarget === 'initialPrincipal'}
              tabIndex={isReverseMode ? 0 : -1}
              onClick={() => isReverseMode && setReverseTarget('initialPrincipal')}
            >
              <div className="flex items-center mb-1 cursor-pointer select-none">
                <span className="text-xs text-[var(--color-gray-400)]">初期投資元本</span>
                {isReverseMode && reverseTarget === 'initialPrincipal' && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[var(--color-primary)] text-white font-semibold">
                    逆算中
                  </span>
                )}
                <Tooltip
                  content={SIMULATION_TERM_EXPLANATIONS['初期投資元本'].description}
                  title={SIMULATION_TERM_EXPLANATIONS['初期投資元本'].title}
                >
                  <span className="sr-only">初期投資元本の説明</span>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-base font-semibold text-[var(--color-gray-900)]">¥</span>
                <input
                  type="number"
                  step="1"
                  min={0}
                  value={
                    isReverseMode &&
                    reverseTarget === 'initialPrincipal' &&
                    reversePrincipal !== null
                      ? reversePrincipal
                      : initialPrincipal
                  }
                  onChange={(e) => setInitialPrincipal(Math.max(0, Number(e.target.value)))}
                  className={`w-24 px-1 py-0.5 border border-[var(--color-gray-300)] rounded text-right text-base font-semibold focus:outline-none focus:border-[var(--color-primary)] ${isReverseMode && reverseTarget === 'initialPrincipal' ? 'bg-[var(--color-surface-alt)] text-[var(--color-primary)] font-bold' : 'text-[var(--color-gray-900)]'}`}
                  readOnly={isReverseMode && reverseTarget === 'initialPrincipal'}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            {/* 毎月積立金額カード（逆算対象にできる） */}
            <div
              className={`bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 ${isReverseMode && reverseTarget === 'monthlyAmount' ? 'ring-2 ring-[var(--color-primary)] bg-[var(--color-primary)]/10' : ''} ${isReverseMode ? 'cursor-pointer hover:ring-2 hover:ring-[var(--color-primary)]/60' : ''}`}
              aria-pressed={isReverseMode && reverseTarget === 'monthlyAmount'}
              tabIndex={isReverseMode ? 0 : -1}
              onClick={() => isReverseMode && setReverseTarget('monthlyAmount')}
            >
              <div className="flex items-center mb-1 cursor-pointer select-none">
                <span className="text-xs text-[var(--color-gray-400)]">毎月積立金額</span>
                {isReverseMode && reverseTarget === 'monthlyAmount' && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[var(--color-primary)] text-white font-semibold">
                    逆算中
                  </span>
                )}
                <Tooltip
                  content={SIMULATION_TERM_EXPLANATIONS['毎月積立金額'].description}
                  title={SIMULATION_TERM_EXPLANATIONS['毎月積立金額'].title}
                >
                  <span className="sr-only">毎月積立金額の説明</span>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-base font-semibold text-[var(--color-gray-900)]">¥</span>
                <input
                  type="number"
                  step="1"
                  min={0}
                  value={
                    isReverseMode && reverseTarget === 'monthlyAmount' && reverseMonthly !== null
                      ? Math.floor(reverseMonthly)
                      : monthlyAmount
                  }
                  onChange={(e) =>
                    setMonthlyAmount(Math.max(0, Math.floor(Number(e.target.value))))
                  }
                  className={`w-24 px-1 py-0.5 border border-[var(--color-gray-300)] rounded text-right text-base font-semibold focus:outline-none focus:border-[var(--color-primary)] ${isReverseMode && reverseTarget === 'monthlyAmount' ? 'bg-[var(--color-surface-alt)] text-[var(--color-primary)] font-bold' : 'text-[var(--color-gray-900)]'}`}
                  readOnly={isReverseMode && reverseTarget === 'monthlyAmount'}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            {/* 積立継続年数スライダー（毎月積立金額の右隣に移動） */}
            <div
              className={`bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-150 ${isReverseMode && reverseTarget === 'contributionYears' ? 'ring-2 ring-[var(--color-primary)] bg-[var(--color-primary)]/10' : ''} ${isReverseMode ? 'cursor-pointer hover:ring-2 hover:ring-[var(--color-primary)]/60' : ''}`}
              aria-pressed={isReverseMode && reverseTarget === 'contributionYears'}
              tabIndex={isReverseMode ? 0 : -1}
              onClick={() => isReverseMode && setReverseTarget('contributionYears')}
            >
              <div className="flex items-center mb-1 cursor-pointer select-none">
                <span className="text-xs text-[var(--color-gray-400)]">積立継続年数</span>
                <Tooltip
                  content={SIMULATION_TERM_EXPLANATIONS['積立継続年数'].description}
                  title={SIMULATION_TERM_EXPLANATIONS['積立継続年数'].title}
                >
                  <span className="sr-only">積立継続年数の説明</span>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={3}
                  max={50}
                  step={1}
                  value={
                    isReverseMode && reverseTarget === 'contributionYears' && reverseYears !== null
                      ? Math.round(reverseYears)
                      : contributionYears
                  }
                  onChange={(e) => {
                    const newContributionYears = Math.max(3, Math.min(50, Number(e.target.value)));
                    setContributionYears(newContributionYears);
                  }}
                  className={`w-full accent-[var(--color-primary)] ${isReverseMode && reverseTarget === 'contributionYears' ? 'bg-[var(--color-surface-alt)]' : ''}`}
                  readOnly={isReverseMode && reverseTarget === 'contributionYears'}
                  onClick={(e) => e.stopPropagation()}
                />
                <span
                  className={`text-base font-semibold min-w-[2.5em] text-right ${isReverseMode && reverseTarget === 'contributionYears' ? 'text-[var(--color-primary)] font-bold' : 'text-[var(--color-gray-900)]'}`}
                >
                  {isReverseMode && reverseTarget === 'contributionYears' && reverseYears !== null
                    ? `${reverseYears} 年`
                    : `${contributionYears} 年`}
                </span>
              </div>
            </div>
            {/* 合計投資額 & 目標金額カード */}
            <div className="col-span-2 grid grid-cols-2 gap-3">
              {/* 合計投資額 */}
              <div className="bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="flex items-center mb-1">
                  <span className="text-xs text-[var(--color-gray-400)]">合計投資額</span>
                  <Tooltip
                    content={SIMULATION_TERM_EXPLANATIONS['合計投資額'].description}
                    title={SIMULATION_TERM_EXPLANATIONS['合計投資額'].title}
                  >
                    <span className="sr-only">合計投資額の説明</span>
                  </Tooltip>
                </div>
                <div className="text-base font-semibold text-[var(--color-gray-900)]">
                  {(() => {
                    let principal = initialPrincipal;
                    let monthly = monthlyAmount;
                    let years = contributionYears;
                    if (isReverseMode) {
                      if (reverseTarget === 'initialPrincipal' && reversePrincipal !== null) {
                        principal = reversePrincipal;
                      }
                      if (reverseTarget === 'monthlyAmount' && reverseMonthly !== null) {
                        monthly = Math.floor(reverseMonthly);
                      }
                      if (reverseTarget === 'contributionYears' && reverseYears !== null) {
                        years = Math.round(reverseYears);
                      }
                    }
                    return `¥ ${(principal + years * monthly * 12).toLocaleString()}`;
                  })()}
                </div>
              </div>
              {/* 目標金額 */}
              <div className="bg-[var(--color-surface)] rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <span className="text-xs text-[var(--color-gray-400)]">目標金額</span>
                    <Tooltip title="目標金額" content={'達成したい目標金額を入力してください。'}>
                      <span className="sr-only">目標金額の説明</span>
                    </Tooltip>
                  </div>
                  {isReverseMode && (
                    <button
                      onClick={() => setTargetAmount('')}
                      className="text-xs text-[var(--color-primary)] hover:underline focus:outline-none"
                      aria-label="逆算を解除"
                    >
                      解除
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-base font-semibold text-[var(--color-gray-900)]">¥</span>
                  <input
                    type="number"
                    step="1000"
                    min={0}
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full px-1 py-0.5 border border-[var(--color-gray-300)] rounded text-right text-base font-semibold text-[var(--color-gray-900)] focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="例: 10000000"
                  />
                </div>
              </div>
            </div>
            {/* 逆算エラー表示 */}
            {isReverseMode && reverseError && (
              <div className="col-span-2 text-sm text-[var(--color-danger)] font-semibold mb-2">
                {reverseError}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6 w-full">
            <WithdrawalPlan
              finalBalance={
                simulationData.baseScenario.length > 0
                  ? simulationData.baseScenario[simulationData.baseScenario.length - 1].total
                  : 0
              }
              annualRate={averageYield}
              mode="input"
            />
          </div>
        )}

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
            <li>• 本シミュレーションは手数料・税金等を考慮していません。</li>
          </ul>
        </div>
      </div>
      <style>{`
        @keyframes chart-line-draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes chart-area-clip-grow {
          from { width: 0; }
          to { width: 400px; }
        }
        .chart-area-fade {
          /* 何も指定しなくてOK。clipPathで制御 */
        }
      `}</style>
    </div>
  );
}
