import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMarketDetails, getChartData, getFundamentalData, getRelatedMarkets } from '@/lib/api';
import { MarketDetails, ChartData, FundamentalData, RelatedMarket } from '@/types/api';
import { getCurrencyFromSymbol, formatCurrencyPrice } from '@/utils/currency';
import MarketDetailClient from './MarketDetailClient';

interface PageProps {
  params: Promise<{ symbol: string }>;
}

// メタデータ生成関数（SEO最適化）
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { symbol } = await params;
  const decodedSymbol = decodeURIComponent(symbol);

  try {
    // サーバーサイドでマーケットデータを取得
    const marketData = await getMarketDetails(decodedSymbol);
    const currency = getCurrencyFromSymbol(decodedSymbol);

    // 基本的なメタデータ
    const title = `${marketData.name} (${decodedSymbol}) - 株価・配当・財務分析 | Laplace`;
    const description = `${marketData.name} (${decodedSymbol})の詳細分析。現在株価${marketData.price}、配当利回り、PER/PBR、業績推移を確認。投資判断に必要な情報を網羅的に提供。`;

    // 構造化データ用の価格情報
    const priceValue = parseFloat(marketData.price?.replace(/[¥$,]/g, '') || '0');
    const formattedPrice = formatCurrencyPrice(priceValue, currency);

    // Open Graph画像URL（動的生成）
    const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://laplace-web.vercel.app'}/api/og?symbol=${encodeURIComponent(decodedSymbol)}&name=${encodeURIComponent(marketData.name)}&price=${encodeURIComponent(formattedPrice)}`;

    return {
      title,
      description,
      keywords: [
        marketData.name,
        decodedSymbol,
        '株価',
        '配当',
        '投資',
        '財務分析',
        'PER',
        'PBR',
        '配当利回り',
        marketData.industry || '',
        marketData.sector || '',
        currency === 'USD' ? '米国株' : '日本株',
      ]
        .filter(Boolean)
        .join(', '),

      // Open Graph
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://laplace-web.vercel.app'}/markets/${symbol}`,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${marketData.name} (${decodedSymbol}) 株価チャート`,
          },
        ],
        siteName: 'Laplace - 資産シミュレーター',
      },

      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
        creator: '@laplace_app',
      },

      // 追加のメタタグ
      other: {
        'article:author': 'Laplace',
        'article:section': '投資・資産運用',
        'article:tag': [marketData.name, decodedSymbol, '株価分析'].join(','),
      },

      // 正規URL
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://laplace-web.vercel.app'}/markets/${symbol}`,
      },

      // robots
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    // エラー時のフォールバックメタデータ
    return {
      title: `${decodedSymbol} - 株価分析 | Laplace`,
      description: `${decodedSymbol}の株価、配当、財務情報を分析。投資判断に必要な情報を提供します。`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

// サーバーサイドでデータを取得する関数
async function getServerSideData(symbol: string) {
  const decodedSymbol = decodeURIComponent(symbol);

  try {
    // 並列でデータを取得（パフォーマンス最適化）
    const [marketData, chartData, fundamentalData, relatedMarkets] = await Promise.allSettled([
      getMarketDetails(decodedSymbol),
      getChartData(decodedSymbol, '1Y'), // デフォルト期間
      getFundamentalData(decodedSymbol),
      getRelatedMarkets(decodedSymbol),
    ]);

    return {
      marketData: marketData.status === 'fulfilled' ? marketData.value : null,
      chartData: chartData.status === 'fulfilled' ? chartData.value : null,
      fundamentalData: fundamentalData.status === 'fulfilled' ? fundamentalData.value : null,
      relatedMarkets: relatedMarkets.status === 'fulfilled' ? relatedMarkets.value.items || [] : [],
      symbol: decodedSymbol,
    };
  } catch (error) {
    console.error('Server-side data fetch error:', error);
    return {
      marketData: null,
      chartData: null,
      fundamentalData: null,
      relatedMarkets: [],
      symbol: decodedSymbol,
    };
  }
}

// メインのサーバーコンポーネント
export default async function MarketDetailPage({ params }: PageProps) {
  const { symbol } = await params;
  // サーバーサイドでデータを取得
  const serverData = await getServerSideData(symbol);

  // 基本的なマーケットデータが取得できない場合は404
  if (!serverData.marketData) {
    notFound();
  }

  // 構造化データ（JSON-LD）の生成
  const currency = getCurrencyFromSymbol(serverData.symbol);
  const priceValue = parseFloat(serverData.marketData.price?.replace(/[¥$,]/g, '') || '0');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: serverData.marketData.name,
    identifier: serverData.symbol,
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://laplace-web.vercel.app'}/markets/${symbol}`,
    description: `${serverData.marketData.name}の株価、配当、財務分析情報`,
    provider: {
      '@type': 'Organization',
      name: 'Laplace',
      url: process.env.NEXT_PUBLIC_BASE_URL || 'https://laplace-web.vercel.app',
    },
    offers: {
      '@type': 'Offer',
      price: priceValue,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
    },
    ...(serverData.marketData.industry && {
      category: serverData.marketData.industry,
    }),
  };

  return (
    <>
      {/* 構造化データの埋め込み */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* クライアントコンポーネントにデータを渡す */}
      <MarketDetailClient initialData={serverData} symbol={symbol} />
    </>
  );
}
