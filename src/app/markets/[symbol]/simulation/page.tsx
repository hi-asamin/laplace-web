'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import AssetAccumulationSimulator from '@/components/AssetAccumulationSimulator';
import AssetDistributionSimulator from '@/components/AssetDistributionSimulator';
import { useAssetAccumulationSimulation } from '@/hooks/useSimulation';

interface PageParams {
  symbol: string;
  [key: string]: string | string[] | undefined;
}

export default function SimulationPage() {
  const params = useParams<PageParams>();
  const searchParams = useSearchParams();
  const { symbol } = params;

  // 資産形成シミュレーションの状態を追跡
  const accumulationSimulation = useAssetAccumulationSimulation();
  const [inheritedAssets, setInheritedAssets] = useState<number | undefined>(undefined);

  // URL パラメータから初期設定を取得
  const initialQuestionType = searchParams.get('q') || 'total-assets';
  const showDistribution = searchParams.get('mode') === 'distribution';

  // 資産形成の結果が変更されたときに、資産活用シミュレーターに連携
  useEffect(() => {
    if (
      accumulationSimulation.result.isSuccess &&
      accumulationSimulation.result.calculatedValue &&
      accumulationSimulation.settings.questionType === 'total-assets'
    ) {
      setInheritedAssets(accumulationSimulation.result.calculatedValue);
    }
  }, [
    accumulationSimulation.result.calculatedValue,
    accumulationSimulation.result.isSuccess,
    accumulationSimulation.settings.questionType,
  ]);

  return (
    <main className="min-h-screen bg-[var(--color-surface)]">
      {/* ページヘッダー */}
      <div className="bg-white border-b border-[var(--color-gray-200)] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[var(--color-gray-900)]">資産シミュレーション</h1>
            {symbol && (
              <span className="bg-[var(--color-lp-mint)]/10 px-3 py-1 rounded-full text-sm font-medium text-[var(--color-lp-navy)]">
                {symbol.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ナビゲーション */}
      <div className="bg-[var(--color-surface-alt)] border-b border-[var(--color-gray-200)] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto scrollbar-none">
            <a
              href="#accumulation"
              className="whitespace-nowrap py-3 px-1 border-b-2 border-[var(--color-lp-mint)] text-[var(--color-lp-mint)] font-medium text-sm"
            >
              資産形成
            </a>
            <a
              href="#distribution"
              className="whitespace-nowrap py-3 px-1 border-b-2 border-transparent text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] hover:border-[var(--color-gray-300)] font-medium text-sm"
            >
              資産活用
            </a>
          </nav>
        </div>
      </div>

      {/* 資産形成シミュレーター */}
      <div id="accumulation">
        <AssetAccumulationSimulator defaultQuestionType={initialQuestionType as any} />
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
        <AssetDistributionSimulator inheritedAssets={inheritedAssets} />
      </div>
    </main>
  );
}
