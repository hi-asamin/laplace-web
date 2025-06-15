'use client';

import { useMemo } from 'react';
import { DollarSign, Calendar, TrendingUp, Coins, RefreshCw } from 'lucide-react';
import Tooltip from '@/components/tooltip';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import {
  getCurrencyFromSymbol,
  convertInvestmentAmount,
  formatCurrencyPrice,
} from '@/utils/currency';

interface DividendVisualizationProps {
  symbol: string;
  marketName?: string;
  currentPrice?: number; // 現在の株価（元の通貨建て）
  dividendYield?: number; // 配当利回り（%）
  annualDividend?: number; // 年間配当額（1株あたり、元の通貨建て）
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
  // 為替レート取得
  const { exchangeRate, isLoading: isExchangeLoading, source: exchangeSource } = useExchangeRate();

  // 通貨判定
  const currency = getCurrencyFromSymbol(symbol);

  // 100万円投資時の配当計算（為替レート考慮）
  const dividendCalculations = useMemo(() => {
    const investmentAmountJPY = 1000000; // 100万円

    if (!currentPrice || currentPrice <= 0 || (!dividendYield && !annualDividend)) {
      return {
        shareCount: 0,
        annualDividendAmount: 0,
        monthlyDividendAmount: 0,
        quarterlyDividendAmount: 0,
        effectiveYield: 0,
        actualInvestmentAmount: 0,
        currency,
        exchangeRate: currency === 'USD' ? exchangeRate : 1,
        priceInJPY: 0,
      };
    }

    // 株価を円建てに変換（USD株の場合）
    const priceInJPY = currency === 'USD' ? currentPrice * exchangeRate : currentPrice;

    // 投資額を適切な通貨に変換
    const investmentAmount = convertInvestmentAmount(investmentAmountJPY, currency, exchangeRate);

    // 購入可能株数を計算（元の通貨建ての株価で計算）
    const shareCount = Math.floor(investmentAmount / currentPrice);

    // 年間配当金を計算（元の通貨建て）
    // 購入株数 × 1株あたり配当金で統一して計算
    let annualDividendAmountOriginal = 0;

    if (annualDividend > 0) {
      // 1株あたり配当額が直接提供されている場合
      annualDividendAmountOriginal = shareCount * annualDividend;
    } else if (dividendYield > 0 && currentPrice > 0) {
      // 配当利回りから1株あたり配当額を逆算し、購入株数を掛ける
      const dividendPerShare = (currentPrice * dividendYield) / 100;
      annualDividendAmountOriginal = shareCount * dividendPerShare;
    }

    // 配当金を円建てに変換
    const annualDividendAmount =
      currency === 'USD'
        ? annualDividendAmountOriginal * exchangeRate
        : annualDividendAmountOriginal;

    // 月間・四半期配当金を計算（円建て）
    const monthlyDividendAmount = annualDividendAmount / 12;
    const quarterlyDividendAmount = annualDividendAmount / 4;

    // 実効利回りを計算（実際の投資額に対する配当利回り）
    const actualInvestmentAmount = shareCount * priceInJPY;
    const effectiveYield =
      actualInvestmentAmount > 0 ? (annualDividendAmount / actualInvestmentAmount) * 100 : 0;

    return {
      shareCount,
      annualDividendAmount: Math.round(annualDividendAmount),
      monthlyDividendAmount: Math.round(monthlyDividendAmount),
      quarterlyDividendAmount: Math.round(quarterlyDividendAmount),
      effectiveYield,
      actualInvestmentAmount: Math.round(actualInvestmentAmount),
      currency,
      exchangeRate: currency === 'USD' ? exchangeRate : 1,
      priceInJPY: Math.round(priceInJPY),
    };
  }, [currentPrice, dividendYield, annualDividend, currency, exchangeRate]);

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
          {currency === 'USD' && (
            <div className="ml-3 flex items-center text-xs text-[var(--color-text-muted)]">
              <RefreshCw className={`w-3 h-3 mr-1 ${isExchangeLoading ? 'animate-spin' : ''}`} />
              1USD = ¥{exchangeRate.toFixed(2)}
              {exchangeSource === 'fallback' && <span className="ml-1 text-orange-500">*</span>}
            </div>
          )}
          <Tooltip
            content={`100万円分の${marketName || symbol}を購入した場合の配当収入をシミュレーションします。

【計算方法】
• 年間配当 = 購入株数 × 1株あたり年間配当金
• 月間配当 = 年間配当 ÷ 12
• 四半期配当 = 年間配当 ÷ 4

【計算前提】
• 投資金額: ¥1,000,000
• 購入株数: ${dividendCalculations.shareCount.toLocaleString()}株
• 実際の投資額: ¥${dividendCalculations.actualInvestmentAmount.toLocaleString()}
• 実効配当利回り: ${dividendCalculations.effectiveYield.toFixed(2)}%
${
  currency === 'USD'
    ? `• 株価（円建て）: ¥${dividendCalculations.priceInJPY.toLocaleString()}
• 為替レート: 1USD = ¥${dividendCalculations.exchangeRate.toFixed(2)}
• 為替データ: ${exchangeSource === 'api' ? 'リアルタイム' : '固定値(140円)'}`
    : ''
}

【注意事項】
• 配当は企業の業績により変動する可能性があります
• 税金（約20%）は考慮されていません
• 配当支払い時期は企業により異なります
${currency === 'USD' ? '• 為替変動により実際の投資額・配当額は変動します' : ''}`}
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
              ¥{dividendCalculations.actualInvestmentAmount.toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-[var(--color-text-secondary)]">1株あたり配当</span>
            <div className="font-medium text-[var(--color-text-primary)]">
              {currency === 'USD' ? '$' : '¥'}
              {annualDividend > 0
                ? annualDividend.toFixed(2)
                : dividendYield > 0 && currentPrice && currentPrice > 0
                  ? ((currentPrice * dividendYield) / 100).toFixed(2)
                  : '0.00'}
            </div>
          </div>
          <div>
            <span className="text-[var(--color-text-secondary)]">配当利回り</span>
            <div className="font-medium text-[var(--color-text-primary)]">
              {dividendCalculations.effectiveYield.toFixed(2)}%
            </div>
          </div>
          {currency === 'USD' && (
            <>
              <div>
                <span className="text-[var(--color-text-secondary)]">株価（円建て）</span>
                <div className="font-medium text-[var(--color-text-primary)]">
                  ¥{dividendCalculations.priceInJPY.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">為替レート</span>
                <div className="font-medium text-[var(--color-text-primary)]">
                  ¥{dividendCalculations.exchangeRate.toFixed(2)}/USD
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-[var(--color-surface-3)] dark:border-[var(--color-surface-4)]">
          <p className="text-xs text-[var(--color-text-muted)]">
            ※ 配当金には約20%の税金がかかります。実際の手取り額は表示金額の約80%となります。
            {currency === 'USD' && (
              <>
                <br />※ USD建て銘柄は為替レートにより投資額・配当額が変動します。
                {exchangeSource === 'fallback' && (
                  <>
                    <br />※ 為替レートは固定値（140円/USD）を使用しています。
                  </>
                )}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
