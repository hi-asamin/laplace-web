'use client';

import { useMemo } from 'react';
import { DollarSign, Calendar, TrendingUp, Coins } from 'lucide-react';
import Tooltip from '@/components/tooltip';

interface DividendVisualizationProps {
  symbol: string;
  marketName?: string;
  currentPrice?: number; // 現在の株価
  dividendYield?: number; // 配当利回り（%）
  annualDividend?: number; // 年間配当額（1株あたり）
  className?: string;
}

export default function DividendVisualizationCard({
  symbol,
  marketName,
  currentPrice,
  dividendYield = 0,
  annualDividend = 0,
  className = '',
}: DividendVisualizationProps) {
  // 100万円投資時の配当計算
  const dividendCalculations = useMemo(() => {
    const investmentAmount = 1000000; // 100万円

    if (!currentPrice || currentPrice <= 0 || (!dividendYield && !annualDividend)) {
      return {
        shareCount: 0,
        annualDividendAmount: 0,
        monthlyDividendAmount: 0,
        quarterlyDividendAmount: 0,
        effectiveYield: 0,
      };
    }

    // 購入可能株数を計算
    const shareCount = Math.floor(investmentAmount / currentPrice);

    // 年間配当金を計算（2つの方法で計算し、より信頼性の高い方を使用）
    let annualDividendAmount = 0;

    if (annualDividend > 0) {
      // 1株あたり配当額から計算
      annualDividendAmount = shareCount * annualDividend;
    } else if (dividendYield > 0) {
      // 配当利回りから計算
      annualDividendAmount = (investmentAmount * dividendYield) / 100;
    }

    // 月間・四半期配当金を計算
    const monthlyDividendAmount = annualDividendAmount / 12;
    const quarterlyDividendAmount = annualDividendAmount / 4;

    // 実効利回りを計算（実際の投資額に対する配当利回り）
    const actualInvestmentAmount = shareCount * currentPrice;
    const effectiveYield =
      actualInvestmentAmount > 0 ? (annualDividendAmount / actualInvestmentAmount) * 100 : 0;

    return {
      shareCount,
      annualDividendAmount: Math.round(annualDividendAmount),
      monthlyDividendAmount: Math.round(monthlyDividendAmount),
      quarterlyDividendAmount: Math.round(quarterlyDividendAmount),
      effectiveYield,
      actualInvestmentAmount,
    };
  }, [currentPrice, dividendYield, annualDividend]);

  // 配当がない場合の表示
  if (dividendCalculations.annualDividendAmount === 0) {
    return (
      <div
        className={`bg-[var(--color-surface)] dark:bg-[var(--color-surface-2)] rounded-2xl p-6 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] ${className}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
              配当シミュレーション
            </h3>
            <Tooltip
              content="100万円分の株式を購入した場合の配当収入をシミュレーションします。配当利回りや1株あたり配当額から計算されます。"
              title="配当シミュレーションについて"
            >
              <span></span>
            </Tooltip>
          </div>
          <Coins className="w-5 h-5 text-[var(--color-lp-mint)]" />
        </div>

        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-surface-alt)] dark:bg-[var(--color-surface-3)] rounded-full flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-[var(--color-text-muted)]" />
          </div>
          <p className="text-[var(--color-text-secondary)] mb-2">
            {marketName || symbol} は現在配当を支払っていません
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            配当情報が更新され次第、シミュレーション結果を表示します
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-[var(--color-surface)] dark:bg-[var(--color-surface-2)] rounded-2xl p-6 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
            配当シミュレーション
          </h3>
          <Tooltip
            content={`100万円分の${marketName || symbol}を購入した場合の配当収入をシミュレーションします。

【計算前提】
• 投資金額: ¥1,000,000
• 購入株数: ${dividendCalculations.shareCount.toLocaleString()}株
• 実際の投資額: ¥${dividendCalculations.actualInvestmentAmount?.toLocaleString()}
• 実効配当利回り: ${dividendCalculations.effectiveYield.toFixed(2)}%

【注意事項】
• 配当は企業の業績により変動する可能性があります
• 税金（約20%）は考慮されていません
• 配当支払い時期は企業により異なります`}
            title="配当シミュレーションについて"
          >
            <span></span>
          </Tooltip>
        </div>
        <Coins className="w-5 h-5 text-[var(--color-lp-mint)]" />
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* 年間配当 */}
        <div className="bg-gradient-to-br from-[var(--color-lp-mint)]/10 to-[var(--color-lp-blue)]/10 dark:from-[var(--color-lp-mint)]/15 dark:to-[var(--color-lp-blue)]/15 rounded-xl p-4 border border-[var(--color-lp-mint)]/20 dark:border-[var(--color-lp-mint)]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">年間配当</span>
            <Calendar className="w-4 h-4 text-[var(--color-lp-mint)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
            ¥{dividendCalculations.annualDividendAmount.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--color-text-muted)] mt-1">
            利回り {dividendCalculations.effectiveYield.toFixed(2)}%
          </div>
        </div>

        {/* 月間配当 */}
        <div className="bg-[var(--color-surface-alt)] dark:bg-[var(--color-surface-3)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">月間配当</span>
            <TrendingUp className="w-4 h-4 text-[var(--color-lp-blue)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
            ¥{dividendCalculations.monthlyDividendAmount.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--color-text-muted)] mt-1">毎月の収入目安</div>
        </div>

        {/* 四半期配当 */}
        <div className="bg-[var(--color-surface-alt)] dark:bg-[var(--color-surface-3)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              四半期配当
            </span>
            <DollarSign className="w-4 h-4 text-[var(--color-lp-blue)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
            ¥{dividendCalculations.quarterlyDividendAmount.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--color-text-muted)] mt-1">3ヶ月ごとの収入</div>
        </div>
      </div>

      {/* 投資詳細情報 */}
      <div className="bg-[var(--color-surface-alt)] dark:bg-[var(--color-surface-3)] rounded-xl p-4">
        <h5 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">投資詳細</h5>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[var(--color-text-secondary)]">購入株数</span>
            <div className="font-medium text-[var(--color-text-primary)]">
              {dividendCalculations.shareCount.toLocaleString()}株
            </div>
          </div>
          <div>
            <span className="text-[var(--color-text-secondary)]">実際の投資額</span>
            <div className="font-medium text-[var(--color-text-primary)]">
              ¥{dividendCalculations.actualInvestmentAmount?.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[var(--color-surface-3)] dark:border-[var(--color-surface-4)]">
          <p className="text-xs text-[var(--color-text-muted)]">
            ※ 配当金には約20%の税金がかかります。実際の手取り額は表示金額の約80%となります。
          </p>
        </div>
      </div>
    </div>
  );
}
