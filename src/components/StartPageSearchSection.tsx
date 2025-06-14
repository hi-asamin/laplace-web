'use client';

import { TrendingUp, BarChart3, PieChart, ExternalLink, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StockItem {
  symbol: string;
  name: string;
  nameEn?: string;
  sector?: string;
  defaultRate: string;
}

interface CategoryCardProps {
  title: string;
  icon: React.ElementType;
  items: StockItem[];
  category: 'stocks' | 'indexes' | 'etfs';
}

const StockCard: React.FC<{ item: StockItem; onClick: () => void }> = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[var(--color-surface-2)] rounded-2xl p-6 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] hover:shadow-xl dark:hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 cursor-pointer border border-slate-200 dark:border-[var(--color-surface-3)] hover:border-[var(--color-lp-mint)]/50"
    >
      {/* ヘッダー部分 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
              {item.symbol}
            </span>
            <ExternalLink className="w-4 h-4 text-[var(--color-lp-blue)] opacity-60" />
          </div>
          <h3 className="font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] text-base leading-snug">
            {item.name}
          </h3>
          {item.nameEn && (
            <p className="text-sm text-slate-500 dark:text-[var(--color-text-muted)] truncate">
              {item.nameEn}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm font-medium text-[var(--color-lp-mint)]">
            想定利回り {item.defaultRate}%
          </div>
        </div>
      </div>

      {/* メタデータ */}
      <div className="flex items-center justify-between text-sm">
        {item.sector && (
          <span className="bg-[var(--color-lp-blue)]/10 dark:bg-[var(--color-lp-blue)]/20 text-[var(--color-lp-blue)] px-2 py-1 rounded-full">
            {item.sector}
          </span>
        )}
        <span className="text-slate-500 dark:text-[var(--color-text-muted)]">
          シミュレーション開始
        </span>
      </div>
    </div>
  );
};

