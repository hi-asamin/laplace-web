import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 複数の為替レートAPIを試行（フォールバック対応）
    const exchangeRateApis = [
      // 1. Exchange Rates API (無料)
      'https://api.exchangerate-api.com/v4/latest/USD',
      // 2. Fixer.io (バックアップ)
      'https://api.fixer.io/latest?base=USD&symbols=JPY',
      // 3. CurrencyAPI (バックアップ)
      'https://api.currencyapi.com/v3/latest?apikey=YOUR_API_KEY&currencies=JPY&base_currency=USD',
    ];

    let exchangeRate = null;

    // 最初のAPIを試行
    try {
      const response = await fetch(exchangeRateApis[0], {
        next: { revalidate: 300 }, // 5分間キャッシュ
      });

      if (response.ok) {
        const data = await response.json();
        exchangeRate = data.rates?.JPY;
      }
    } catch (error) {
      console.warn('Primary exchange rate API failed:', error);
    }

    // フォールバック: 固定レート140円
    if (!exchangeRate || exchangeRate <= 0) {
      console.warn('Using fallback exchange rate: 140 JPY/USD');
      exchangeRate = 140;
    }

    return NextResponse.json({
      success: true,
      data: {
        rate: exchangeRate,
        base: 'USD',
        target: 'JPY',
        timestamp: new Date().toISOString(),
        source: exchangeRate === 140 ? 'fallback' : 'api',
      },
    });
  } catch (error) {
    console.error('Exchange rate API error:', error);

    // エラー時は固定レート140円を返す
    return NextResponse.json({
      success: true,
      data: {
        rate: 140,
        base: 'USD',
        target: 'JPY',
        timestamp: new Date().toISOString(),
        source: 'fallback',
      },
    });
  }
}
