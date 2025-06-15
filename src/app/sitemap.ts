import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000';

  // 静的ページ
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/start`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  // 人気銘柄の動的ページ（SEO重要度の高い銘柄）
  const popularSymbols = [
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

  const marketPages = popularSymbols.map((symbol) => ({
    url: `${baseUrl}/markets/${encodeURIComponent(symbol)}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.9,
  }));

  const simulationPages = popularSymbols.map((symbol) => ({
    url: `${baseUrl}/markets/${encodeURIComponent(symbol)}/simulation`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...marketPages, ...simulationPages];
}
