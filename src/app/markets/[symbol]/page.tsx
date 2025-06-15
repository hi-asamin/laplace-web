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
import DividendVisualizationCard from '@/components/DividendVisualizationCard';
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

  // 実際の株価データを使用したパフォーマンス計算
  const performanceData = useMemo(() => {
    if (!chartData?.data || chartData.data.length === 0) {
      // データがない場合はダミーデータを返す
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

    // 1日のリターンは前営業日の終値と最新価格の差で計算
    const previousDayPrice = data.length >= 2 ? data[data.length - 2]?.close || 0 : currentPrice;

    // 各期間の開始日を計算（1日以外）
    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(currentDate.getTime() - 180 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(currentDate.getTime() - 365 * 24 * 60 * 60 * 1000);

    // 各期間の開始価格を見つける関数
    const findPriceByDate = (targetDate: Date) => {
      const sortedData = data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // 指定日以降の最初のデータを探す
      const targetPoint = sortedData.find((point) => new Date(point.date) >= targetDate);

      if (targetPoint) {
        return targetPoint.close;
      }

      // 指定日以降のデータがない場合、最も近い過去のデータを使用
      const pastData = sortedData.filter((point) => new Date(point.date) < targetDate);
      if (pastData.length > 0) {
        return pastData[pastData.length - 1].close;
      }

      // データがない場合は現在価格を返す
      return currentPrice;
    };

    // 各期間のリターンを計算（キャピタルゲインのみ）
    const calculateReturn = (startPrice: number) => {
      if (startPrice === 0) return 0;
      return ((currentPrice - startPrice) / startPrice) * 100;
    };

    // 1日のリターンは前営業日の終値を使用
    const oneDayReturn = calculateReturn(previousDayPrice);
    const oneWeekStartPrice = findPriceByDate(oneWeekAgo);
    const oneMonthStartPrice = findPriceByDate(oneMonthAgo);
    const sixMonthsStartPrice = findPriceByDate(sixMonthsAgo);
    const oneYearStartPrice = findPriceByDate(oneYearAgo);

    return [
      { period: '1D', return: oneDayReturn, label: '1日' },
      { period: '1W', return: calculateReturn(oneWeekStartPrice), label: '1週間' },
      { period: '1M', return: calculateReturn(oneMonthStartPrice), label: '1ヶ月' },
      { period: '6M', return: calculateReturn(sixMonthsStartPrice), label: '6ヶ月' },
      { period: '1Y', return: calculateReturn(oneYearStartPrice), label: '1年' },
    ];
  }, [chartData]);

  // 実際のAPIデータを使用した配当情報計算
  const dividendData = useMemo(() => {
    // デフォルト値（データがない場合）
    const defaultData = {
      currentYield: 0,
      dividendHistory: [] as { year: string; dividend: number; isEstimate?: boolean }[],
      nextExDate: undefined as string | undefined,
      annualDividend: 0,
    };

    if (!fundamentalData?.dividendData) {
      return defaultData;
    }

    const apiDividendData = fundamentalData.dividendData;

    // 配当利回りを取得（パーセンテージに変換）
    let currentYield = 0;
    if (apiDividendData.dividendYield) {
      const yieldStr = apiDividendData.dividendYield.replace('%', '');
      const yieldValue = parseFloat(yieldStr);

      currentYield = yieldValue;
    }

    // 年間配当額を取得
    const annualDividend = apiDividendData.dividend
      ? parseFloat(apiDividendData.dividend.replace(/[¥$,]/g, ''))
      : 0;

    // 配当履歴を取得（APIから提供される場合）
    let dividendHistory = apiDividendData.dividendHistory || [];

    // 配当履歴がない場合、現在の配当額から過去5年分を推定
    if (dividendHistory.length === 0 && annualDividend > 0) {
      const currentYear = new Date().getFullYear();
      const estimatedHistory = [];

      // 過去4年分を推定（年率2-3%の成長を仮定）
      for (let i = 4; i >= 1; i--) {
        const year = (currentYear - i).toString();
        const estimatedDividend = Math.round(annualDividend / Math.pow(1.025, i));
        estimatedHistory.push({
          year,
          dividend: estimatedDividend,
        });
      }

      // 現在年を追加
      estimatedHistory.push({
        year: currentYear.toString(),
        dividend: annualDividend,
        isEstimate: true,
      });

      dividendHistory = estimatedHistory;
    }

    return {
      currentYield,
      dividendHistory,
      nextExDate: apiDividendData.exDividendDate,
      annualDividend,
    };
  }, [fundamentalData]);

  // 配当可視化用のデータ計算
  const dividendVisualizationData = useMemo(() => {
    if (!fundamentalData?.dividendData || !marketData?.price) {
      return {
        currentPrice: 0,
        dividendYield: 0,
        annualDividend: 0,
      };
    }

    const apiDividendData = fundamentalData.dividendData;

    // 現在の株価を取得（文字列から数値に変換）
    const currentPrice = parseFloat(marketData.price.replace(/[¥$,]/g, ''));

    // 配当利回りを取得（パーセンテージに変換）
    let dividendYield = 0;
    if (apiDividendData.dividendYield) {
      const yieldStr = apiDividendData.dividendYield.replace('%', '');
      const yieldValue = parseFloat(yieldStr);

      // APIから来る値が小数形式（例：0.0258）の場合は100倍してパーセンテージに変換
      // すでにパーセンテージ形式（例：2.58）の場合はそのまま使用
      if (yieldValue < 1 && yieldValue > 0) {
        dividendYield = yieldValue * 100;
      } else {
        dividendYield = yieldValue;
      }
    }

    // 年間配当額を取得（1株あたり）
    const annualDividend = apiDividendData.dividend
      ? parseFloat(apiDividendData.dividend.replace(/[¥$,]/g, ''))
      : 0;

    return {
      currentPrice,
      dividendYield,
      annualDividend,
    };
  }, [fundamentalData, marketData]);

  // 実際のAPIデータを使用したバリュエーション計算
  const valuationData = useMemo(() => {
    // デフォルト値（データがない場合）
    const defaultData = {
      pbr: 0,
      per: 0,
      industryAvgPbr: 1.5,
      industryAvgPer: 15.0,
      industryName: marketData?.industry || marketData?.sector || '一般',
    };

    if (!fundamentalData?.keyMetrics) {
      return defaultData;
    }

    const keyMetrics = fundamentalData.keyMetrics;

    // PBR（株価純資産倍率）を取得
    const pbr = keyMetrics.priceToBook ? parseFloat(keyMetrics.priceToBook) : 0;

    // PER（株価収益率）を取得
    const per = keyMetrics.peRatio ? parseFloat(keyMetrics.peRatio) : 0;

    // APIから業界平均を取得（優先）
    const industryAverages = keyMetrics.industryAverages;
    let industryAvgPbr = defaultData.industryAvgPbr;
    let industryAvgPer = defaultData.industryAvgPer;
    let industryName = defaultData.industryName;

    if (industryAverages) {
      // APIから取得した業界平均を使用
      industryAvgPbr = industryAverages.averagePbr
        ? parseFloat(industryAverages.averagePbr)
        : defaultData.industryAvgPbr;
      industryAvgPer = industryAverages.averagePer
        ? parseFloat(industryAverages.averagePer)
        : defaultData.industryAvgPer;
      industryName = industryAverages.industryName || defaultData.industryName;
    } else {
      // フォールバック：業界・セクターに基づく推定値
      const getIndustryAverages = (industry?: string, sector?: string) => {
        const name = industry || sector || '一般';

        // 業界別の平均的なPBR/PER（実際の統計データに基づく概算値）
        const averages: { [key: string]: { pbr: number; per: number } } = {
          自動車: { pbr: 1.2, per: 12.0 },
          輸送用機器: { pbr: 1.2, per: 12.0 },
          テクノロジー: { pbr: 3.5, per: 25.0 },
          '情報・通信業': { pbr: 3.5, per: 25.0 },
          金融: { pbr: 0.8, per: 10.0 },
          銀行業: { pbr: 0.8, per: 10.0 },
          医薬品: { pbr: 2.8, per: 20.0 },
          '医療・ヘルスケア': { pbr: 2.8, per: 20.0 },
          小売: { pbr: 2.0, per: 15.0 },
          小売業: { pbr: 2.0, per: 15.0 },
          不動産: { pbr: 1.0, per: 12.0 },
          不動産業: { pbr: 1.0, per: 12.0 },
          エネルギー: { pbr: 1.5, per: 10.0 },
          '石油・ガス': { pbr: 1.5, per: 10.0 },
          素材: { pbr: 1.3, per: 12.0 },
          化学: { pbr: 1.3, per: 12.0 },
          食品: { pbr: 1.8, per: 16.0 },
          '食品・飲料': { pbr: 1.8, per: 16.0 },
          一般: { pbr: 1.5, per: 15.0 },
        };

        // 完全一致を探す
        if (averages[name]) {
          return averages[name];
        }

        // 部分一致を探す
        for (const [key, value] of Object.entries(averages)) {
          if (name.includes(key) || key.includes(name)) {
            return value;
          }
        }

        // デフォルト値を返す
        return averages['一般'];
      };

      const fallbackAvg = getIndustryAverages(marketData?.industry, marketData?.sector);
      industryAvgPbr = fallbackAvg.pbr;
      industryAvgPer = fallbackAvg.per;
      industryName = marketData?.industry || marketData?.sector || '一般';
    }

    return {
      pbr,
      per,
      industryAvgPbr,
      industryAvgPer,
      industryName,
      sampleSize: industryAverages?.sampleSize,
      lastUpdated: industryAverages?.lastUpdated,
    };
  }, [fundamentalData, marketData]);

  // 実際のAPIデータを使用した企業プロフィール計算
  const companyData = useMemo(() => {
    // APIから取得したcompanyProfileデータを優先的に使用
    const profile = marketData?.companyProfile;

    // デフォルト値（APIデータがない場合のフォールバック）
    const defaultData = {
      name: marketData?.name || 'トヨタ自動車',
      logoUrl: marketData?.logoUrl,
      website: marketData?.website || 'https://www.toyota.co.jp',
      description:
        marketData?.description ||
        '世界最大級の自動車メーカーとして、ハイブリッド技術のパイオニアであり、持続可能なモビリティソリューションを提供しています。レクサスブランドも展開し、グローバルに事業を展開しています。',
      industry: marketData?.industry || '自動車',
      sector: marketData?.sector || '輸送用機器',
      employees: 375235,
      founded: '1937',
      headquarters: '愛知県豊田市',
      marketCap: marketData?.tradingInfo?.marketCap || '35.2兆円',
    };

    // APIデータがある場合は、それを使用してデフォルト値を上書き
    if (profile) {
      return {
        name: profile.companyName || profile.name || defaultData.name,
        logoUrl: profile.logoUrl || defaultData.logoUrl,
        website: profile.website || defaultData.website,
        description: profile.businessSummary || profile.description || defaultData.description,
        industry: profile.industryTags?.[0] || profile.industry || defaultData.industry,
        sector: profile.industryTags?.[1] || profile.sector || defaultData.sector,
        employees: profile.fullTimeEmployees || profile.employees || defaultData.employees,
        founded: profile.foundationYear?.toString() || profile.founded || defaultData.founded,
        headquarters: profile.headquarters || defaultData.headquarters,
        marketCap: profile.marketCapFormatted || profile.marketCap || defaultData.marketCap,
      };
    }

    return defaultData;
  }, [marketData]);

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
                performanceData={performanceData}
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
                currentYield={dividendData.currentYield}
                dividendHistory={dividendData.dividendHistory}
                nextExDate={dividendData.nextExDate}
                annualDividend={dividendData.annualDividend}
              />
            )}
          </div>

          {/* 配当シミュレーション */}
          {loadingStates.fundamentalData ? (
            <div className="bg-[var(--color-surface)] rounded-xl p-6 shadow-lg animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-[var(--color-surface-3)] rounded w-48 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-200 dark:bg-[var(--color-surface-3)] rounded-xl h-24"
                  ></div>
                ))}
              </div>
              <div className="h-32 bg-gray-200 dark:bg-[var(--color-surface-3)] rounded-lg mb-4"></div>
              <div className="flex justify-center">
                <div className="text-sm text-[var(--color-gray-500)] dark:text-[var(--color-text-muted)]">
                  💰 配当シミュレーションを読み込み中...
                </div>
              </div>
            </div>
          ) : (
            <DividendVisualizationCard
              symbol={decodedSymbol}
              marketName={marketData?.name}
              currentPrice={dividendVisualizationData.currentPrice}
              dividendYield={dividendVisualizationData.dividendYield}
              annualDividend={dividendVisualizationData.annualDividend}
            />
          )}

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
              <ValuationScoreCard valuationData={valuationData} />
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
                  name: companyData.name,
                  logoUrl: companyData.logoUrl,
                  website: companyData.website,
                  description: companyData.description,
                  industry: companyData.industry,
                  sector: companyData.sector,
                  employees: companyData.employees,
                  founded: companyData.founded,
                  headquarters: companyData.headquarters,
                  marketCap: companyData.marketCap,
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
