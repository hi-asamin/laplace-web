/**
 * サーバーサイド専用の検索API処理
 * BFFからバックエンドAPIへの通信を行う
 */
import { apiConfig, apiEndpoints } from '@/lib/config';
import { SearchResponse } from '@/types/api';

/**
 * サーバーサイドからバックエンドのAPIを呼び出す
 * @param url APIのURL
 * @param options fetchオプション
 * @returns レスポンス
 */
async function fetchServerApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...apiConfig.defaultHeaders,
        ...options.headers,
      },
      // サーバーサイドから呼び出す場合、次の設定が必要になることがある
      // cache: 'no-store',  // キャッシュを無効化
      // next: { revalidate: 60 }, // 60秒ごとに再検証
    });

    if (!response.ok) {
      throw new Error(`APIエラー: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error('サーバーサイドAPI通信エラー:', error);
    throw error;
  }
}

/**
 * GETリクエストをサーバーサイドから送信する
 * @param endpoint エンドポイント
 * @param params クエリパラメータ
 * @returns レスポンス
 */
async function apiServerGet<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${apiConfig.host}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value);
      }
    });
  }

  return fetchServerApi<T>(url.toString(), { method: 'GET' });
}

/**
 * バックエンドの銘柄検索APIを呼び出す
 * @param query 検索クエリ
 * @returns 検索結果
 */
export async function searchMarkets(query: string): Promise<SearchResponse> {
  try {
    const endpoint = apiEndpoints.marketSearch;
    return await apiServerGet<SearchResponse>(endpoint.path, {
      [Object.keys(endpoint.params)[0]]: query,
    });
  } catch (error) {
    console.error('バックエンド市場検索APIエラー:', error);
    // エラーを上位に伝播させる
    throw error;
  }
}
