import { apiGet } from '@/lib/api-client';
import { ChartData } from '@/types/api';
import { apiConfig } from '@/lib/config';

/**
 * チャートデータAPI (BFF)
 * クライアントからのリクエストを受け取り、バックエンドAPIと通信する
 */
export async function GET(req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || '3M';
  const interval = searchParams.get('interval') || '1D';

  if (!symbol) {
    return Response.json({ error: '銘柄シンボルが指定されていません' }, { status: 400 });
  }

  try {
    // バックエンドAPIエンドポイント
    const endpoint = `${apiConfig.host}/v1/charts/${encodeURIComponent(symbol)}`;

    // APIからデータを取得
    const data = await apiGet<ChartData>(endpoint, { period, interval });

    return Response.json(data);
  } catch (error) {
    console.error('チャートデータ取得エラー:', error);
    return Response.json(
      {
        error: 'チャートデータの取得中にエラーが発生しました',
        detail: { code: 'CHART_DATA_ERROR', message: String(error) },
      },
      { status: 500 }
    );
  }
}
