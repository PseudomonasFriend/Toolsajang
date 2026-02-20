import type { MetadataRoute } from 'next';
import { getTipsList } from '@/lib/tips';
import { getAllToolSlugs } from '@/tools';

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const tips = getTipsList();
  const toolSlugs = getAllToolSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/tips`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const toolPages: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${BASE}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 팁 페이지는 프론트매터의 date 값을 lastModified로 활용
  const tipPages: MetadataRoute.Sitemap = tips.map((tip) => ({
    url: `${BASE}/tips/${tip.slug}`,
    lastModified: tip.date ? new Date(tip.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...tipPages];
}
