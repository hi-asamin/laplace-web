'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Bookmark, Search } from 'lucide-react';
// 開発環境でのアナリティクステスト用
import '@/utils/analyticsTestUtils';
import AssetAccumulationSimulator, {
  AssetAccumulationSettingsPanel,
} from '@/components/AssetAccumulationSimulator';
import AssetDistributionSimulator, {
  AssetDistributionSettingsPanel,
} from '@/components/AssetDistributionSimulator';
import RelatedStocksSection from '@/components/RelatedStocksSection';
import {
  useAssetAccumulationSimulation,
  useAssetDistributionWithInheritance,
} from '@/hooks/useSimulation';
import { useSimulationAnalytics } from '@/hooks/useSimulationAnalytics';
import { SlidersHorizontal, X } from 'lucide-react';
import SimulationSettingsBottomSheet from '@/components/SimulationSettingsBottomSheet';
import { SimulationSettings, SimulationResult } from '@/types/simulationTypes';
import { MarketDetails } from '@/types/api';
import { getMarketDetails } from '@/lib/api';

interface PageParams {
  symbol: string;
  [key: string]: string | string[] | undefined;
}

export default function SimulationPage() {
  const params = useParams<PageParams>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { symbol } = params;

  // 銘柄データの状態
  const [marketData, setMarketData] = useState<MarketDetails | null>(null);
  const [isLoadingMarketData, setIsLoadingMarketData] = useState(false);

  // URL パラメータから初期設定を取得
  const initialQuestionType = searchParams.get('q') || 'total-assets';
  const showDistribution = searchParams.get('mode') === 'distribution';

  // rateクエリがあるかどうかを判定
  const hasRateQuery = searchParams.get('rate') || searchParams.get('averageYield');

  // シミュレーション初期化の準備完了状態
  const [isSimulationReady, setIsSimulationReady] = useState(!!hasRateQuery);

  // 銘柄データを取得
  useEffect(() => {
    if (symbol && symbol !== 'self') {
      setIsLoadingMarketData(true);
      getMarketDetails(symbol)
        .then((data) => {
          setMarketData(data);
          // rateクエリがない場合は、marketData取得完了でシミュレーション準備完了
          if (!hasRateQuery) {
            setIsSimulationReady(true);
          }
        })
        .catch((error) => {
          console.error('銘柄データ取得エラー:', error);
          setMarketData(null);
          // エラーの場合もシミュレーション準備完了（デフォルト値で実行）
          if (!hasRateQuery) {
            setIsSimulationReady(true);
          }
        })
        .finally(() => {
          setIsLoadingMarketData(false);
        });
    } else {
      // symbolが'self'の場合は即座に準備完了
      setIsSimulationReady(true);
    }
  }, [symbol, hasRateQuery]);

  // 戻るボタンのハンドラー
  const handleGoBack = () => {
    router.back();
  };

  // 検索ボタンのハンドラー
  const handleSearch = () => {
    router.push('/search');
  };

  // 銘柄詳細ページへの遷移ハンドラー
  const handleNavigateToMarketDetail = () => {
    if (symbol && symbol !== 'self') {
      router.push(`/markets/${symbol}`);
    }
  };

  // URLパラメータから初期設定を構築
  const getInitialSettings = () => {
    const settings: Partial<SimulationSettings> = {
      questionType: initialQuestionType as any,
    };

    // 各パラメータを取得して設定
    const years = searchParams.get('years');
    if (years) settings.years = parseInt(years);

    const monthlyAmount = searchParams.get('monthlyAmount');
    if (monthlyAmount) settings.monthlyAmount = parseInt(monthlyAmount);

    // 利回りの優先順位: rate > averageYield > dividendYield > default
    const rate = searchParams.get('rate');
    const averageYield = searchParams.get('averageYield');

    if (rate) {
      settings.averageYield = parseFloat(rate);
    } else if (averageYield) {
      settings.averageYield = parseFloat(averageYield);
    } else if (marketData?.dividendYield) {
      // URLパラメータがない場合はdividendYieldを使用（安全な数値変換）
      const dividendYieldNum =
        typeof marketData.dividendYield === 'number'
          ? marketData.dividendYield
          : parseFloat(String(marketData.dividendYield));

      if (!isNaN(dividendYieldNum) && dividendYieldNum > 0) {
        settings.averageYield = dividendYieldNum;
      }
    }

    const targetAmount = searchParams.get('targetAmount');
    if (targetAmount) settings.targetAmount = parseInt(targetAmount);

    const initialPrincipal = searchParams.get('initialPrincipal');
    if (initialPrincipal) settings.initialPrincipal = parseInt(initialPrincipal);

    return settings;
  };

  // 資産形成シミュレーションの状態を追跡
  const accumulationSimulation = useAssetAccumulationSimulation();
  const [inheritedAssets, setInheritedAssets] = useState<number | undefined>(undefined);
  const distributionSimulation = useAssetDistributionWithInheritance(undefined, inheritedAssets);

  // シミュレーション準備完了後に初期設定を適用
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (isSimulationReady && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      const initialSettings = getInitialSettings();

      // 初期設定を適用
      if (Object.keys(initialSettings).length > 0) {
        accumulationSimulation.updateMultipleSettings(initialSettings);
      }
    }
  }, [isSimulationReady]);

  // アナリティクストラッキング
  const analytics = useSimulationAnalytics();

  // ハッシュ監視
  const [activeTab, setActiveTab] = useState<string>('#accumulation');
  const [previousTab, setPreviousTab] = useState<string>('#accumulation');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentHash = window.location.hash || '#accumulation';
      setActiveTab(currentHash);

      const onHashChange = () => {
        const newHash = window.location.hash || '#accumulation';
        const oldHash = activeTab;
        setActiveTab(newHash);
        setPreviousTab(oldHash);

        // タブ切り替えイベントをトラッキング
        if (oldHash !== newHash) {
          analytics.trackTabSwitch(oldHash.replace('#', ''), newHash.replace('#', ''));
        }
      };

      window.addEventListener('hashchange', onHashChange);
      return () => window.removeEventListener('hashchange', onHashChange);
    }
  }, [activeTab, analytics]);

  // ボトムシート開閉
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  // ドロップダウン開閉state
  const [isAccumulationDropdownOpen, setIsAccumulationDropdownOpen] = useState(false);
  const [isDistributionDropdownOpen, setIsDistributionDropdownOpen] = useState(false);

  // 資産形成の結果が変更されたときに、資産活用シミュレーターに連携
  useEffect(() => {
    if (accumulationSimulation.result.isSuccess) {
      let newInheritedAssets: number | undefined;

      if (accumulationSimulation.settings.questionType === 'total-assets') {
        // 資産総額計算の場合は計算結果を使用
        newInheritedAssets = accumulationSimulation.result.calculatedValue;
      } else if (
        accumulationSimulation.settings.questionType === 'required-yield' ||
        accumulationSimulation.settings.questionType === 'required-monthly' ||
        accumulationSimulation.settings.questionType === 'required-years'
      ) {
        // その他の場合は目標金額を使用
        newInheritedAssets = accumulationSimulation.settings.targetAmount;
      }

      if (newInheritedAssets && newInheritedAssets > 0) {
        setInheritedAssets(newInheritedAssets);

        // 資産連携イベントをトラッキング
        analytics.trackAssetInheritance(
          newInheritedAssets,
          'accumulation_simulator',
          'distribution_simulator'
        );
      }
    }
  }, [
    accumulationSimulation.result.calculatedValue,
    accumulationSimulation.result.isSuccess,
    accumulationSimulation.settings.questionType,
    accumulationSimulation.settings.targetAmount,
    analytics,
  ]);

  // タブ切り替え時にpurposeを強制
  const prevActiveTabRef = useRef(activeTab);
  useEffect(() => {
    // activeTabが実際に変更された場合のみ処理
    if (prevActiveTabRef.current !== activeTab) {
      prevActiveTabRef.current = activeTab;

      if (activeTab === '#accumulation' && accumulationSimulation.settings.purpose !== 'save') {
        accumulationSimulation.resetToDefaults();
      }
      if (activeTab === '#distribution' && distributionSimulation.settings.purpose !== 'use') {
        distributionSimulation.resetToDefaults();
      }
    }
  }, [activeTab]); // 依存配列からシミュレーションオブジェクトを削除

  // スクロール位置に応じてタブを自動切り替え
  useEffect(() => {
    const accumulation = document.getElementById('accumulation');
    const distribution = document.getElementById('distribution');
    if (!accumulation || !distribution) return;

    let isUserScrolling = false;
    let scrollTimeout: NodeJS.Timeout;
    let rafId: number;

    const checkTabPosition = () => {
      // ナビゲーションの高さを取得（sticky headerの分を考慮）
      const navHeight = 120; // ページヘッダー + ナビゲーションの高さ
      const scrollPosition = window.scrollY + navHeight;

      const accumulationTop = accumulation.offsetTop;
      const accumulationBottom = accumulationTop + accumulation.offsetHeight;
      const distributionTop = distribution.offsetTop;

      // スクロール位置に基づいてタブを決定
      let newActiveTab = activeTab;

      if (scrollPosition < accumulationBottom - 200) {
        // 資産形成セクションの範囲内（下部200px手前まで）
        newActiveTab = '#accumulation';
      } else if (scrollPosition >= distributionTop - 100) {
        // 資産活用セクションの範囲内（上部100px手前から）
        newActiveTab = '#distribution';
      }

      // タブが変更された場合のみ更新
      if (newActiveTab !== activeTab) {
        setActiveTab(newActiveTab);
        setPreviousTab(activeTab);

        // ハッシュを更新（履歴に追加しない）
        if (typeof window !== 'undefined' && window.history) {
          window.history.replaceState(null, '', newActiveTab);
        }

        // タブ切り替えイベントをトラッキング
        analytics.trackTabSwitch(activeTab.replace('#', ''), newActiveTab.replace('#', ''));
      }
    };

    const handleScroll = () => {
      isUserScrolling = true;
      clearTimeout(scrollTimeout);

      // スクロール停止を検出するためのタイムアウト
      scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 150);

      // requestAnimationFrameでパフォーマンスを最適化
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(checkTabPosition);
    };

    // スクロールイベントリスナーを追加
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 初期位置でのタブ設定
    checkTabPosition();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [activeTab, analytics]);

  // ボトムシート用の安定化されたinitialSettings
  const stableInitialSettings = useMemo(() => {
    return activeTab === '#accumulation'
      ? accumulationSimulation.settings
      : distributionSimulation.settings;
  }, [activeTab, accumulationSimulation.settings, distributionSimulation.settings]);

  return (
    <main className="min-h-screen bg-[var(--color-surface)] dark:bg-[var(--color-surface-1)]">
      {/* 新しいヘッダー */}
      <div className="bg-white dark:bg-[var(--color-surface-1)] border-b border-[var(--color-gray-200)] dark:border-[var(--color-surface-3)] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* 左側: 戻るボタン */}
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-surface-2)] transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-[var(--color-gray-700)] dark:text-[var(--color-text-primary)]" />
            </button>

            {/* 中央: 銘柄名 */}
            <div className="flex-1 text-center">
              {isLoadingMarketData ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-[var(--color-surface-3)] rounded w-24 mx-auto"></div>
                </div>
              ) : marketData ? (
                <button
                  onClick={handleNavigateToMarketDetail}
                  className="text-xl font-bold text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)] hover:text-[var(--color-lp-mint)] transition-colors"
                >
                  {marketData.name}
                </button>
              ) : symbol && symbol !== 'self' ? (
                <button
                  onClick={handleNavigateToMarketDetail}
                  className="text-xl font-bold text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)] hover:text-[var(--color-lp-mint)] transition-colors"
                >
                  {symbol.toUpperCase()}
                </button>
              ) : (
                <h1 className="text-xl font-bold text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)]">
                  資産シミュレーション
                </h1>
              )}
            </div>

            {/* 右側: アクションボタン */}
            <div className="flex items-center gap-2">
              {/* 追加ボタン */}
              <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-surface-2)] transition-colors">
                <Plus className="w-6 h-6 text-[var(--color-gray-700)] dark:text-[var(--color-text-primary)]" />
              </button>

              {/* ブックマークボタン */}
              <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-surface-2)] transition-colors">
                <Bookmark className="w-6 h-6 text-[var(--color-gray-700)] dark:text-[var(--color-text-primary)]" />
              </button>

              {/* 検索ボタン */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-surface-2)] transition-colors"
              >
                <Search className="w-6 h-6 text-[var(--color-gray-700)] dark:text-[var(--color-text-primary)]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ナビゲーション */}
      <div className="bg-[var(--color-surface-alt)] border-b border-[var(--color-gray-200)] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto scrollbar-none">
            <button
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('accumulation');
                if (element) {
                  const navHeight = 120; // ページヘッダー + ナビゲーションの高さ
                  const targetPosition = element.offsetTop - navHeight + 20;
                  window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                  });
                  // 手動でタブを設定
                  setActiveTab('#accumulation');
                  setPreviousTab(activeTab);
                  history.replaceState(null, '', '#accumulation');
                  analytics.trackTabSwitch(activeTab.replace('#', ''), 'accumulation');
                }
              }}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === '#accumulation'
                  ? 'border-[var(--color-lp-mint)] text-[var(--color-lp-mint)]'
                  : 'border-transparent text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] hover:border-[var(--color-gray-300)]'
              }`}
            >
              資産形成
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('distribution');
                if (element) {
                  const navHeight = 120; // ページヘッダー + ナビゲーションの高さ
                  const targetPosition = element.offsetTop - navHeight + 20;
                  window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                  });
                  // 手動でタブを設定
                  setActiveTab('#distribution');
                  setPreviousTab(activeTab);
                  history.replaceState(null, '', '#distribution');
                  analytics.trackTabSwitch(activeTab.replace('#', ''), 'distribution');
                }
              }}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === '#distribution'
                  ? 'border-[var(--color-lp-mint)] text-[var(--color-lp-mint)]'
                  : 'border-transparent text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] hover:border-[var(--color-gray-300)]'
              }`}
            >
              資産活用
            </button>
          </nav>
        </div>
      </div>

      {/* モバイル用「条件を変更する」ボタン */}
      <div className="lg:hidden">
        <button
          onClick={() => {
            setIsSettingsPanelOpen(true);
            analytics.trackBottomSheetInteraction('open', 'simulation_settings');
          }}
          className="fixed bottom-6 right-6 bg-[var(--color-lp-mint)] text-white px-6 py-3 
                     rounded-full hover:bg-[var(--color-lp-mint)]/90 transition-all hover:scale-105
                     shadow-xl flex items-center gap-2 z-40"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-medium">条件を変更する</span>
        </button>

        {/* 共通ボトムシート */}
        <SimulationSettingsBottomSheet
          open={isSettingsPanelOpen}
          onClose={() => {
            setIsSettingsPanelOpen(false);
            analytics.trackBottomSheetInteraction('close', 'simulation_settings');
          }}
          title="条件を変更する"
          initialSettings={stableInitialSettings}
          onAnalyze={(newSettings: SimulationSettings) => {
            if (activeTab === '#accumulation') {
              accumulationSimulation.updateMultipleSettings(newSettings);
              accumulationSimulation.executeSimulation();
            } else {
              distributionSimulation.updateMultipleSettings(newSettings);
              distributionSimulation.executeSimulation();
            }
            setIsSettingsPanelOpen(false);
          }}
          isAnalyzing={false}
        >
          {({
            localSettings,
            setLocalSettings,
            localResult,
          }: {
            localSettings: SimulationSettings;
            setLocalSettings: (settings: SimulationSettings) => void;
            localResult: SimulationResult;
          }) =>
            activeTab === '#accumulation' ? (
              <AssetAccumulationSettingsPanel
                settings={localSettings}
                updateSetting={(key, value) => setLocalSettings({ ...localSettings, [key]: value })}
                setQuestionType={(questionType) =>
                  setLocalSettings({ ...localSettings, questionType })
                }
                isQuestionDropdownOpen={isAccumulationDropdownOpen}
                setIsQuestionDropdownOpen={setIsAccumulationDropdownOpen}
                isMobile={true}
                result={localResult}
              />
            ) : (
              <AssetDistributionSettingsPanel
                settings={localSettings}
                updateSetting={(key, value) => setLocalSettings({ ...localSettings, [key]: value })}
                setQuestionType={(questionType) =>
                  setLocalSettings({ ...localSettings, questionType })
                }
                isQuestionDropdownOpen={isDistributionDropdownOpen}
                setIsQuestionDropdownOpen={setIsDistributionDropdownOpen}
                isMobile={true}
                result={localResult}
              />
            )
          }
        </SimulationSettingsBottomSheet>
      </div>

      {/* 資産形成シミュレーター */}
      <div id="accumulation">
        {!isSimulationReady && !hasRateQuery ? (
          <div className="py-20 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-[var(--color-surface-3)] rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-[var(--color-surface-3)] rounded w-32 mx-auto"></div>
            </div>
            <p className="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-text-secondary)] mt-4">
              銘柄データを取得中...
            </p>
          </div>
        ) : (
          <AssetAccumulationSimulator
            defaultQuestionType={initialQuestionType as any}
            externalSettings={accumulationSimulation.settings}
            externalResult={accumulationSimulation.result}
            externalIsCalculating={accumulationSimulation.isCalculating || !isSimulationReady}
            externalUpdateSetting={accumulationSimulation.updateSetting}
            externalSetQuestionType={accumulationSimulation.setQuestionType}
          />
        )}
      </div>

      {/* 連携インジケーター */}
      {inheritedAssets && (
        <div className="py-4 bg-[var(--color-surface-alt)] border-b border-[var(--color-gray-200)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4">
              <span className="text-sm text-[var(--color-gray-600)]">
                資産総額 ¥{inheritedAssets.toLocaleString()} を活用シミュレーションに連携
              </span>
              <div className="w-2 h-2 bg-[var(--color-lp-mint)] rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* 資産活用シミュレーター */}
      <div id="distribution">
        <AssetDistributionSimulator
          inheritedAssets={inheritedAssets}
          externalSettings={distributionSimulation.settings}
          externalResult={distributionSimulation.result}
          externalIsCalculating={distributionSimulation.isCalculating}
          externalUpdateSetting={distributionSimulation.updateSetting}
          externalSetQuestionType={distributionSimulation.setQuestionType}
        />
      </div>

      {/* 関連銘柄セクション */}
      <RelatedStocksSection
        currentSymbol={symbol}
        onStockClick={(clickedSymbol, currentSymbol, positionInList) => {
          analytics.trackRelatedStockClick(clickedSymbol, currentSymbol, positionInList);
        }}
      />
    </main>
  );
}
