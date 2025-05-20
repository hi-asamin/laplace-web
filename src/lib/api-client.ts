/**
 * API通信のための汎用的なクライアント
 * BFF経由のAPIアクセスとバックエンドへの直接アクセスの両方に対応
 */
import { apiConfig } from './config';
import { ApiErrorResponse } from '@/types/api';

/**
 * クライアントサイドのAPIリクエストを判断し、適切なURLを構築する
 * BFFエンドポイント(/api/で始まる)の場合はそのまま使用し、
 * それ以外の場合はconfigのホストURLを前に付ける
 */
function getFullUrl(endpoint: string): string {
  // BFFエンドポイント（/api/で始まる）の場合はそのまま使用
  if (endpoint.startsWith('/api/')) {
    return endpoint;
  }
  // それ以外のAPIエンドポイントの場合はホストURLを前に付ける
  return `${apiConfig.host}${endpoint}`;
}

/**
 * API通信の基本的なエラーハンドリングを行うラッパー関数
 * @param url リクエスト先URL
 * @param options fetchオプション
 * @returns レスポンス
 */
export async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...apiConfig.defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ApiErrorResponse;
      throw new Error(errorData.detail?.message || `APIエラー: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error('API通信エラー:', error);
    throw error;
  }
}

/**
 * GETリクエストを送信する
 * @param endpoint エンドポイント
 * @param params クエリパラメータ
 * @returns レスポンス
 */
export async function apiGet<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(getFullUrl(endpoint), window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value);
      }
    });
  }

  return fetchApi<T>(url.toString(), { method: 'GET' });
}
