import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://wwwlaplace.com';
  const currentDate = new Date();

  // LPのみをサイトマップに含める
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  return sitemap;
}
