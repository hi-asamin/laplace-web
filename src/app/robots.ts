import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
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
    sitemap: 'https://laplace.jp/sitemap.xml',
    host: 'https://laplace.jp',
  };
}
