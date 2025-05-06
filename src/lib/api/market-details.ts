/**
 * 銘柄詳細情報関連のAPI処理（クライアントサイド）
 */
import { apiGet } from '@/lib/api-client';
import { MarketDetails } from '@/types/api';
import { apiConfig } from '@/lib/config';

// バックエンドAPIエンドポイント
const API_ENDPOINTS = {
  marketDetails: '/v1/markets', // /{symbol}が後ろに付く
};

/**
 * 銘柄詳細情報を取得する
 * @param symbol 銘柄シンボル
 * @returns 銘柄詳細情報
 */
export async function getMarketDetails(symbol: string): Promise<MarketDetails> {
  try {
    const endpoint = `${API_ENDPOINTS.marketDetails}/${symbol}`;
    return await apiGet<MarketDetails>(endpoint);
  } catch (error) {
    console.error('銘柄詳細情報取得エラー:', error);
    throw error;
  }
}
