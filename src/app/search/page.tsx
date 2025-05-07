'use client';

import { MarketSearch } from '@/components/search/market-search';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)] p-2 sm:p-4">
      <div className="max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto py-8 px-2 sm:px-4">
        {/* スクリーンリーダー用のアクセシブルなタイトル - 視覚的には非表示 */}
        <h1 className="sr-only">銘柄検索</h1>

        <MarketSearch />
      </div>
    </div>
  );
}
