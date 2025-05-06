/**
 * ファンダメンタルデータ関連のAPI処理（クライアントサイド）
 */
import { apiGet } from '@/lib/api-client';
import { FundamentalData } from '@/types/api';
import { apiConfig } from '@/lib/config';

// バックエンドAPIエンドポイント
const API_ENDPOINTS = {
  fundamentals: '/v1/fundamentals', // /{symbol}が後ろに付く
};

/**
 * ファンダメンタル分析データを取得する
 * @param symbol 銘柄シンボル
 * @returns ファンダメンタル分析データ
 */
export async function getFundamentalData(symbol: string): Promise<FundamentalData> {
  try {
    const endpoint = `${API_ENDPOINTS.fundamentals}/${symbol}`;
    return await apiGet<FundamentalData>(endpoint);
  } catch (error) {
    console.error('ファンダメンタルデータ取得エラー:', error);
    throw error;
  }
}
