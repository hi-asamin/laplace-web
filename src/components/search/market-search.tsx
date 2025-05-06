'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
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

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  // 検索履歴の保存
  const saveToHistory = (result: SearchResult) => {
    const updatedHistory = [
      result,
      ...searchHistory.filter((item) => item.symbol !== result.symbol).slice(0, 9),
    ];
    setSearchHistory(updatedHistory);
    localStorage.setItem('market-search-history', JSON.stringify(updatedHistory));
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
    setQuery('');
    if (onSelect) {
      onSelect(result);
    }

    // 詳細ページに遷移
    router.push(`/markets/${encodeURIComponent(result.symbol)}`);
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
    return 'text-[var(--color-gray-400)]'; // 変動なし
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
    <div ref={searchContainerRef} className="relative w-full">
      {/* 検索入力フィールド - 添付画像に合わせたスタイル */}
      <div className="relative flex items-center w-full rounded-full border border-[var(--color-gray-400)] bg-[var(--color-surface)] transition-all duration-200 focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent">
        <Search
          className="absolute left-4 h-5 w-5 text-[var(--color-gray-700)]"
          strokeWidth={1.8}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="銘柄を検索"
          className="w-full h-[44px] py-3 pl-12 pr-10 outline-none rounded-full bg-transparent text-[var(--color-gray-900)]"
          aria-label="銘柄を検索"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 p-1 bg-gray-100 rounded-full text-[var(--color-gray-400)] hover:text-[var(--color-gray-700)] hover:bg-gray-200 transition-colors"
            style={{ touchAction: 'manipulation' }}
            aria-label="検索をクリア"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* 検索結果表示 */}
      <div ref={resultsRef} className="absolute z-10 w-full mt-2">
        {isLoading ? (
          <div className="p-4 text-center text-[var(--color-gray-400)]">検索中...</div>
        ) : (
          <>
            {query ? (
              // 検索結果表示
              <div>
                <h3 className="px-4 py-2 text-xs text-[var(--color-gray-700)]">候補</h3>
                {results.length > 0 ? (
                  <ul>
                    {results.map((result) => (
                      <li
                        key={result.symbol}
                        onClick={() => handleSelect(result)}
                        className="flex items-center justify-between px-4 py-3 bg-[var(--color-list-bg)] cursor-pointer hover:brightness-[0.97] active:scale-[0.98] transition-all duration-120 mb-1 rounded-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={getCompanyLogo(result)}
                            alt={result.name}
                            className="w-6 h-6 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = result.market
                                ? getFlagIcon(result.market)
                                : '/placeholder-logo.svg';
                            }}
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-[var(--color-gray-900)]">
                                {result.name}
                              </p>
                              <span className="text-xs text-[var(--color-gray-400)]">
                                ({result.symbol})
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {result.price && (
                            <div className="text-right mr-3">
                              <p className="font-medium text-[var(--color-gray-900)]">
                                {result.price}
                              </p>
                              {result.change_percent && (
                                <p className={`text-xs ${getChangeColor(result.change_percent)}`}>
                                  {result.change_percent}
                                </p>
                              )}
                            </div>
                          )}
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <ChevronRight
                              className="h-4 w-4 text-[var(--color-gray-700)]"
                              strokeWidth={1.8}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-[var(--color-gray-400)] rounded-xl">
                    結果がありません
                  </div>
                )}
              </div>
            ) : (
              // 検索履歴表示
              <div>
                <h3 className="px-4 py-2 text-xs text-[var(--color-gray-700)]">検索履歴</h3>
                {searchHistory.length > 0 ? (
                  <ul>
                    {searchHistory.map((result) => (
                      <li
                        key={result.symbol}
                        onClick={() => handleSelect(result)}
                        className="flex items-center justify-between px-4 py-3 bg-[var(--color-list-bg)] cursor-pointer hover:brightness-[0.97] active:scale-[0.98] transition-all duration-120 mb-1 rounded-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={getCompanyLogo(result)}
                            alt={result.name}
                            className="w-6 h-6 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = result.market
                                ? getFlagIcon(result.market)
                                : '/placeholder-logo.svg';
                            }}
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-[var(--color-gray-900)]">
                                {result.name}
                              </p>
                              <span className="text-xs text-[var(--color-gray-400)]">
                                ({result.symbol})
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {result.price && (
                            <div className="text-right mr-3">
                              <p className="font-medium text-[var(--color-gray-900)]">
                                {result.price}
                              </p>
                              {result.change_percent && (
                                <p className={`text-xs ${getChangeColor(result.change_percent)}`}>
                                  {result.change_percent}
                                </p>
                              )}
                            </div>
                          )}
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <ChevronRight
                              className="h-4 w-4 text-[var(--color-gray-700)]"
                              strokeWidth={1.8}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-[var(--color-gray-400)] rounded-xl">
                    検索履歴がありません
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
