'use client';

import { MarketSearch } from '@/components/search/market-search';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)] dark:bg-[var(--color-surface-1)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MarketSearch />
      </div>
    </div>
  );
}
