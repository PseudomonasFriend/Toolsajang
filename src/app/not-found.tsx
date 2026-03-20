import type { Metadata } from 'next';
import Link from 'next/link';
import { getActiveTools } from '@/data/tools';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  description: '요청하신 페이지가 존재하지 않습니다. 아래 인기 계산기를 바로 이용하세요.',
  robots: { index: false, follow: true },
};

const POPULAR_SLUGS = [
  'vat-calculator',
  'margin-calculator',
  'break-even-calculator',
  'card-fee-calculator',
  'delivery-profit-calculator',
  'salary-calculator',
];

export default function NotFound() {
  const activeTools = getActiveTools();
  const popularTools = POPULAR_SLUGS.map((slug) =>
    activeTools.find((t) => t.slug === slug)
  ).filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="text-6xl font-black text-blue-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 text-base leading-7 text-slate-600">
        주소가 잘못 입력됐거나 삭제된 페이지입니다.
        <br />
        아래 인기 계산기를 바로 이용하세요.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {popularTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <p className="font-semibold text-slate-900">{tool.name}</p>
            <p className="mt-1 text-sm text-slate-500">{tool.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          홈으로 가기
        </Link>
        <Link
          href="/tools"
          className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
        >
          전체 계산기 보기
        </Link>
        <Link
          href="/tips"
          className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
        >
          장사 팁 보기
        </Link>
      </div>
    </div>
  );
}
