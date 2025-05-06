import {
  MarketDetails,
  ChartData,
  FundamentalData,
  RelatedMarket,
  RelatedMarketsResponse,
  SearchResponse,
  SearchResult,
  ApiErrorResponse,
} from '@/types/api';

import { getMarketDetails as fetchMarketDetails } from '@/lib/api/market-details';
import { getChartData as fetchChartData } from '@/lib/api/chart';
import { getFundamentalData as fetchFundamentalData } from '@/lib/api/fundamentals';
import { getRelatedMarkets as fetchRelatedMarkets } from '@/lib/api/related';
import { searchMarkets as fetchSearchMarkets } from '@/lib/api/search';

// API呼び出し関数 - 検索
export async function searchMarkets(query: string): Promise<SearchResponse> {
  try {
    return await fetchSearchMarkets(query);
  } catch (error) {
    console.error('Error searching markets:', error);
    throw error;
  }
}

// API呼び出し関数 - 詳細情報
export async function getMarketDetails(symbol: string): Promise<MarketDetails> {
  try {
    return await fetchMarketDetails(symbol);
  } catch (error) {
    console.error('Error fetching market details:', error);
    throw error;
  }
}

// API呼び出し関数 - チャート
export async function getChartData(
  symbol: string,
  period = '3M',
  interval = '1D'
): Promise<ChartData> {
  try {
    return await fetchChartData(symbol, period, interval);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
}

// API呼び出し関数 - ファンダメンタル
export async function getFundamentalData(symbol: string): Promise<FundamentalData> {
  try {
    return await fetchFundamentalData(symbol);
  } catch (error) {
    console.error('Error fetching fundamental data:', error);
    throw error;
  }
}

// API呼び出し関数 - 関連銘柄
export async function getRelatedMarkets(
  symbol: string,
  limit = 5
): Promise<RelatedMarketsResponse> {
  try {
    return await fetchRelatedMarkets(symbol, limit);
  } catch (error) {
    console.error('Error fetching related markets:', error);
    throw error;
  }
}

// 型をエクスポートして後方互換性を維持
export type {
  MarketDetails,
  ChartData,
  FundamentalData,
  RelatedMarket,
  RelatedMarketsResponse,
  SearchResponse,
  SearchResult,
  ApiErrorResponse,
};
