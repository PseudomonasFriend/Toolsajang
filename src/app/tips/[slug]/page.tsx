import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getTipBySlug, getTipsList, getAllTipSlugs } from '@/lib/tips';
import AdBanner from '@/components/common/AdBanner';
import JsonLd from '@/components/common/JsonLd';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = getAllTipSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tip = getTipBySlug(slug);
  if (!tip) return { title: '장사 팁 | 툴사장' };
  return {
    title: tip.meta.title,
    description: tip.meta.description,
    openGraph: {
      title: `${tip.meta.title} | 툴사장`,
      description: tip.meta.description,
    },
  };
}

export default async function TipDetailPage({ params }: Props) {
  const { slug } = await params;
  const tip = getTipBySlug(slug);
  if (!tip) notFound();

  const allTips = getTipsList();
  const related = allTips
    .filter((t) => t.slug !== slug)
    .slice(0, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: tip.meta.title,
    description: tip.meta.description,
    datePublished: tip.meta.date,
    author: { '@type': 'Organization', name: tip.meta.author },
    url: `${BASE}/tips/${slug}`,
  };

  return (
    <div className="mx-auto max-w-[720px] px-4 py-8 pb-24">
      <JsonLd data={articleJsonLd} />
      <article>
        <header className="mb-6">
          <p className="text-sm text-gray-500">{tip.meta.date}</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {tip.meta.title}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {tip.meta.description}
          </p>
        </header>

        <div className="prose prose-gray max-w-none prose-p:text-gray-700 prose-headings:text-gray-900">
          <MDXRemote source={tip.content} />
        </div>

        {/* 본문 하단 광고 */}
        <AdBanner
          position="tips-bottom"
          type="adsense"
          className="mt-8"
        />

        {/* 자사 홍보 영역 */}
        <AdBanner
          position="tool-page-bottom"
          type="custom"
          className="mt-6"
        />

        {/* 관련 글 */}
        {related.length > 0 && (
          <section className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="mb-3 text-lg font-bold text-gray-900">
              관련 장사 팁
            </h2>
            <ul className="space-y-2">
              {related.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/tips/${t.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}
