import { NextResponse } from 'next/server';
import { apiGet } from '@/lib/api-client';
import { RelatedMarketsResponse } from '@/types/api';
import { apiConfig } from '@/lib/config';

/**
 * 関連銘柄API (BFF)
 * クライアントからのリクエストを受け取り、バックエンドAPIと通信する
 */
export async function GET(request: Request, { params }: { params: { symbol: string } }) {
  const { symbol } = params;
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '5';

  if (!symbol) {
    return NextResponse.json({ error: '銘柄シンボルが指定されていません' }, { status: 400 });
  }

  try {
    // バックエンドAPIエンドポイント
    const endpoint = `${apiConfig.host}/v1/related/${encodeURIComponent(symbol)}`;

    // APIからデータを取得
    const data = await apiGet<RelatedMarketsResponse>(endpoint, { limit });

    return NextResponse.json(data);
  } catch (error) {
    console.error('関連銘柄取得エラー:', error);
    return NextResponse.json(
      {
        error: '関連銘柄の取得中にエラーが発生しました',
        detail: { code: 'RELATED_MARKETS_ERROR', message: String(error) },
      },
      { status: 500 }
    );
  }
}
