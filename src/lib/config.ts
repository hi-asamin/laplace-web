/**
 * アプリケーション全体の設定
 */

/**
 * 環境変数からAPIのホストURLを取得
 */
export const getApiHost = (): string => {
  return process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:8000';
};

/**
 * APIエンドポイントの定義
 * 各エンドポイントのパスと必要なパラメータ情報を含む
 */
export const apiEndpoints = {
  marketSearch: {
    path: '/v1/markets/search',
    params: {
      query: 'string', // 検索クエリ (必須)
    },
  },
};

/**
 * BFFエンドポイントの定義
 * フロントエンドからアクセスするBFFのエンドポイント
 */
export const bffEndpoints = {
  marketSearch: {
    path: '/api/markets/search',
    params: {
      query: 'string', // 検索クエリ (必須)
    },
  },
};

/**
 * API関連の設定
 */
export const apiConfig = {
  host: getApiHost(),
  endpoints: {
    marketSearch: apiEndpoints.marketSearch.path,
  },
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
};

/**
 * サーバーサイド専用の拡張設定
 * BFFからバックエンドへのリクエスト時に使用
 */
export const serverApiConfig = {
  ...apiConfig,
  // サーバーサイド専用のヘッダーやオプション
  serverHeaders: {
    // BFF→バックエンド間通信用のAPIキーなど
    // 'X-API-Key': process.env.BACKEND_API_KEY,
  },
};
