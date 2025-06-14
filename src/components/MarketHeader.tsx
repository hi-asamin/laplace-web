'use client';

import { ChevronLeft, Plus, Bookmark, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MarketHeaderProps {
  // 銘柄情報
  symbol?: string;
  marketName?: string;
  isLoadingMarketData?: boolean;

  // 価格情報
  price?: string;
  change?: string;
  changePercent?: string;
  isPositive?: boolean;
  showPriceInfo?: boolean;

  // ナビゲーション
  onGoBack?: () => void;
  onNavigateToMarketDetail?: () => void;

  // ボタンの表示制御
  showAddButton?: boolean;
  showBookmarkButton?: boolean;
  showSearchButton?: boolean;

  // ブックマーク状態
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;

  // その他のアクション
  onSearch?: () => void;
  onAdd?: () => void;

  // カスタムタイトル（銘柄名がない場合）
  customTitle?: string;

  className?: string;
}

export default function MarketHeader({
  symbol,
  marketName,
  isLoadingMarketData = false,
  price,
  change,
  changePercent,
  isPositive,
  showPriceInfo = false,
  onGoBack,
  onNavigateToMarketDetail,
  showAddButton = false,
  showBookmarkButton = true,
  showSearchButton = true,
  isBookmarked = false,
  onToggleBookmark,
  onSearch,
  onAdd,
  customTitle,
  className = '',
}: MarketHeaderProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      router.back();
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    } else {
      router.push('/search');
    }
  };

  const handleNavigateToMarketDetail = () => {
    if (onNavigateToMarketDetail) {
      onNavigateToMarketDetail();
    } else if (symbol && symbol !== 'self') {
      router.push(`/markets/${symbol}`);
    }
  };

  const handleToggleBookmark = () => {
    if (onToggleBookmark) {
      onToggleBookmark();
    }
  };

  const handleAdd = () => {
    if (onAdd) {
      onAdd();
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[var(--color-surface-1)]/90 backdrop-blur-md border-b border-[var(--color-gray-200)] dark:border-[var(--color-surface-3)] py-4 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* 左側: 戻るボタン */}
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-surface-2)] transition-colors"
            aria-label="戻る"
          >
            <ChevronLeft className="w-6 h-6 text-[var(--color-gray-700)] dark:text-[var(--color-text-primary)]" />
          </button>

          {/* 中央: 銘柄名と価格情報 */}
          <div className="flex-1 flex items-center justify-center px-2 min-w-0">
            {isLoadingMarketData ? (
              <div className="animate-pulse flex items-center space-x-2">
                <div className="h-5 bg-gray-200 dark:bg-[var(--color-surface-3)] rounded w-20"></div>
                {showPriceInfo && (
                  <div className="h-4 bg-gray-200 dark:bg-[var(--color-surface-3)] rounded w-12"></div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4 min-w-0">
                {/* 銘柄名 */}
                <div className="min-w-0">
                  {marketName ? (
                    <button
                      onClick={handleNavigateToMarketDetail}
                      className="text-lg sm:text-xl font-bold text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)] hover:text-[var(--color-lp-mint)] transition-colors truncate"
                      aria-label={`${marketName}の詳細ページへ`}
                    >
                      {marketName}
                    </button>
                  ) : symbol && symbol !== 'self' ? (
                    <button
                      onClick={handleNavigateToMarketDetail}
                      className="text-lg sm:text-xl font-bold text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)] hover:text-[var(--color-lp-mint)] transition-colors truncate"
                      aria-label={`${symbol}の詳細ページへ`}
                    >
                      {symbol.toUpperCase()}
                    </button>
                  ) : customTitle ? (
                    <h1 className="text-lg sm:text-xl font-bold text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)] truncate">
                      {customTitle}
                    </h1>
                  ) : (
                    <h1 className="text-lg sm:text-xl font-bold text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)]">
                      銘柄詳細
                    </h1>
                  )}
                </div>

                {/* 価格情報 */}
                {showPriceInfo && price && (
                  <div className="flex flex-col items-end flex-shrink-0">
                    <div className="text-base sm:text-lg font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                      {price}
                    </div>
                    {changePercent && (
                      <div
                        className={`flex items-center text-xs font-medium ${
                          changePercent === '0%' ||
                          changePercent === '0.0%' ||
                          changePercent === '+0%' ||
                          changePercent === '+0.0%'
                            ? 'text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)]'
                            : isPositive
                              ? 'text-[var(--color-success)]'
                              : 'text-[var(--color-danger)]'
                        }`}
                      >
                        {changePercent !== '0%' &&
                          changePercent !== '0.0%' &&
                          changePercent !== '+0%' &&
                          changePercent !== '+0.0%' && (
                            <>
                              {isPositive ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                              )}
                            </>
                          )}
                        <span className="whitespace-nowrap">{changePercent}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 右側: アクションボタン */}
          <div className="flex items-center gap-1">
            {/* 追加ボタン */}
            {showAddButton && (
              <button
                onClick={handleAdd}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-surface-2)] transition-colors"
                aria-label="追加"
              >
                <Plus className="w-5 h-5 text-[var(--color-gray-700)] dark:text-[var(--color-text-primary)]" />
              </button>
            )}

            {/* ブックマークボタン */}
            {showBookmarkButton && (
              <button
                onClick={handleToggleBookmark}
                className={`flex items-center justify-center w-9 h-9 rounded-full hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-surface-2)] transition-colors ${
                  isBookmarked
                    ? 'text-[var(--color-lp-mint)]'
                    : 'text-[var(--color-gray-700)] dark:text-[var(--color-text-primary)]'
                }`}
                aria-label={isBookmarked ? 'ブックマークを解除' : 'ブックマークに追加'}
              >
                <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            )}

            {/* 検索ボタン */}
            {showSearchButton && (
              <button
                onClick={handleSearch}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-surface-2)] transition-colors"
                aria-label="検索"
              >
                <Search className="w-5 h-5 text-[var(--color-gray-700)] dark:text-[var(--color-text-primary)]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
