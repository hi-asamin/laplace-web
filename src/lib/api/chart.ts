/**
 * チャートデータ関連のAPI処理（クライアントサイド）
 */
import { apiGet } from '@/lib/api-client';
import { ChartData } from '@/types/api';
import { apiConfig } from '@/lib/config';

// バックエンドAPIエンドポイント
const API_ENDPOINTS = {
  chartData: '/v1/charts', // /{symbol}が後ろに付く
};

/**
 * チャートデータを取得する
 * @param symbol 銘柄シンボル
 * @param period 期間（1D, 1W, 1M, 3M, 6M, 1Y, ALL）
 * @param interval データポイントの間隔（1m, 5m, 15m, 30m, 60m, 1D, 1W, 1M）
 * @returns チャートデータ
 */
export async function getChartData(
  symbol: string,
  period = '3M',
  interval = '1D'
): Promise<ChartData> {
  try {
    const endpoint = `${API_ENDPOINTS.chartData}/${symbol}`;
    return await apiGet<ChartData>(endpoint, { period, interval });
  } catch (error) {
    console.error('チャートデータ取得エラー:', error);
    throw error;
  }
}
