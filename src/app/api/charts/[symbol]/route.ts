import { NextResponse } from 'next/server';
import { apiGet } from '@/lib/api-client';
import { ChartData } from '@/types/api';
import { apiConfig } from '@/lib/config';

/**
 * チャートデータAPI (BFF)
 * クライアントからのリクエストを受け取り、バックエンドAPIと通信する
 */
export async function GET(request: Request, { params }: { params: { symbol: string } }) {
  const { symbol } = params;
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '3M';
  const interval = searchParams.get('interval') || '1D';

  if (!symbol) {
    return NextResponse.json({ error: '銘柄シンボルが指定されていません' }, { status: 400 });
  }

  try {
    // バックエンドAPIエンドポイント
    const endpoint = `${apiConfig.host}/v1/charts/${encodeURIComponent(symbol)}`;

    // APIからデータを取得
    const data = await apiGet<ChartData>(endpoint, { period, interval });

    return NextResponse.json(data);
  } catch (error) {
    console.error('チャートデータ取得エラー:', error);
    return NextResponse.json(
      {
        error: 'チャートデータの取得中にエラーが発生しました',
        detail: { code: 'CHART_DATA_ERROR', message: String(error) },
      },
      { status: 500 }
    );
  }
}
