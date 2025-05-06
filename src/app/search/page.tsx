'use client';

import { MarketSearch } from '@/components/search/market-search';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)] p-2">
      <div className="max-w-lg mx-auto py-8">
        {/* スクリーンリーダー用のアクセシブルなタイトル - 視覚的には非表示 */}
        <h1 className="sr-only">銘柄検索</h1>

        <MarketSearch />
      </div>
    </div>
  );
}
