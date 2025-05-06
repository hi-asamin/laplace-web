import { NextResponse } from 'next/server';
import { apiGet } from '@/lib/api-client';
import { FundamentalData } from '@/types/api';
import { apiConfig } from '@/lib/config';

/**
 * ファンダメンタルデータAPI (BFF)
 * クライアントからのリクエストを受け取り、バックエンドAPIと通信する
 */
export async function GET(request: Request, { params }: { params: { symbol: string } }) {
  const { symbol } = params;

  if (!symbol) {
    return NextResponse.json({ error: '銘柄シンボルが指定されていません' }, { status: 400 });
  }

  try {
    // バックエンドAPIエンドポイント
    const endpoint = `${apiConfig.host}/v1/fundamentals/${encodeURIComponent(symbol)}`;

    // APIからデータを取得
    const data = await apiGet<FundamentalData>(endpoint);

    return NextResponse.json(data);
  } catch (error) {
    console.error('ファンダメンタルデータ取得エラー:', error);
    return NextResponse.json(
      {
        error: 'ファンダメンタルデータの取得中にエラーが発生しました',
        detail: { code: 'FUNDAMENTAL_DATA_ERROR', message: String(error) },
      },
      { status: 500 }
    );
  }
}
