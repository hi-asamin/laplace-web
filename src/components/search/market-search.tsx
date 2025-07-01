'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import { SearchResult } from '@/types/api';
import { searchMarkets } from '@/lib/api';
import { useRouter } from 'next/navigation';

// 検索コンポーネントのプロップス
interface MarketSearchProps {
  onSelect?: (result: SearchResult) => void;
}

export const MarketSearch = ({ onSelect }: MarketSearchProps) => {
  const router = useRouter();
  // 状態管理
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchResult[]>([]);
  const [swipedItem, setSwipedItem] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // タッチデバイス検出
  useEffect(() => {
    const checkTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(hover: none) and (pointer: coarse)').matches
      );
    };
    setIsTouchDevice(checkTouchDevice());
  }, []);

  // 検索履歴の取得
  useEffect(() => {
    const history = localStorage.getItem('market-search-history');
    if (history) {
      try {
        const parsedHistory = JSON.parse(history);
        setSearchHistory(parsedHistory);
      } catch (e) {
        localStorage.removeItem('market-search-history');
      }
    }
  }, []);

  // 検索履歴の保存（最大5件に制限、price情報は除外）
  const saveToHistory = (result: SearchResult) => {
    // price情報を除外したデータを保存
    const historyItem: SearchResult = {
      symbol: result.symbol,
      name: result.name,
      asset_type: result.asset_type,
      market: result.market,
      logoUrl: result.logoUrl,
      score: result.score,
      // price, change_percent は除外
    };

    const updatedHistory = [
      historyItem,
      ...searchHistory.filter((item) => item.symbol !== historyItem.symbol).slice(0, 4), // 最大5件に制限
    ];
    setSearchHistory(updatedHistory);
    localStorage.setItem('market-search-history', JSON.stringify(updatedHistory));
  };

  // 検索履歴から特定の項目を削除
  const removeFromHistory = (symbolToRemove: string) => {
    const updatedHistory = searchHistory.filter((item) => item.symbol !== symbolToRemove);
    setSearchHistory(updatedHistory);
    localStorage.setItem('market-search-history', JSON.stringify(updatedHistory));
    setSwipedItem(null); // スワイプ状態をリセット
  };

  // スワイプジェスチャーのハンドリング
  const handleSwipe = {
    touchStartX: 0,
    touchStartY: 0,

    onTouchStart: (e: React.TouchEvent, symbol: string) => {
      handleSwipe.touchStartX = e.touches[0].clientX;
      handleSwipe.touchStartY = e.touches[0].clientY;
    },

    onTouchMove: (e: React.TouchEvent) => {
      // スクロールを防ぐため、水平スワイプの場合のみpreventDefault
      const touchCurrentX = e.touches[0].clientX;
      const touchCurrentY = e.touches[0].clientY;
      const deltaX = Math.abs(touchCurrentX - handleSwipe.touchStartX);
      const deltaY = Math.abs(touchCurrentY - handleSwipe.touchStartY);

      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    },

    onTouchEnd: (e: React.TouchEvent, symbol: string) => {
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = handleSwipe.touchStartX - touchEndX;
      const deltaY = Math.abs(e.changedTouches[0].clientY - handleSwipe.touchStartY);

      // 左スワイプの判定（水平移動 > 垂直移動 かつ 左に50px以上移動）
      if (deltaX > 50 && deltaY < 100) {
        setSwipedItem(symbol);
      } else if (deltaX < -20) {
        // 右スワイプまたは小さな移動で元に戻す
        setSwipedItem(null);
      }
    },
  };

  // スワイプ状態以外の場所をタップした時にスワイプ状態をリセット
  const resetSwipeState = () => {
    setSwipedItem(null);
  };

  // 検索実行（デバウンス処理付き）
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchMarkets(searchQuery);
      const query = searchQuery.toLowerCase().trim();

      // 検索結果に優先度スコアを割り当てる
      const enhancedResults = response.results.map((result) => {
        const name = result.name.toLowerCase();
        const symbol = result.symbol.toLowerCase();
        let priorityScore = result.score || 0;

        // 優先度スコアの計算
        // 完全一致: 最優先（+100）
        if (name === query || symbol === query) {
          priorityScore += 100;
        }
        // 前方一致: 次に優先（+50）
        else if (name.startsWith(query) || symbol.startsWith(query)) {
          priorityScore += 50;
        }
        // 単語一致: その次（+25）
        else if (name.split(/\s+/).some((word) => word === query)) {
          priorityScore += 25;
        }
        // 部分一致: 最後（+10）
        else if (name.includes(query) || symbol.includes(query)) {
          priorityScore += 10;
        }

        // 「Apple」のような一般的な企業名には追加スコア（+15）
        if (isCommonCompanyName(name)) {
          priorityScore += 15;
        }

        return { ...result, priorityScore };
      });

      // 優先度スコアで降順ソート
      const sortedResults = enhancedResults.sort((a, b) => b.priorityScore - a.priorityScore);

      setResults(sortedResults);
    } catch (error) {
      console.error('検索エラー:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 一般的な企業名かどうかをチェック
  const isCommonCompanyName = (query: string): boolean => {
    const commonCompanyNames = [
      'apple',
      'microsoft',
      'amazon',
      'google',
      'facebook',
      'meta',
      'netflix',
      'tesla',
      'nvidia',
      'adobe',
      'oracle',
      'ibm',
      'intel',
      'amd',
      'cisco',
      'toyota',
      'honda',
      'sony',
      'samsung',
      'lg',
      'xiaomi',
      'alibaba',
      'tencent',
    ];
    return commonCompanyNames.includes(query.toLowerCase());
  };

  // クエリの変更時に検索実行（デバウンス処理）
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (query) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300); // 300msのデバウンス

    return () => clearTimeout(delaySearch);
  }, [query]);

  // 結果選択時の処理
  const handleSelect = (result: SearchResult) => {
    saveToHistory(result);
    if (onSelect) {
      onSelect(result);
    }

    // シミュレーションページに遷移（想定利回りを自動入力）
    const params = new URLSearchParams({
      q: 'total-assets',
    });
    router.push(`/markets/${encodeURIComponent(result.symbol)}/simulation?${params.toString()}`);
  };

  // 検索窓クリア
  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  // 変動率の色を取得
  const getChangeColor = (changePercent: string): string => {
    if (changePercent.includes('+')) {
      return 'text-[var(--color-success)]'; // 上昇（緑）
    } else if (changePercent.includes('-')) {
      return 'text-[var(--color-danger)]'; // 下落（赤）
    }
    return 'text-slate-500 dark:text-[var(--color-text-muted)]'; // 変動なし
  };

  // 国旗アイコンを取得する関数
  const getFlagIcon = (market: string): string => {
    switch (market.toLowerCase()) {
      case 'japan':
        return '/flags/japan.svg'; // 日本の国旗
      case 'us':
        return '/flags/us.svg'; // アメリカの国旗
      case 'uk':
        return '/flags/uk.svg'; // イギリスの国旗
      case 'eu':
        return '/flags/eu.svg'; // EUの国旗
      case 'china':
        return '/flags/china.svg'; // 中国の国旗
      case 'hong kong':
        return '/flags/hong-kong.svg'; // 香港の国旗
      case 'india':
        return '/flags/india.svg'; // インドの国旗
      case 'australia':
        return '/flags/australia.svg'; // オーストラリアの国旗
      case 'canada':
        return '/flags/canada.svg'; // カナダの国旗
      default:
        return '/flags/global.svg'; // グローバル市場またはその他
    }
  };

  // 企業ロゴを取得する関数（ロゴがない場合は市場に応じた国旗を表示）
  const getCompanyLogo = (result: SearchResult): string => {
    // logoUrlが存在する場合はそれを優先的に使用
    if (result.logoUrl) {
      return result.logoUrl;
    }

    // ダミーのロゴ画像を返す
    // 実際のプロジェクトでは、symbol を使って適切なロゴを取得する仕組みが必要
    const companies: Record<string, string> = {
      AAPL: 'https://logo.clearbit.com/apple.com',
      AMZN: 'https://logo.clearbit.com/amazon.com',
      GOOG: 'https://logo.clearbit.com/google.com',
      MSFT: 'https://logo.clearbit.com/microsoft.com',
      FB: 'https://logo.clearbit.com/meta.com',
      TSLA: 'https://logo.clearbit.com/tesla.com',
      NFLX: 'https://logo.clearbit.com/netflix.com',
      SNAP: 'https://logo.clearbit.com/snapchat.com',
      SPOT: 'https://logo.clearbit.com/spotify.com',
    };

    // 企業ロゴがある場合はそれを返す、なければ市場に応じた国旗を返す
    return (
      companies[result.symbol] ||
      (result.market ? getFlagIcon(result.market) : '/placeholder-logo.svg')
    );
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-2xl mx-auto">
      {/* 検索入力フィールド - デザインガイドライン準拠 */}
      <div className="relative flex items-center w-full rounded-full border-2 border-[var(--color-lp-mint)] bg-[var(--color-lp-mint)]/5 dark:bg-[var(--color-lp-mint)]/10 transition-all duration-300 focus-within:bg-[var(--color-lp-mint)]/10 dark:focus-within:bg-[var(--color-lp-mint)]/15 shadow-lg">
        <Search className="absolute left-6 h-6 w-6 text-[var(--color-lp-mint)]" strokeWidth={2} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="銘柄名またはシンボルで検索（例: トヨタ, AAPL）"
          className="w-full h-[56px] py-4 pl-16 pr-14 outline-none rounded-full bg-transparent text-lg text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] placeholder:text-slate-500 dark:placeholder:text-[var(--color-text-muted)]"
          aria-label="銘柄を検索"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 p-2 bg-slate-100 dark:bg-[var(--color-surface-3)] rounded-full text-slate-500 dark:text-[var(--color-text-muted)] hover:text-[var(--color-lp-navy)] dark:hover:text-[var(--color-text-primary)] hover:bg-slate-200 dark:hover:bg-[var(--color-surface-4)] transition-colors"
            style={{ touchAction: 'manipulation' }}
            aria-label="検索をクリア"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* 検索結果表示 */}
      <div ref={resultsRef} className="mt-4">
        {isLoading ? (
          // ローディング表示
          <div className="bg-white dark:bg-[var(--color-surface-2)] rounded-2xl shadow-xl dark:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] p-8 text-center border border-slate-200 dark:border-[var(--color-surface-3)]">
            <Loader2 className="w-8 h-8 text-[var(--color-lp-mint)] animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-[var(--color-text-secondary)]">検索中...</p>
          </div>
        ) : (
          <>
            {query ? (
              // 検索結果表示
              <div className="p-2">
                <h3 className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-4">
                  検索結果
                </h3>
                {results.length > 0 ? (
                  <div className="space-y-3">
                    {results.map((result) => (
                      <div
                        key={result.symbol}
                        onClick={() => handleSelect(result)}
                        className="flex items-center justify-between p-4 bg-white dark:bg-[var(--color-surface-2)] cursor-pointer hover:bg-[var(--color-lp-mint)]/10 dark:hover:bg-[var(--color-lp-mint)]/15 active:scale-[0.98] transition-all duration-200 rounded-xl shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-[var(--color-surface-3)]"
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <img
                            src={getCompanyLogo(result)}
                            alt={result.name}
                            className="w-10 h-10 rounded-full flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = result.market
                                ? getFlagIcon(result.market)
                                : '/placeholder-logo.svg';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-1">
                              <h4
                                className="font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] text-base truncate whitespace-nowrap overflow-hidden"
                                style={{
                                  writingMode: 'horizontal-tb',
                                  textOrientation: 'mixed',
                                  direction: 'ltr',
                                }}
                              >
                                {result.name}
                              </h4>
                              <span className="text-sm text-slate-500 dark:text-[var(--color-text-muted)] bg-slate-100 dark:bg-[var(--color-surface-4)] px-3 py-1 rounded-full font-medium flex-shrink-0 w-fit mt-1 sm:mt-0">
                                {result.symbol}
                              </span>
                            </div>
                            {result.market && (
                              <p className="text-sm text-slate-500 dark:text-[var(--color-text-muted)]">
                                {result.market}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 flex-shrink-0">
                          {result.price && (
                            <div className="text-right">
                              <p className="font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] text-base">
                                {result.price}
                              </p>
                              {result.change_percent && (
                                <p className={`text-sm ${getChangeColor(result.change_percent)}`}>
                                  {result.change_percent}
                                </p>
                              )}
                            </div>
                          )}
                          <div className="flex-shrink-0 h-10 w-10 bg-[var(--color-lp-mint)]/10 dark:bg-[var(--color-lp-mint)]/20 rounded-full flex items-center justify-center">
                            <ChevronRight
                              className="h-5 w-5 text-[var(--color-lp-mint)]"
                              strokeWidth={2}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-[var(--color-text-muted)]">
                      該当する銘柄が見つかりませんでした
                    </p>
                    <p className="text-sm text-slate-400 dark:text-[var(--color-text-muted)] mt-2">
                      別のキーワードで検索してみてください
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // 検索履歴表示（初期表示）
              <div className="p-2">
                <h3 className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-4">
                  最近検索した銘柄
                </h3>
                {searchHistory.length > 0 ? (
                  <div className="space-y-3" onClick={isTouchDevice ? resetSwipeState : undefined}>
                    {searchHistory.slice(0, 5).map((result) => (
                      <div
                        key={result.symbol}
                        className={`
                          ${isTouchDevice ? 'relative overflow-hidden' : ''} 
                          rounded-xl shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] 
                          border border-slate-200 dark:border-[var(--color-surface-3)]
                        `}
                      >
                        {/* タッチデバイス用：削除ボタンの背景 */}
                        {isTouchDevice && (
                          <div className="absolute inset-0 bg-red-500 dark:bg-red-600 flex items-center justify-end pr-6">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromHistory(result.symbol);
                              }}
                              className="flex items-center space-x-2 text-white font-semibold"
                              aria-label={`${result.name}を履歴から削除`}
                            >
                              <Trash2 className="h-5 w-5" strokeWidth={2} />
                              <span className="text-sm">削除</span>
                            </button>
                          </div>
                        )}

                        {/* メインコンテンツ */}
                        <div
                          onClick={(e) => {
                            if (isTouchDevice && swipedItem === result.symbol) {
                              e.stopPropagation();
                              resetSwipeState();
                            } else {
                              handleSelect(result);
                            }
                          }}
                          onTouchStart={
                            isTouchDevice
                              ? (e) => handleSwipe.onTouchStart(e, result.symbol)
                              : undefined
                          }
                          onTouchMove={isTouchDevice ? handleSwipe.onTouchMove : undefined}
                          onTouchEnd={
                            isTouchDevice
                              ? (e) => handleSwipe.onTouchEnd(e, result.symbol)
                              : undefined
                          }
                          className={`
                            flex items-center justify-between p-4 bg-white dark:bg-[var(--color-surface-2)] 
                            cursor-pointer hover:bg-[var(--color-lp-mint)]/10 dark:hover:bg-[var(--color-lp-mint)]/15 
                            transition-all duration-300 relative
                            ${isTouchDevice && swipedItem === result.symbol ? 'transform -translate-x-24' : 'transform translate-x-0'}
                            ${!isTouchDevice ? 'active:scale-[0.98]' : ''}
                          `}
                          style={isTouchDevice ? { touchAction: 'pan-y' } : undefined}
                        >
                          <div className="flex items-center space-x-4 flex-1 min-w-0">
                            <img
                              src={getCompanyLogo(result)}
                              alt={result.name}
                              className="w-10 h-10 rounded-full flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = result.market
                                  ? getFlagIcon(result.market)
                                  : '/placeholder-logo.svg';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-1">
                                <h4
                                  className="font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] text-base truncate whitespace-nowrap overflow-hidden"
                                  style={{
                                    writingMode: 'horizontal-tb',
                                    textOrientation: 'mixed',
                                    direction: 'ltr',
                                  }}
                                >
                                  {result.name}
                                </h4>
                                <span className="text-sm text-slate-500 dark:text-[var(--color-text-muted)] bg-slate-100 dark:bg-[var(--color-surface-4)] px-3 py-1 rounded-full font-medium flex-shrink-0 w-fit mt-1 sm:mt-0">
                                  {result.symbol}
                                </span>
                              </div>
                              {result.market && (
                                <p className="text-sm text-slate-500 dark:text-[var(--color-text-muted)]">
                                  {result.market}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {result.price && (
                              <div className="text-right">
                                <p className="font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] text-base">
                                  {result.price}
                                </p>
                                {result.change_percent && (
                                  <p className={`text-sm ${getChangeColor(result.change_percent)}`}>
                                    {result.change_percent}
                                  </p>
                                )}
                              </div>
                            )}
                            {/* デスクトップ用：削除ボタン */}
                            {!isTouchDevice && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromHistory(result.symbol);
                                }}
                                className="flex-shrink-0 h-8 w-8 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full flex items-center justify-center transition-colors"
                                aria-label={`${result.name}を履歴から削除`}
                              >
                                <Trash2
                                  className="h-4 w-4 text-red-500 dark:text-red-400"
                                  strokeWidth={2}
                                />
                              </button>
                            )}
                            <div className="flex-shrink-0 h-10 w-10 bg-[var(--color-lp-mint)]/10 dark:bg-[var(--color-lp-mint)]/20 rounded-full flex items-center justify-center">
                              <ChevronRight
                                className="h-5 w-5 text-[var(--color-lp-mint)]"
                                strokeWidth={2}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-[var(--color-text-muted)]">
                      検索履歴はありません
                    </p>
                    <p className="text-sm text-slate-400 dark:text-[var(--color-text-muted)] mt-2">
                      銘柄を検索すると、ここに履歴が表示されます
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
