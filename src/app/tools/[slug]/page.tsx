import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllToolSlugs, getToolModule } from '@/tools';
import CalculatorLayout from '@/components/common/CalculatorLayout';
import JsonLd from '@/components/common/JsonLd';

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
    keywords: [
      mod.meta.name,
      `${mod.meta.name} 무료`,
      `${mod.meta.name} 온라인`,
      `${mod.meta.category} 계산기`,
      '사장님 계산기',
      '무료 비즈니스 툴',
    ],
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
  const url = `${BASE}/tools/${slug}`;
  const toolJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: meta.name,
    description: meta.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    isAccessibleForFree: true,
    url,
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: BASE,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '계산기 모음',
        item: `${BASE}/tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: meta.name,
        item: url,
      },
    ],
  };

  return (
    <>
      <JsonLd id={`${slug}-tool-jsonld`} data={toolJsonLd} />
      <JsonLd id={`${slug}-breadcrumb-jsonld`} data={breadcrumbJsonLd} />
      <CalculatorLayout
        title={meta.name}
        description={meta.description}
        currentToolSlug={slug}
      >
        <Component />
      </CalculatorLayout>
    </>
  );
}
