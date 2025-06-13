import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/*.json$', '/tmp/', '/private/'],
    },
    sitemap: 'https://laplace.jp/sitemap.xml',
  };
}
