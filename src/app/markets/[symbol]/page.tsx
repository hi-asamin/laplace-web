'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { TrendingUp } from 'lucide-react';
import { getMarketDetails, getChartData, getFundamentalData, getRelatedMarkets } from '@/lib/api';
import {
  MarketDetails,
  ChartData,
  FundamentalData,
  RelatedMarket,
  RelatedMarketsResponse,
} from '@/types/api';

import { getFlagIcon } from '@/utils';
import { useMarketDetailAnalytics } from '@/hooks/useMarketDetailAnalytics';

// 新しいダッシュボードコンポーネントのインポート
import EnhancedStockChart from '@/components/EnhancedStockChart';
import PerformanceCard from '@/components/PerformanceCard';
import DividendCard from '@/components/DividendCard';
import ValuationScoreCard from '@/components/ValuationScoreCard';
import CompanyProfileCard from '@/components/CompanyProfileCard';
import NewsCard from '@/components/NewsCard';
import PeersCard from '@/components/PeersCard';
import MarketHeader from '@/components/MarketHeader';

export default function MarketDetailPage() {
  const router = useRouter();
  const { symbol } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 個別ローディング状態
  const [loadingStates, setLoadingStates] = useState({
    marketData: true,
    chartData: true,
    fundamentalData: true,
    relatedMarkets: true,
  });

  // データ状態
  const [marketData, setMarketData] = useState<MarketDetails | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [fundamentalData, setFundamentalData] = useState<FundamentalData | null>(null);
  const [relatedMarkets, setRelatedMarkets] = useState<RelatedMarket[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // シンボルをデコードする（例：URLでエンコードされた9432.Tなど）
  const decodedSymbol = typeof symbol === 'string' ? decodeURIComponent(symbol) : '';

  // アナリティクス
  const analytics = useMarketDetailAnalytics();

  // ブックマークの切り替え
  const toggleBookmark = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);

    // アナリティクス追跡
    if (analytics) {
      analytics.trackBookmarkToggle(decodedSymbol, newBookmarkState ? 'add' : 'remove');
    }

    // 実際の実装ではここでブックマークの保存処理を行う
    // 例: localStorage や API 呼び出しなど
  };

  // 各APIのデータを個別に取得する関数
  const loadMarketDetails = useCallback(async () => {
    const startTime = Date.now();

    try {
      const data = await getMarketDetails(decodedSymbol);
      const loadTime = Date.now() - startTime;

      setMarketData(data);
      setErrors((prev) => ({ ...prev, marketDetails: '' }));
      setLoadingStates((prev) => ({ ...prev, marketData: false }));

      // データ読み込み完了を追跡
      if (analytics) {
        analytics.trackDataLoadComplete(decodedSymbol, 'market_details', loadTime);
      }
    } catch (error) {
      const loadTime = Date.now() - startTime;

      setErrors((prev) => ({ ...prev, marketDetails: '市場詳細データを取得できませんでした' }));
      setLoadingStates((prev) => ({ ...prev, marketData: false }));

      // エラーを追跡
      if (analytics) {
        analytics.trackError(decodedSymbol, error as Error, 'market_details_load');
      }
    }
  }, [decodedSymbol]);

  const loadChartData = useCallback(
    async (symbolValue: string, period: string, isInitialLoad = false) => {
      const startTime = Date.now();

      try {
        if (!isInitialLoad) {
          setIsChartLoading(true);
        }

        const data = await getChartData(symbolValue, period);
        const loadTime = Date.now() - startTime;

        setChartData(data);
        setErrors((prev) => ({ ...prev, chartData: '' }));

        if (isInitialLoad) {
          setLoadingStates((prev) => ({ ...prev, chartData: false }));
        }

        // データ読み込み完了を追跡
        if (analytics) {
          analytics.trackDataLoadComplete(symbolValue, `chart_data_${period}`, loadTime);
        }
      } catch (error) {
        const loadTime = Date.now() - startTime;

        setErrors((prev) => ({ ...prev, chartData: 'チャートデータを取得できませんでした' }));

        if (isInitialLoad) {
          setLoadingStates((prev) => ({ ...prev, chartData: false }));
        }

        // エラーを追跡
        if (analytics) {
          analytics.trackError(symbolValue, error as Error, 'chart_data_load');
        }
      } finally {
        if (!isInitialLoad) {
          setIsChartLoading(false);
        }
      }
    },
    []
  );

  const loadFundamentalData = useCallback(async () => {
    try {
      const data = await getFundamentalData(decodedSymbol);

      setFundamentalData(data);
      setErrors((prev) => ({ ...prev, fundamentalData: '' }));
      setLoadingStates((prev) => ({ ...prev, fundamentalData: false }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        fundamentalData: 'ファンダメンタルデータを取得できませんでした',
      }));
      setLoadingStates((prev) => ({ ...prev, fundamentalData: false }));
    }
  }, [decodedSymbol]);

  const loadRelatedMarkets = useCallback(async () => {
    try {
      const data = await getRelatedMarkets(decodedSymbol);

      setRelatedMarkets(data.items || []);
      setErrors((prev) => ({ ...prev, relatedMarkets: '' }));
      setLoadingStates((prev) => ({ ...prev, relatedMarkets: false }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, relatedMarkets: '関連銘柄データを取得できませんでした' }));
      setLoadingStates((prev) => ({ ...prev, relatedMarkets: false }));
    }
  }, [decodedSymbol]);

  // 期間変更ハンドラー
  const handlePeriodChange = (period: string) => {
    const previousPeriod = selectedPeriod;
    setSelectedPeriod(period);

    // アナリティクス追跡
    if (analytics) {
      analytics.trackChartPeriodChange(decodedSymbol, previousPeriod, period);
    }

    loadChartData(decodedSymbol, period, false); // 期間変更時はチャート専用ローディング
  };

  useEffect(() => {
    if (!decodedSymbol) {
      setErrors((prev) => ({ ...prev, general: '銘柄シンボルが指定されていません' }));
      setIsLoading(false);
      return;
    }

    // 初期状態をリセット
    setIsLoading(true);
    setErrors({});
    setLoadingStates({
      marketData: true,
      chartData: true,
      fundamentalData: true,
      relatedMarkets: true,
    });

    // 優先度1: ヘッダー表示に必要な基本情報（最優先）
    loadMarketDetails();

    // 優先度2: チャートデータ（ユーザーが最初に見るコンテンツ）
    loadChartData(decodedSymbol, selectedPeriod, true);

    // 優先度3: その他のデータ（バックグラウンドで読み込み）
    loadFundamentalData();
    loadRelatedMarkets();

    // 全体の読み込み完了をモニタリング（基本情報とチャートのみで十分）
    Promise.all([loadMarketDetails(), loadChartData(decodedSymbol, selectedPeriod, true)]).finally(
      () => {
        setIsLoading(false); // 基本情報とチャートが揃えばローディング終了
      }
    );
  }, [decodedSymbol]);

  // ページビュー追跡用の別useEffect
  useEffect(() => {
    if (decodedSymbol && marketData?.name && analytics) {
      analytics.trackPageView(decodedSymbol, marketData.name);
    }
  }, [decodedSymbol, marketData?.name]); // analyticsを依存配列から削除

  // エラー表示コンポーネント
  const ErrorMessage = ({ type }: { type: string }) => {
    const error = errors[type];
    if (!error) return null;

    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
        {error}
      </div>
    );
  };

  // 新しいダッシュボード用のモックデータ生成
  const mockPerformanceData = useMemo(
    () => [
      { period: '1M', return: 5.2, label: '1ヶ月' },
      { period: '6M', return: 12.8, label: '6ヶ月' },
      { period: 'YTD', return: 18.5, label: '年初来' },
      { period: '1Y', return: 24.3, label: '1年' },
    ],
    []
  );

  const mockDividendData = useMemo(
    () => ({
      currentYield: 2.58,
      dividendHistory: [
        { year: '2020', dividend: 120 },
        { year: '2021', dividend: 125 },
        { year: '2022', dividend: 130 },
        { year: '2023', dividend: 135 },
        { year: '2024', dividend: 140, isEstimate: true },
      ],
      nextExDate: '2024-06-15',
      annualDividend: 140,
    }),
    []
  );

  const mockValuationData = useMemo(
    () => ({
      pbr: 1.2,
      per: 15.8,
      industryAvgPbr: 1.5,
      industryAvgPer: 18.2,
      industryName: '自動車',
    }),
    []
  );

  const mockCompanyData = useMemo(
    () => ({
      name: marketData?.name || 'トヨタ自動車',
      logoUrl: marketData?.logoUrl,
      website: 'https://www.toyota.co.jp',
      description:
        '世界最大級の自動車メーカーとして、ハイブリッド技術のパイオニアであり、持続可能なモビリティソリューションを提供しています。レクサスブランドも展開し、グローバルに事業を展開しています。',
      industry: '自動車',
      sector: '輸送用機器',
      employees: 375235,
      founded: '1937',
      headquarters: '愛知県豊田市',
      marketCap: '35.2兆円',
    }),
    [marketData]
  );

  const mockNewsData = useMemo(
    () => [
      {
        id: '1',
        title: 'トヨタ、2024年第3四半期決算を発表 - 営業利益が前年同期比15%増',
        summary: '電動車の販売好調により、営業利益が大幅に増加。北米市場での売上が特に堅調。',
        publishedAt: '2024-02-08T09:00:00Z',
        source: '日本経済新聞',
        url: 'https://example.com/news/1',
      },
      {
        id: '2',
        title: '新型プリウス、欧州市場での予約開始 - 燃費性能をさらに向上',
        summary: '第5世代プリウスが欧州市場で予約開始。燃費性能の向上と新デザインが注目。',
        publishedAt: '2024-02-07T14:30:00Z',
        source: 'ロイター',
        url: 'https://example.com/news/2',
      },
    ],
    []
  );

  const mockPeersData = useMemo(
    () => [
      {
        symbol: '7201.T',
        name: '日産自動車',
        price: '¥420',
        change: '+8',
        changePercent: '+1.9%',
        isPositive: true,
        marketCap: '1.8兆円',
        per: 12.5,
        pbr: 0.8,
      },
      {
        symbol: '7267.T',
        name: 'ホンダ',
        price: '¥1,580',
        change: '-15',
        changePercent: '-0.9%',
        isPositive: false,
        marketCap: '5.2兆円',
        per: 14.2,
        pbr: 1.1,
      },
    ],
    []
  );

  // 高機能チャート用のデータ変換
  const enhancedChartData = useMemo(() => {
    if (!chartData?.data) return [];

    return chartData.data.map((point) => ({
      date: point.date,
      close: point.close,
    }));
  }, [chartData]);

  // セクション表示追跡用のrefs
  const chartSectionRef = useRef<HTMLDivElement>(null);
  const performanceSectionRef = useRef<HTMLDivElement>(null);
  const valuationSectionRef = useRef<HTMLDivElement>(null);
  const newsSectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer でセクション表示を追跡
  useEffect(() => {
    // analyticsオブジェクトが存在しない場合は何もしない
    if (!analytics) return;

    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -10% 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.getAttribute('data-section');
          if (sectionName) {
            analytics.trackSectionView(decodedSymbol, sectionName);
          }
        }
      });
    }, observerOptions);

    // 各セクションを監視対象に追加
    const sections = [
      { ref: chartSectionRef, name: 'chart' },
      { ref: performanceSectionRef, name: 'performance_dividend' },
      { ref: valuationSectionRef, name: 'valuation_company' },
      { ref: newsSectionRef, name: 'news_peers' },
    ];

    sections.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [decodedSymbol]); // analyticsを依存配列から削除

  // ページ離脱時の滞在時間追跡
  useEffect(() => {
    // analyticsオブジェクトが存在しない場合は何もしない
    if (!analytics) return;

    const handleBeforeUnload = () => {
      analytics.trackPageTimeSpent(decodedSymbol);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        analytics.trackPageTimeSpent(decodedSymbol);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // コンポーネントアンマウント時にも滞在時間を記録
      analytics.trackPageTimeSpent(decodedSymbol);
    };
  }, [decodedSymbol]); // analyticsを依存配列から削除

  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)] pt-20">
      {/* 共通ヘッダー */}
      <MarketHeader
        symbol={decodedSymbol}
        marketName={marketData?.name}
        isLoadingMarketData={isLoading}
        price={marketData?.price}
        change={marketData?.change}
        changePercent={marketData?.changePercent}
        isPositive={marketData?.isPositive}
        showPriceInfo={true}
        isBookmarked={isBookmarked}
        onToggleBookmark={toggleBookmark}
        showAddButton={true}
        showBookmarkButton={true}
        showSearchButton={true}
      />

      <div className="max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto p-2 sm:p-4 sm:px-4">
        <ErrorMessage type="marketDetails" />

        <ErrorMessage type="chartData" />

        {/* 新しいダッシュボード型レイアウト */}
        <div className="space-y-6 mb-6">
          {/* メインチャート */}
          {loadingStates.chartData ? (
            <div className="bg-[var(--color-surface)] rounded-xl p-6 shadow-lg animate-pulse">
              <div className="h-[300px] bg-gray-200 dark:bg-[var(--color-surface-3)] rounded-lg"></div>
              <div className="mt-4 flex justify-center">
                <div className="text-sm text-[var(--color-gray-500)] dark:text-[var(--color-text-muted)]">
                  📊 チャートデータを読み込み中...
                </div>
              </div>
            </div>
          ) : (
            <div ref={chartSectionRef} data-section="chart" className="relative">
              <EnhancedStockChart
                data={enhancedChartData}
                selectedPeriod={selectedPeriod}
                onPeriodChange={handlePeriodChange}
              />
              {/* チャート専用ローディングオーバーレイ */}
              {isChartLoading && (
                <div className="absolute inset-0 bg-[var(--color-surface)]/80 dark:bg-[var(--color-surface-2)]/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 border-3 border-[var(--color-lp-mint)]/30 border-t-[var(--color-lp-mint)] rounded-full animate-spin"></div>
                    <p className="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)]">
                      チャートを更新中...
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* パフォーマンスと配当情報 */}
          <div
            ref={performanceSectionRef}
            data-section="performance_dividend"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* パフォーマンスカード */}
            {loadingStates.marketData ? (
              <div className="bg-[var(--color-surface)] rounded-xl p-6 shadow-lg animate-pulse">
                <div className="h-[200px] bg-gray-200 dark:bg-[var(--color-surface-3)] rounded-lg"></div>
                <div className="mt-4 flex justify-center">
                  <div className="text-sm text-[var(--color-gray-500)] dark:text-[var(--color-text-muted)]">
                    📈 パフォーマンスデータを読み込み中...
                  </div>
                </div>
              </div>
            ) : (
              <PerformanceCard
                performanceData={mockPerformanceData}
                currentPrice={parseFloat(marketData?.price?.replace(/[¥,$]/g, '') || '0')}
              />
            )}

            {/* 配当カード */}
            {loadingStates.fundamentalData ? (
              <div className="bg-[var(--color-surface)] rounded-xl p-6 shadow-lg animate-pulse">
                <div className="h-[200px] bg-gray-200 dark:bg-[var(--color-surface-3)] rounded-lg"></div>
                <div className="mt-4 flex justify-center">
                  <div className="text-sm text-[var(--color-gray-500)] dark:text-[var(--color-text-muted)]">
                    💰 配当データを読み込み中...
                  </div>
                </div>
              </div>
            ) : (
              <DividendCard
                currentYield={mockDividendData.currentYield}
                dividendHistory={mockDividendData.dividendHistory}
                nextExDate={mockDividendData.nextExDate}
                annualDividend={mockDividendData.annualDividend}
              />
            )}
          </div>

          {/* バリュエーションと企業情報 */}
          <div
            ref={valuationSectionRef}
            data-section="valuation_company"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* バリュエーションカード */}
            {loadingStates.fundamentalData ? (
              <div className="bg-[var(--color-surface)] rounded-xl p-6 shadow-lg animate-pulse">
                <div className="h-[200px] bg-gray-200 dark:bg-[var(--color-surface-3)] rounded-lg"></div>
                <div className="mt-4 flex justify-center">
                  <div className="text-sm text-[var(--color-gray-500)] dark:text-[var(--color-text-muted)]">
                    📊 バリュエーションデータを読み込み中...
                  </div>
                </div>
              </div>
            ) : (
              <ValuationScoreCard
                valuationData={{
                  pbr: mockValuationData.pbr,
                  per: mockValuationData.per,
                  industryAvgPbr: mockValuationData.industryAvgPbr,
                  industryAvgPer: mockValuationData.industryAvgPer,
                  industryName: mockValuationData.industryName,
                }}
              />
            )}

            {/* 企業情報カード */}
            {loadingStates.marketData ? (
              <div className="bg-[var(--color-surface)] rounded-xl p-6 shadow-lg animate-pulse">
                <div className="h-[200px] bg-gray-200 dark:bg-[var(--color-surface-3)] rounded-lg"></div>
                <div className="mt-4 flex justify-center">
                  <div className="text-sm text-[var(--color-gray-500)] dark:text-[var(--color-text-muted)]">
                    🏢 企業情報を読み込み中...
                  </div>
                </div>
              </div>
            ) : (
              <CompanyProfileCard
                companyData={{
                  name: mockCompanyData.name,
                  logoUrl: mockCompanyData.logoUrl,
                  website: mockCompanyData.website,
                  description: mockCompanyData.description,
                  industry: mockCompanyData.industry,
                  sector: mockCompanyData.sector,
                  employees: mockCompanyData.employees,
                  founded: mockCompanyData.founded,
                  headquarters: mockCompanyData.headquarters,
                  marketCap: mockCompanyData.marketCap,
                }}
              />
            )}
          </div>

          {/* ニュースと競合他社 */}
          <div
            ref={newsSectionRef}
            data-section="news_peers"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* ニュースカード */}
            <div className="bg-[var(--color-surface)] rounded-xl p-6 shadow-lg">
              <NewsCard newsItems={mockNewsData} />
            </div>

            {/* 競合他社カード */}
            {loadingStates.relatedMarkets ? (
              <div className="bg-[var(--color-surface)] rounded-xl p-6 shadow-lg animate-pulse">
                <div className="h-[200px] bg-gray-200 dark:bg-[var(--color-surface-3)] rounded-lg"></div>
                <div className="mt-4 flex justify-center">
                  <div className="text-sm text-[var(--color-gray-500)] dark:text-[var(--color-text-muted)]">
                    🔗 関連銘柄を読み込み中...
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[var(--color-surface)] rounded-xl p-6 shadow-lg">
                <PeersCard peers={mockPeersData} industryName="自動車" />
              </div>
            )}
          </div>
        </div>

        {/* シミュレーションページ遷移ボタン */}
        <button
          className="w-full h-12 mt-2 mb-6 rounded-full bg-[var(--color-primary)] text-white font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-[var(--color-primary-dark)] transition"
          onClick={() => {
            // アナリティクス追跡
            if (analytics) {
              analytics.trackSimulationButtonClick(decodedSymbol, marketData?.name);
            }
            router.push(`/markets/${symbol}/simulation`);
          }}
          aria-label={`${marketData?.name || ''}の資産シミュレーションページへ遷移`}
        >
          <TrendingUp className="w-5 h-5" />
          この銘柄でシミュレーション
        </button>

        {/* 一般的なエラー表示 */}
        <ErrorMessage type="general" />
      </div>
    </div>
  );
}