const SearchCard: React.FC<{ category: string }> = ({ category }) => {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push('/search');
  };

  const getCategoryText = (cat: string) => {
    switch (cat) {
      case 'stocks':
        return '株式';
      case 'indexes':
        return 'インデックス';
      case 'etfs':
        return 'ETF';
      default:
        return '銘柄';
    }
  };

  return (
    <div
      onClick={handleSearchClick}
      className="bg-gradient-to-br from-[var(--color-lp-mint)]/5 to-[var(--color-lp-blue)]/5 dark:from-[var(--color-lp-mint)]/10 dark:to-[var(--color-lp-blue)]/10 rounded-2xl p-6 border-2 border-dashed border-[var(--color-lp-mint)]/30 dark:border-[var(--color-lp-mint)]/40 hover:border-[var(--color-lp-mint)]/60 dark:hover:border-[var(--color-lp-mint)]/70 transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      {/* 検索アイコンとテキスト */}
      <div className="flex flex-col items-center justify-center text-center min-h-[120px]">
        <div className="w-12 h-12 bg-[var(--color-lp-mint)]/20 dark:bg-[var(--color-lp-mint)]/30 rounded-full flex items-center justify-center mb-4">
          <Search className="w-6 h-6 text-[var(--color-lp-mint)]" />
        </div>
        <h3 className="font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] text-base mb-2">
          その他の{getCategoryText(category)}を検索
        </h3>
        <p className="text-sm text-slate-500 dark:text-[var(--color-text-muted)]">
          お探しの銘柄がここにありませんか？
        </p>
        <p className="text-sm text-[var(--color-lp-mint)] font-medium mt-2">検索ページで探す →</p>
      </div>
    </div>
  );
};

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon: Icon, items, category }) => {
  const router = useRouter();

  const handleItemClick = (item: StockItem) => {
    // 銘柄選択時の遷移
    const params = new URLSearchParams({
      q: 'total-assets',
      rate: item.defaultRate,
    });
    router.push(`/markets/${item.symbol}/simulation?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-[var(--color-surface-2)] rounded-3xl p-8 shadow-xl dark:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] border border-slate-200 dark:border-[var(--color-surface-3)]">
      {/* セクションヘッダー */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[var(--color-lp-mint)]/10 dark:bg-[var(--color-lp-mint)]/15 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-[var(--color-lp-mint)]" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] font-[var(--font-poppins)]">
            {title}
          </h3>
        </div>
        <p className="text-slate-600 dark:text-[var(--color-text-secondary)]">
          人気の{title.toLowerCase()}から選んでシミュレーション開始
        </p>
      </div>

      {/* 銘柄グリッド */}
      <div className="space-y-4">
        {items.map((item) => (
          <StockCard key={item.symbol} item={item} onClick={() => handleItemClick(item)} />
        ))}
        <SearchCard category={category} />
      </div>
    </div>
  );
};

export default function StartPageSearchSection() {
  const stocksData: StockItem[] = [
    {
      symbol: 'AAPL',
      name: 'アップル',
      nameEn: 'Apple Inc.',
      sector: 'テクノロジー',
      defaultRate: '12',
    },
    {
      symbol: 'MSFT',
      name: 'マイクロソフト',
      nameEn: 'Microsoft Corp.',
      sector: 'テクノロジー',
      defaultRate: '11',
    },
    {
      symbol: 'GOOGL',
      name: 'アルファベット',
      nameEn: 'Alphabet Inc.',
      sector: 'テクノロジー',
      defaultRate: '13',
    },
    { symbol: 'TSLA', name: 'テスラ', nameEn: 'Tesla Inc.', sector: '自動車', defaultRate: '25' },
    {
      symbol: 'NVDA',
      name: 'エヌビディア',
      nameEn: 'NVIDIA Corp.',
      sector: '半導体',
      defaultRate: '30',
    },
  ];

  const indexesData: StockItem[] = [
    {
      symbol: 'SPX',
      name: 'S&P 500',
      nameEn: 'S&P 500 Index',
      sector: '米国株式',
      defaultRate: '10',
    },
    {
      symbol: 'ACWI',
      name: '全世界株式',
      nameEn: 'MSCI ACWI Index',
      sector: 'グローバル',
      defaultRate: '8',
    },
    {
      symbol: 'TPX',
      name: 'TOPIX',
      nameEn: 'Tokyo Stock Price Index',
      sector: '日本株式',
      defaultRate: '5',
    },
    { symbol: 'NKY', name: '日経平均', nameEn: 'Nikkei 225', sector: '日本株式', defaultRate: '4' },
    {
      symbol: 'NDX',
      name: 'NASDAQ 100',
      nameEn: 'NASDAQ-100 Index',
      sector: '米国ハイテク',
      defaultRate: '12',
    },
  ];

  const etfsData: StockItem[] = [
    {
      symbol: 'VOO',
      name: 'バンガード S&P 500',
      nameEn: 'Vanguard S&P 500 ETF',
      sector: '米国株式',
      defaultRate: '10',
    },
    {
      symbol: 'VTI',
      name: 'バンガード 全米株式',
      nameEn: 'Vanguard Total Stock Market ETF',
      sector: '米国株式',
      defaultRate: '10',
    },
    {
      symbol: 'QQQ',
      name: 'インベスコ QQQ',
      nameEn: 'Invesco QQQ Trust',
      sector: '米国ハイテク',
      defaultRate: '12',
    },
    {
      symbol: 'VT',
      name: 'バンガード 全世界',
      nameEn: 'Vanguard Total World Stock ETF',
      sector: 'グローバル',
      defaultRate: '8',
    },
    {
      symbol: 'SPYD',
      name: 'SPDR 高配当',
      nameEn: 'SPDR S&P 500 High Dividend ETF',
      sector: '高配当',
      defaultRate: '9',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <CategoryCard title="株式" icon={TrendingUp} items={stocksData} category="stocks" />
      <CategoryCard title="インデックス" icon={BarChart3} items={indexesData} category="indexes" />
      <CategoryCard title="ETF" icon={PieChart} items={etfsData} category="etfs" />
    </div>
  );
}
