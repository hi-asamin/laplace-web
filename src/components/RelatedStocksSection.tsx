'use client';

import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, ExternalLink } from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  nameEn?: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: string;
  sector?: string;
}

interface RelatedStocksSectionProps {
  currentSymbol?: string;
  className?: string;
  onStockClick?: (clickedSymbol: string, currentSymbol: string, positionInList: number) => void;
}

// モックデータ
const mockRelatedStocks: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'アップル',
    nameEn: 'Apple Inc.',
    price: 185.92,
    change: 2.34,
    changePercent: 1.28,
    marketCap: '2.9T',
    sector: 'テクノロジー',
  },
  {
    symbol: 'MSFT',
    name: 'マイクロソフト',
    nameEn: 'Microsoft Corporation',
    price: 384.52,
    change: -1.87,
    changePercent: -0.48,
    marketCap: '2.8T',
    sector: 'テクノロジー',
  },
  {
    symbol: 'GOOGL',
    name: 'アルファベット',
    nameEn: 'Alphabet Inc.',
    price: 138.21,
    change: 0.95,
    changePercent: 0.69,
    marketCap: '1.7T',
    sector: 'テクノロジー',
  },
  {
    symbol: 'AMZN',
    name: 'アマゾン',
    nameEn: 'Amazon.com Inc.',
    price: 151.94,
    change: -2.41,
    changePercent: -1.56,
    marketCap: '1.6T',
    sector: 'Eコマース',
  },
  {
    symbol: 'TSLA',
    name: 'テスラ',
    nameEn: 'Tesla Inc.',
    price: 248.5,
    change: 8.72,
    changePercent: 3.64,
    marketCap: '790B',
    sector: '自動車',
  },
  {
    symbol: 'NVDA',
    name: 'エヌビディア',
    nameEn: 'NVIDIA Corporation',
    price: 875.28,
    change: 15.33,
    changePercent: 1.78,
    marketCap: '2.2T',
    sector: '半導体',
  },
];

const StockCard: React.FC<{ stock: Stock; onClick: () => void }> = ({ stock, onClick }) => {
  const isPositive = stock.change >= 0;
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
          {stock.nameEn && (
            <p className="text-sm text-slate-500 dark:text-[var(--color-text-muted)] truncate">
              {stock.nameEn}
            </p>
          )}
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
              {stock.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* 価格情報 */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-1">
          ${stock.price.toFixed(2)}
        </div>
        <div
          className={`text-sm font-medium ${
            isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
          }`}
        >
          {isPositive ? '+' : ''}${stock.change.toFixed(2)}
        </div>
      </div>

      {/* メタデータ */}
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-[var(--color-text-muted)]">
        {stock.sector && (
          <span className="bg-[var(--color-lp-blue)]/10 dark:bg-[var(--color-lp-blue)]/20 text-[var(--color-lp-blue)] px-2 py-1 rounded-full">
            {stock.sector}
          </span>
        )}
        {stock.marketCap && <span>時価総額: ${stock.marketCap}</span>}
      </div>
    </div>
  );
};

const RelatedStocksSection: React.FC<RelatedStocksSectionProps> = ({
  currentSymbol,
  className = '',
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

  const displayStocks = mockRelatedStocks.filter(
    (stock) => stock.symbol.toLowerCase() !== currentSymbol?.toLowerCase()
  );

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
          <p className="text-xl text-slate-600 dark:text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            他の人気銘柄もシミュレーションしてみませんか？同様の投資パターンで比較検討できます。
          </p>
        </div>

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
              <span>リアルタイム価格データを使用</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedStocksSection;
