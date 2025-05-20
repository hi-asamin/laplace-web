import { searchMarkets } from '@/lib/api/server-search';

/**
 * 銘柄検索API (BFF)
 * クライアントからのリクエストを受け取り、バックエンドAPIと通信する
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  if (!query.trim()) {
    return Response.json({ results: [], total: 0 });
  }

  try {
    const results = await searchMarkets(query);
    return Response.json(results);
  } catch (error) {
    console.error('BFF検索エラー:', error);
    return Response.json(
      {
        error: '検索処理でエラーが発生しました',
        detail: { code: 'SEARCH_ERROR', message: String(error) },
      },
      { status: 500 }
    );
  }
}
