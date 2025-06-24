import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://wwwlaplace.com';
  const currentDate = new Date();

  // 人気銘柄リスト（検索頻度の高い銘柄）
  const popularStocks = [
    // 米国ETF
    'VOO',
    'VTI',
    'VEA',
    'VWO',
    'QQQ',
    'SPY',
    'IVV',
    'SCHD',
    // 米国個別株
    'AAPL',
    'MSFT',
    'GOOGL',
    'AMZN',
    'NVDA',
    'TSLA',
    'META',
    'NFLX',
    // 日本株
    '7203',
    '6758',
    '8306',
    '9984',
    '8411',
    '7974',
    '6861',
    '4689',
  ];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/start`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/markets/self/simulation`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // 人気銘柄の個別シミュレーションページ
  const stockPages: MetadataRoute.Sitemap = popularStocks.map((symbol) => ({
    url: `${baseUrl}/markets/${symbol}/simulation`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.6,
  }));

  // 人気銘柄の個別詳細ページ
  const stockDetailPages: MetadataRoute.Sitemap = popularStocks.map((symbol) => ({
    url: `${baseUrl}/markets/${symbol}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.5,
  }));

  return [...staticPages, ...stockPages, ...stockDetailPages];
}
