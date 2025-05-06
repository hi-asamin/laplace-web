/**
 * 検索関連のAPI処理（クライアントサイド）
 */
import { apiGet } from '@/lib/api-client';
import { SearchResponse } from '@/types/api';

// BFF経由でのAPIエンドポイント
const BFF_ENDPOINTS = {
  marketSearch: '/api/markets/search',
};

/**
 * BFF経由で銘柄検索APIを呼び出す
 * @param query 検索クエリ
 * @returns 検索結果
 */
export async function searchMarkets(query: string): Promise<SearchResponse> {
  try {
    // BFFに検索リクエストを送信
    return await apiGet<SearchResponse>(BFF_ENDPOINTS.marketSearch, { query });
  } catch (error) {
    console.error('市場検索APIエラー:', error);
    // エラー時は空の結果を返す
    return { results: [], total: 0 };
  }
}
