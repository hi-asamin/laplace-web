import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://wwwlaplace.com';
  const currentDate = new Date().toISOString();

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

  const staticPages = [
    { url: baseUrl, priority: '1.0', changefreq: 'weekly' },
    { url: `${baseUrl}/start`, priority: '0.9', changefreq: 'weekly' },
    { url: `${baseUrl}/dashboard`, priority: '0.8', changefreq: 'weekly' },
    { url: `${baseUrl}/markets/self/simulation`, priority: '0.8', changefreq: 'weekly' },
    { url: `${baseUrl}/search`, priority: '0.7', changefreq: 'weekly' },
  ];

  // 人気銘柄の個別シミュレーションページ
  const stockPages = popularStocks.map((symbol) => ({
    url: `${baseUrl}/markets/${symbol}/simulation`,
    priority: '0.6',
    changefreq: 'daily',
  }));

  // 人気銘柄の個別詳細ページ
  const stockDetailPages = popularStocks.map((symbol) => ({
    url: `${baseUrl}/markets/${symbol}`,
    priority: '0.5',
    changefreq: 'daily',
  }));

  const allPages = [...staticPages, ...stockPages, ...stockDetailPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
