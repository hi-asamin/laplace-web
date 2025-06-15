/**
 * シンボルから通貨を判定する
 * @param symbol 銘柄シンボル（例：AAPL, 7203.T, TSLA）
 * @returns 通貨コード（USD, JPY）
 */
export function getCurrencyFromSymbol(symbol: string): 'USD' | 'JPY' {
  // 日本株の判定パターン
  const japanesePatterns = [
    /\.\w+$/, // .T, .JP などの接尾辞
    /^\d{4}$/, // 4桁の数字のみ（日本の証券コード）
    /^\d{4}\./, // 4桁の数字 + ドット
  ];

  // 日本株の場合
  if (japanesePatterns.some((pattern) => pattern.test(symbol))) {
    return 'JPY';
  }

  // デフォルトはUSD（米国株）
  return 'USD';
}

/**
 * USD価格を円価格に変換する
 * @param usdPrice USD建ての価格
 * @param exchangeRate USD/JPY為替レート
 * @returns 円建ての価格
 */
export function convertUsdToJpy(usdPrice: number, exchangeRate: number): number {
  return usdPrice * exchangeRate;
}

/**
 * 価格を適切な通貨記号付きで表示する
 * @param price 価格
 * @param currency 通貨コード
 * @returns フォーマットされた価格文字列
 */
export function formatCurrencyPrice(price: number, currency: 'USD' | 'JPY'): string {
  if (currency === 'JPY') {
    return `¥${price.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}`;
  } else {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

/**
 * 投資額を適切な通貨に変換する
 * @param jpyAmount 円建ての投資額
 * @param targetCurrency 対象通貨
 * @param exchangeRate USD/JPY為替レート
 * @returns 変換後の投資額
 */
export function convertInvestmentAmount(
  jpyAmount: number,
  targetCurrency: 'USD' | 'JPY',
  exchangeRate: number
): number {
  if (targetCurrency === 'JPY') {
    return jpyAmount;
  } else {
    return jpyAmount / exchangeRate;
  }
}
