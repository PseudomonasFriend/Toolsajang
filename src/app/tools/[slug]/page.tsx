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

/** 동적 SEO 메타데이터 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const mod = getToolModule(slug);
  if (!mod) return {};

  return {
    title: mod.seo.title,
    description: mod.seo.description,
    openGraph: {
      title: `${mod.seo.title} | 툴사장`,
      description: mod.seo.description,
    },
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
