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
    '@type': ['SoftwareApplication', 'WebApplication'],
    name: meta.name,
    description: meta.description,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'BusinessApplication',
    softwareVersion: '1.0',
    operatingSystem: 'All',
    isAccessibleForFree: true,
    url,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '이 계산기는 무료로 사용할 수 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네, 툴사장닷컴의 모든 계산기는 100% 무료입니다. 로그인이나 회원가입 없이 즉시 사용 가능합니다.',
        },
      },
      {
        '@type': 'Question',
        name: '모바일에서도 사용할 수 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네, 모든 기기(PC, 스마트폰, 태블릿)에서 최적화된 화면으로 사용할 수 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '계산 결과는 얼마나 정확한가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '세금·수수료율은 최신 법령 기준을 반영하며, 실제 비즈니스 상황에 따라 결과가 다를 수 있으므로 참고용으로 활용하시기 바랍니다.',
        },
      },
    ],
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
      <JsonLd id={`${slug}-faq-jsonld`} data={faqJsonLd} />
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
