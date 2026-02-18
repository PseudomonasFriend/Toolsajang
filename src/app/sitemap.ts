import type { MetadataRoute } from 'next';
import { getAllTipSlugs } from '@/lib/tips';
import { getAllToolSlugs } from '@/tools';

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const tips = getAllTipSlugs();
  const tools = getAllToolSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/tips`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((slug) => ({
    url: `${BASE}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const tipPages: MetadataRoute.Sitemap = tips.map((slug) => ({
    url: `${BASE}/tips/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...tipPages];
}
