import { NextResponse } from 'next/server';
import { apiGet } from '@/lib/api-client';
import { MarketDetails } from '@/types/api';
import { apiConfig } from '@/lib/config';

/**
 * 銘柄詳細情報API (BFF)
 * クライアントからのリクエストを受け取り、バックエンドAPIと通信する
 */
export async function GET(request: Request, { params }: { params: { symbol: string } }) {
  const { symbol } = params;

  if (!symbol) {
    return NextResponse.json({ error: '銘柄シンボルが指定されていません' }, { status: 400 });
  }

  try {
    // バックエンドAPIエンドポイント
    const endpoint = `${apiConfig.host}/v1/markets/${encodeURIComponent(symbol)}`;

    // APIからデータを取得
    const data = await apiGet<MarketDetails>(endpoint);

    return NextResponse.json(data);
  } catch (error) {
    console.error('銘柄詳細情報取得エラー:', error);
    return NextResponse.json(
      {
        error: '銘柄詳細情報の取得中にエラーが発生しました',
        detail: { code: 'MARKET_DETAILS_ERROR', message: String(error) },
      },
      { status: 500 }
    );
  }
}
