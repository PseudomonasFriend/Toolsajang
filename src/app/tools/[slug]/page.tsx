import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllToolSlugs, getToolModule } from '@/tools';
import CalculatorLayout from '@/components/common/CalculatorLayout';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** 빌드 시 정적 생성할 slug 목록 */
export async function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com';

/** 동적 SEO 메타데이터 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const mod = getToolModule(slug);
  if (!mod) return {};

  const url = `${BASE}/tools/${slug}`;
  return {
    title: mod.seo.title,
    description: mod.seo.description,
    openGraph: {
      title: mod.seo.title,
      description: mod.seo.description,
      url,
      type: 'website',
    },
    alternates: { canonical: url },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const mod = getToolModule(slug);

  if (!mod) notFound();

  const { meta, Component } = mod;

  return (
    <CalculatorLayout title={meta.name} description={meta.description}>
      <Component />
    </CalculatorLayout>
  );
}
