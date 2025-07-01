import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // アプリケーションページ（LP以外）
          '/dashboard',
          '/dashboard/',
          '/markets',
          '/markets/',
          '/search',
          '/search/',
          '/start',
          '/start/',
          // システムページ
          '/api/',
          '/admin/',
          '/*.json$',
          '/tmp/',
          '/private/',
          '/_next/',
          '/user/',
          '/account/',
          '/settings/',
          '/auth/',
          '/analytics/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          // アプリケーションページ（LP以外）
          '/dashboard',
          '/dashboard/',
          '/markets',
          '/markets/',
          '/search',
          '/search/',
          '/start',
          '/start/',
          // システムページ
          '/api/',
          '/admin/',
          '/tmp/',
          '/private/',
          '/_next/',
          '/user/',
          '/account/',
          '/settings/',
          '/auth/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          // アプリケーションページ（LP以外）
          '/dashboard',
          '/dashboard/',
          '/markets',
          '/markets/',
          '/search',
          '/search/',
          '/start',
          '/start/',
          // システムページ
          '/api/',
          '/admin/',
          '/tmp/',
          '/private/',
          '/_next/',
          '/user/',
          '/account/',
          '/settings/',
          '/auth/',
        ],
      },
    ],
    sitemap: 'https://wwwlaplace.com/sitemap.xml',
    host: 'https://wwwlaplace.com',
  };
}
