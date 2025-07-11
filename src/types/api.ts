/**
 * API関連の型定義
 */

/**
 * 企業プロフィール情報のインターフェース
 */
export interface CompanyProfile {
  companyName?: string;
  logoUrl?: string;
  website?: string;
  businessSummary?: string;
  industryTags?: string[];
  fullTimeEmployees?: number;
  foundationYear?: number;
  headquarters?: string;
  marketCapFormatted?: string;
  // 旧フィールド（後方互換性のため）
  name?: string;
  description?: string;
  industry?: string;
  sector?: string;
  employees?: number;
  founded?: string;
  marketCap?: string;
  ceo?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
}

/**
 * 銘柄詳細情報のインターフェース
 */
export interface MarketDetails {
  symbol: string;
  name: string;
  market: string;
  marketName?: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  currency?: string;
  logoUrl?: string;
  sector?: string;
  industry?: string;
  description?: string;
  website?: string;
  dividendYield?: number;
  companyProfile?: CompanyProfile;
  tradingInfo?: {
    previousClose?: string;
    open?: string;
    dayHigh?: string;
    dayLow?: string;
    volume?: string;
    avgVolume?: string;
    marketCap?: string;
    peRatio?: string;
    primaryExchange?: string;
  };
  lastUpdated?: string;
}

/**
 * チャートデータのインターフェース
 */
export interface ChartData {
  symbol: string;
  period: string;
  interval: string;
  data: ChartDataPoint[];
}

/**
 * チャートデータポイントのインターフェース
 */
export interface ChartDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * 四半期業績データのインターフェース
 */
export interface QuarterlyEarning {
  quarter: string;
  value: string;
  reportDate?: string;
  previousYearValue?: string;
  growthRate?: string;
}

/**
 * 業界平均データのインターフェース
 */
export interface IndustryAverages {
  industryName: string;
  averagePer: string;
  averagePbr: string;
  sampleSize: number;
  lastUpdated: string;
}

/**
 * 主要指標のインターフェース
 */
export interface KeyMetrics {
  eps?: string;
  peRatio?: string;
  forwardPe?: string;
  priceToSales?: string;
  priceToBook?: string;
  roe?: string;
  roa?: string | null;
  debtToEquity?: string;
  currentRatio?: string;
  operatingMargin?: string;
  profitMargin?: string;
  industryAverages?: IndustryAverages;
}

/**
 * 四半期配当データのインターフェース
 */
export interface QuarterlyDividend {
  quarter: string;
  amount: string | null;
}

/**
 * API配当履歴データのインターフェース（APIレスポンス用）
 */
export interface ApiDividendHistoryItem {
  fiscalYear: string;
  totalDividend: string;
  isForecast: boolean;
  quarterlyDividends: QuarterlyDividend[];
  announcementDate: string;
}

/**
 * 配当履歴データのインターフェース（UI表示用）
 */
export interface DividendHistoryItem {
  year: string;
  dividend: number;
  isEstimate?: boolean;
}

/**
 * 配当データのインターフェース
 */
export interface DividendData {
  dividend?: string;
  dividendYield?: string;
  payoutRatio?: string;
  exDividendDate?: string;
  nextPaymentDate?: string;
  dividendHistory?: DividendHistoryItem[];
}

/**
 * 成長性指標のインターフェース
 */
export interface ValuationGrowth {
  revenueGrowth?: string;
  earningsGrowth?: string;
  epsTtm?: string;
  epsGrowth?: string;
  estimatedEpsGrowth?: string;
}

/**
 * ファンダメンタル分析データのインターフェース
 */
export interface FundamentalData {
  symbol: string;
  quarterlyEarnings?: QuarterlyEarning[];
  keyMetrics?: KeyMetrics;
  dividendData?: DividendData;
  dividendHistory?: ApiDividendHistoryItem[];
  valuationGrowth?: ValuationGrowth;
}

/**
 * 関連銘柄のインターフェース
 */
export interface RelatedMarket {
  symbol: string;
  name: string;
  price: string | number;
  changePercent: string | number;
  isPositive: boolean;
  logoUrl?: string;
  miniChartData?: number[];
}

/**
 * 関連銘柄取得APIレスポンスのインターフェース
 */
export interface RelatedMarketsResponse {
  items: RelatedMarket[];
}

/**
 * 新しい関連銘柄取得APIアイテムのインターフェース
 */
export interface RelatedMarketItem {
  symbol: string;
  name: string;
  price?: string | number; // 文字列形式（例: "$60.10"）または数値形式
  changePercent?: string | number; // 文字列形式（例: "0.0%"）または数値形式
  logoUrl?: string | null; // キャメルケース
  dividendYield?: string | number | null;
}

/**
 * 新しい関連銘柄取得APIレスポンスのインターフェース
 */
export interface RelatedMarketsApiResponse {
  items: RelatedMarketItem[];
}

/**
 * APIエラーレスポンスのインターフェース
 */
export interface ApiError {
  error: string;
  code: string;
  message?: string;
  requestId?: string;
  details?: Array<{
    field?: string;
    message: string;
  }>;
}

/**
 * 検索結果の型定義
 */
export interface SearchResult {
  symbol: string; // 銘柄コード（例: "AAPL", "7203.T"）
  name: string; // 銘柄名（例: "Apple Inc.", "トヨタ自動車"）
  asset_type: string; // 資産タイプ（"STOCK", "ETF", "INDEX", "CRYPTO", "COMMODITY"）
  market: string; // 市場区分（"US", "Japan"）
  price?: string; // 現在価格（例: "$150.50", "¥2,120"）
  change_percent?: string; // 前日比（例: "+1.2%", "-0.5%"）
  score: number; // 検索スコア（完全一致: 100, 先頭一致: 90, 部分一致: 80）
  logoUrl?: string; // 企業ロゴのURL
}

/**
 * 検索レスポンスのインターフェース
 */
export interface SearchResponse {
  results: SearchResult[]; // 検索結果の配列
  total: number; // 結果の総数
}

/**
 * エラーレスポンスのインターフェース
 */
export interface ApiErrorResponse {
  detail: {
    code: string; // エラーコード
    message: string; // エラーメッセージ
  };
}
