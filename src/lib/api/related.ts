/**
 * 関連銘柄データ関連のAPI処理（クライアントサイド）
 */
import { apiGet } from '@/lib/api-client';
import { RelatedMarketsResponse, RelatedMarketsApiResponse } from '@/types/api';
import { apiConfig } from '@/lib/config';

// バックエンドAPIエンドポイント
const API_ENDPOINTS = {
  related: '/v1/related', // /{symbol}が後ろに付く
};

/**
 * 関連銘柄を取得する
 * @param symbol 銘柄シンボル
 * @param limit 取得する銘柄の最大数
 * @returns 関連銘柄のリスト
 */
export async function getRelatedMarkets(
  symbol: string,
  limit = 5
): Promise<RelatedMarketsResponse> {
  try {
    const endpoint = `${API_ENDPOINTS.related}/${symbol}`;
    return await apiGet<RelatedMarketsResponse>(endpoint, { limit: String(limit) });
  } catch (error) {
    console.error('関連銘柄取得エラー:', error);
    throw error;
  }
}

/**
 * 配当利回りを基準にした関連銘柄を取得する
 * @param symbol 銘柄シンボル
 * @param minDividendYield 最小配当利回り（%）
 * @param limit 取得する銘柄の最大数
 * @returns 関連銘柄のリスト
 */
export async function getRelatedMarketsByDividendYield(
  symbol: string,
  minDividendYield: number,
  limit = 5
): Promise<RelatedMarketsApiResponse> {
  try {
    const endpoint = `${API_ENDPOINTS.related}/${symbol}`;
    return await apiGet<RelatedMarketsApiResponse>(endpoint, {
      criteria: 'dividend_yield',
      min_dividend_yield: String(minDividendYield),
      limit: String(limit),
    });
  } catch (error) {
    console.error('配当利回り基準関連銘柄取得エラー:', error);
    throw error;
  }
}
