'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { TrendingUp } from 'lucide-react';
import { getChartData } from '@/lib/api';
import { MarketDetails, ChartData, FundamentalData, RelatedMarket } from '@/types/api';

import { getCurrencyFromSymbol } from '@/utils/currency';
import { useMarketDetailAnalytics } from '@/hooks/useMarketDetailAnalytics';

// コンポーネントのインポート
import EnhancedStockChart from '@/components/EnhancedStockChart';
import PerformanceCard from '@/components/PerformanceCard';
import DividendCard from '@/components/DividendCard';
import DividendVisualizationCard from '@/components/DividendVisualizationCard';
import ValuationScoreCard from '@/components/ValuationScoreCard';
import CompanyProfileCard from '@/components/CompanyProfileCard';
import NewsCard from '@/components/NewsCard';
import PeersCard from '@/components/PeersCard';
import MarketHeader from '@/components/MarketHeader';

interface ServerData {
  marketData: MarketDetails | null;
  chartData: ChartData | null;
  fundamentalData: FundamentalData | null;
  relatedMarkets: RelatedMarket[];
  symbol: string;
}

interface MarketDetailClientProps {
  initialData: ServerData;
  symbol: string;
}

export default function MarketDetailClient({ initialData, symbol }: MarketDetailClientProps) {
  const router = useRouter();
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // サーバーから受け取った初期データを状態として設定
  const [marketData] = useState(initialData.marketData);
  const [chartData, setChartData] = useState(initialData.chartData);
  const [fundamentalData] = useState(initialData.fundamentalData);
  const [relatedMarkets] = useState(initialData.relatedMarkets);

  const decodedSymbol = initialData.symbol;

  // アナリティクス
  const analytics = useMarketDetailAnalytics();

  // ブックマークの切り替え
  const toggleBookmark = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);

    if (analytics) {
      analytics.trackBookmarkToggle(decodedSymbol, newBookmarkState ? 'add' : 'remove');
    }
  };

  // チャートデータの動的読み込み（期間変更時のみ）
  const loadChartData = useCallback(
    async (symbolValue: string, period: string) => {
      try {
        setIsChartLoading(true);
        const data = await getChartData(symbolValue, period);
        setChartData(data);

        if (analytics) {
          analytics.trackDataLoadComplete(symbolValue, `chart_data_${period}`, Date.now());
        }
      } catch (error) {
        console.error('Chart data loading error:', error);
        if (analytics) {
          analytics.trackError(symbolValue, error as Error, 'chart_data_load');
        }
      } finally {
        setIsChartLoading(false);
      }
    },
    [analytics]
  );

  // 期間変更ハンドラー
  const handlePeriodChange = (period: string) => {
    const previousPeriod = selectedPeriod;
    setSelectedPeriod(period);

    if (analytics) {
      analytics.trackChartPeriodChange(decodedSymbol, previousPeriod, period);
    }

    // 初期データと異なる期間の場合のみ新しいデータを取得
    if (period !== '1Y') {
      loadChartData(decodedSymbol, period);
    }
  };

  // ページビュー追跡
  useEffect(() => {
    if (decodedSymbol && marketData?.name && analytics) {
      analytics.trackPageView(decodedSymbol, marketData.name);
    }
  }, [decodedSymbol, marketData?.name, analytics]);

  // パフォーマンスデータの計算
  const performanceData = useMemo(() => {
    if (!chartData?.data || chartData.data.length === 0) {
      return [
        { period: '1D', return: 0, label: '1日' },
        { period: '1W', return: 0, label: '1週間' },
        { period: '1M', return: 0, label: '1ヶ月' },
        { period: '6M', return: 0, label: '6ヶ月' },
        { period: '1Y', return: 0, label: '1年' },
      ];
    }

    const data = chartData.data.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const currentPrice = data[data.length - 1]?.close || 0;
    const currentDate = new Date();

    const previousDayPrice = data.length >= 2 ? data[data.length - 2]?.close || 0 : currentPrice;

    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(currentDate.getTime() - 180 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(currentDate.getTime() - 365 * 24 * 60 * 60 * 1000);

    const findPriceByDate = (targetDate: Date) => {
      const sortedData = data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const targetPoint = sortedData.find((point) => new Date(point.date) >= targetDate);
      if (targetPoint) return targetPoint.close;

      const pastData = sortedData.filter((point) => new Date(point.date) < targetDate);
      if (pastData.length > 0) return pastData[pastData.length - 1].close;

      return currentPrice;
    };

    const calculateReturn = (startPrice: number) => {
      if (startPrice === 0) return 0;
      return ((currentPrice - startPrice) / startPrice) * 100;
    };

    return [
      { period: '1D', return: calculateReturn(previousDayPrice), label: '1日' },
      { period: '1W', return: calculateReturn(findPriceByDate(oneWeekAgo)), label: '1週間' },
      { period: '1M', return: calculateReturn(findPriceByDate(oneMonthAgo)), label: '1ヶ月' },
      { period: '6M', return: calculateReturn(findPriceByDate(sixMonthsAgo)), label: '6ヶ月' },
      { period: '1Y', return: calculateReturn(findPriceByDate(oneYearAgo)), label: '1年' },
    ];
  }, [chartData]);

  // 配当データの計算（簡略化版）
  const dividendData = useMemo(() => {
    const currency = getCurrencyFromSymbol(decodedSymbol);

    const defaultData = {
      currentYield: 0,
      dividendHistory: [] as { year: string; dividend: number; isEstimate?: boolean }[],
      nextExDate: undefined as string | undefined,
      annualDividend: 0,
      currency,
      dividendAnalysis: {
        totalYears: 0,
        dividendCutYears: [],
        hasDividendCuts: false,
        dividendCutCount: 0,
        consecutiveGrowthYears: 0,
        averageGrowthRate: 0,
        stability: 'insufficient-data' as const,
      },
    };

    if (!fundamentalData?.dividendData) return defaultData;

    const apiDividendData = fundamentalData.dividendData;
    let currentYield = 0;
    if (apiDividendData.dividendYield) {
      const yieldValue = parseFloat(apiDividendData.dividendYield.replace('%', ''));
      currentYield = yieldValue;
    }

    const annualDividend = apiDividendData.dividend
      ? parseFloat(apiDividendData.dividend.replace(/[¥$,]/g, ''))
      : 0;

    return {
      ...defaultData,
      currentYield,
      annualDividend,
      nextExDate: apiDividendData.exDividendDate,
    };
  }, [fundamentalData, decodedSymbol]);

  // その他のデータ計算（簡略化）
  const dividendVisualizationData = useMemo(() => {
    if (!fundamentalData?.dividendData || !marketData?.price) {
      return { currentPrice: 0, dividendYield: 0, annualDividend: 0 };
    }

    const currentPrice = parseFloat(marketData.price.replace(/[¥$,]/g, ''));
    const dividendYield = dividendData.currentYield;
    const annualDividend = dividendData.annualDividend;

    return { currentPrice, dividendYield, annualDividend };
  }, [fundamentalData, marketData, dividendData]);

  const valuationData = useMemo(() => {
    const defaultData = {
      pbr: 0,
      per: 0,
      industryAvgPbr: 1.5,
      industryAvgPer: 15.0,
      industryName: marketData?.industry || marketData?.sector || '一般',
    };

    if (!fundamentalData?.keyMetrics) return defaultData;

    const keyMetrics = fundamentalData.keyMetrics;
    return {
      ...defaultData,
      pbr: keyMetrics.priceToBook ? parseFloat(keyMetrics.priceToBook) : 0,
      per: keyMetrics.peRatio ? parseFloat(keyMetrics.peRatio) : 0,
    };
  }, [fundamentalData, marketData]);

  const companyData = useMemo(() => {
    return {
      name: marketData?.name || '',
      logoUrl: marketData?.logoUrl,
      website: marketData?.website,
      description: marketData?.description || '',
      industry: marketData?.industry || '',
      sector: marketData?.sector || '',
      employees: 0,
      founded: '',
      headquarters: '',
      marketCap: marketData?.tradingInfo?.marketCap || '',
    };
  }, [marketData]);

  const mockNewsData = [
    {
      id: '1',
      title: `${marketData?.name || '企業'}の最新ニュース`,
      summary: '最新の企業動向をお届けします。',
      publishedAt: new Date().toISOString(),
      source: 'Laplace',
      url: '#',
    },
  ];

  const enhancedChartData = useMemo(() => {
    if (!chartData?.data) return [];
    return chartData.data.map((point) => ({
      date: point.date,
      close: point.close,
    }));
  }, [chartData]);

  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)] pt-20">
      <MarketHeader
        symbol={decodedSymbol}
        marketName={marketData?.name}
        isLoadingMarketData={false}
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
        <div className="space-y-6 mb-6">
          {/* メインチャート */}
          <div className="relative">
            <EnhancedStockChart
              data={enhancedChartData}
              selectedPeriod={selectedPeriod}
              onPeriodChange={handlePeriodChange}
            />
            {isChartLoading && (
              <div className="absolute inset-0 bg-[var(--color-surface)]/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-8 h-8 border-3 border-[var(--color-lp-mint)]/30 border-t-[var(--color-lp-mint)] rounded-full animate-spin"></div>
                  <p className="text-sm text-[var(--color-gray-600)]">チャートを更新中...</p>
                </div>
              </div>
            )}
          </div>

          {/* パフォーマンスと配当情報 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceCard
              performanceData={performanceData}
              currentPrice={parseFloat(marketData?.price?.replace(/[¥,$]/g, '') || '0')}
            />
            <DividendCard
              currentYield={dividendData.currentYield}
              dividendHistory={dividendData.dividendHistory}
              nextExDate={dividendData.nextExDate}
              annualDividend={dividendData.annualDividend}
              dividendAnalysis={dividendData.dividendAnalysis}
              currency={dividendData.currency}
            />
          </div>

          {/* 配当シミュレーション */}
          <DividendVisualizationCard
            symbol={decodedSymbol}
            marketName={marketData?.name}
            currentPrice={dividendVisualizationData.currentPrice}
            dividendYield={dividendVisualizationData.dividendYield}
            annualDividend={dividendVisualizationData.annualDividend}
          />

          {/* バリュエーションと企業情報 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ValuationScoreCard valuationData={valuationData} />
            <CompanyProfileCard companyData={companyData} />
          </div>

          {/* ニュースと競合他社 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[var(--color-surface)] rounded-xl p-6 shadow-lg">
              <NewsCard newsItems={mockNewsData} />
            </div>
            <div className="bg-[var(--color-surface)] rounded-xl p-6 shadow-lg">
              <PeersCard
                peers={relatedMarkets}
                industryName={marketData?.industry || marketData?.sector}
              />
            </div>
          </div>
        </div>

        {/* シミュレーションページ遷移ボタン */}
        <button
          className="w-full h-12 mt-2 mb-6 rounded-full bg-[var(--color-primary)] text-white font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-[var(--color-primary-dark)] transition"
          onClick={() => {
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
      </div>
    </div>
  );
}
