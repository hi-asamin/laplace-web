'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  ExternalLink,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { RelatedMarketItem } from '@/types/api';

interface RelatedStocksSectionProps {
  currentSymbol?: string;
  className?: string;
  relatedMarkets?: RelatedMarketItem[];
  isLoading?: boolean;
  error?: string | null;
  dividendYield?: number;
  onStockClick?: (clickedSymbol: string, currentSymbol: string, positionInList: number) => void;
}

const StockCard: React.FC<{ stock: RelatedMarketItem; onClick: () => void }> = ({
  stock,
  onClick,
}) => {
  // 文字列から数値を抽出してchange_percentを計算
  const parseChangePercent = (changePercentStr?: string | number): number => {
    if (changePercentStr === undefined || changePercentStr === null) return 0;

    // 既に数値の場合はそのまま返す
    if (typeof changePercentStr === 'number') {
      return changePercentStr;
    }

    // 文字列の場合は処理して数値に変換
    // "0.0%" -> 0.0 の形で数値を抽出
    const numStr = changePercentStr.replace('%', '');
    const num = parseFloat(numStr);
    return isNaN(num) ? 0 : num;
  };

  // 文字列から価格を抽出
  const parsePrice = (priceStr?: string | number): number => {
    if (priceStr === undefined || priceStr === null) return 0;

    // 既に数値の場合はそのまま返す
    if (typeof priceStr === 'number') {
      return priceStr;
    }

    // 文字列の場合は処理して数値に変換
    // "$60.10" -> 60.10 の形で数値を抽出
    const numStr = priceStr.replace(/[$,]/g, '');
    const num = parseFloat(numStr);
    return isNaN(num) ? 0 : num;
  };

  const changePercent = parseChangePercent(stock.changePercent);
  const price = parsePrice(stock.price);
  const isPositive = changePercent >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[var(--color-surface-2)] rounded-2xl p-6 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] hover:shadow-xl dark:hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] transition-all duration-300 
                 hover:scale-105 cursor-pointer border border-slate-200 dark:border-[var(--color-surface-3)] hover:border-[var(--color-lp-mint)]/50"
    >
      {/* ヘッダー部分 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
              {stock.symbol}
            </span>
            <ExternalLink className="w-4 h-4 text-[var(--color-lp-blue)] opacity-60" />
          </div>
          <h3 className="font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] text-base leading-snug">
            {stock.name}
          </h3>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <TrendIcon
              className={`w-4 h-4 ${
                isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
              }`}
            />
            <span
              className={`text-sm font-semibold ${
                isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
              }`}
            >
              {isPositive ? '+' : ''}
              {changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* 価格情報 */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-1">
          {stock.price || '$0.00'}
        </div>
      </div>

      {/* 配当利回り情報 */}
      {stock.dividendYield && (
        <div className="flex items-center justify-between text-sm">
          <span className="bg-[var(--color-lp-mint)]/10 dark:bg-[var(--color-lp-mint)]/20 text-[var(--color-lp-mint)] px-3 py-1 rounded-full font-medium">
            配当利回り {stock.dividendYield}
          </span>
        </div>
      )}
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <div className="w-20 h-20 bg-[var(--color-lp-mint)]/10 dark:bg-[var(--color-lp-mint)]/15 rounded-full flex items-center justify-center mx-auto mb-6">
      <BarChart3 className="w-10 h-10 text-[var(--color-lp-mint)]" />
    </div>
    <h3 className="text-xl font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-2">
      関連銘柄が見つかりませんでした
    </h3>
    <p className="text-slate-600 dark:text-[var(--color-text-secondary)] max-w-md mx-auto">
      同水準の配当利回りを持つ銘柄が見つからないか、データが不足している可能性があります。
    </p>
  </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="text-center py-12">
    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
      <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
    </div>
    <h3 className="text-xl font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-2">
      データの取得に失敗しました
    </h3>
    <p className="text-slate-600 dark:text-[var(--color-text-secondary)] max-w-md mx-auto">
      {error}
    </p>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="text-center py-12">
    <div className="w-20 h-20 bg-[var(--color-lp-mint)]/10 dark:bg-[var(--color-lp-mint)]/15 rounded-full flex items-center justify-center mx-auto mb-6">
      <Loader2 className="w-10 h-10 text-[var(--color-lp-mint)] animate-spin" />
    </div>
    <h3 className="text-xl font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-2">
      関連銘柄を取得中...
    </h3>
    <p className="text-slate-600 dark:text-[var(--color-text-secondary)] max-w-md mx-auto">
      利回りが同水準の銘柄を検索しています
    </p>
  </div>
);

const RelatedStocksSection: React.FC<RelatedStocksSectionProps> = ({
  currentSymbol,
  className = '',
  relatedMarkets = [],
  isLoading = false,
  error = null,
  dividendYield,
  onStockClick,
}) => {
  const handleStockClick = (symbol: string, index: number) => {
    // アナリティクスコールバック実行
    if (onStockClick && currentSymbol) {
      onStockClick(symbol, currentSymbol, index);
    }

    // シミュレーションページに遷移
    window.location.href = `/markets/${symbol.toLowerCase()}/simulation`;
  };

  // 現在の銘柄を除外し、必要な最小限のデータが揃っている銘柄のみをフィルタリング
  const displayStocks = relatedMarkets.filter(
    (stock) =>
      stock.symbol && stock.name && stock.symbol.toLowerCase() !== currentSymbol?.toLowerCase()
  );

  // 自分の資産シミュレーションの場合は表示しない
  if (currentSymbol === 'self') {
    return null;
  }

  return (
    <section
      className={`py-20 bg-[var(--color-lp-off-white)] dark:bg-[var(--color-surface-2)] ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* セクションヘッダー */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-[var(--color-lp-mint)]" />
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] font-[var(--font-poppins)]">
              関連銘柄
            </h2>
          </div>

          {/* 補足情報 */}
          {dividendYield && dividendYield > 0 && (
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-[var(--color-lp-mint)]/10 dark:bg-[var(--color-lp-mint)]/15 text-[var(--color-lp-mint)] px-4 py-2 rounded-full text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                利回り {dividendYield.toFixed(2)}% 同水準の銘柄
              </div>
            </div>
          )}

          <p className="text-xl text-slate-600 dark:text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            配当利回りが同水準の銘柄で比較検討できます。同じ条件でシミュレーションを開始できます。
          </p>
        </div>

        {/* コンテンツ表示 */}
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : displayStocks.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* 関連銘柄グリッド */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {displayStocks.slice(0, 6).map((stock, index) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onClick={() => handleStockClick(stock.symbol, index)}
                />
              ))}
            </div>

            {/* 追加情報 */}
            <div className="text-center">
              <div
                className="bg-gradient-to-br from-[var(--color-lp-mint)]/10 to-[var(--color-lp-blue)]/10 
                              dark:from-[var(--color-lp-mint)]/15 dark:to-[var(--color-lp-blue)]/15
                              rounded-2xl p-6 max-w-2xl mx-auto"
              >
                <p className="text-slate-600 dark:text-[var(--color-text-secondary)] mb-4">
                  気になる銘柄をクリックすると、同じ条件でシミュレーションを開始できます
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-[var(--color-text-muted)]">
                  <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
                  <span>配当利回りを基準に選定</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default RelatedStocksSection;
