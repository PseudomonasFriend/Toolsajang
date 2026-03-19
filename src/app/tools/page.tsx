import type { Metadata } from 'next';
import Link from 'next/link';
import { getActiveTools } from '@/data/tools';
import ToolsListWithFilter from '@/components/tools/ToolsListWithFilter';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com';
const FEATURED_TOOL_SLUGS = [
  'vat-calculator',
  'margin-calculator',
  'break-even-calculator',
  'card-fee-calculator',
] as const;

export const metadata: Metadata = {
  title: '전체 툴 목록',
  description:
    '마진 계산기, 부가세 계산기 등 소상공인에게 필요한 모든 무료 비즈니스 도구 목록입니다.',
  openGraph: {
    title: '전체 툴 목록 | 툴사장',
    description: '마진 계산기, 부가세 계산기 등 소상공인에게 필요한 모든 무료 비즈니스 도구 목록입니다.',
    url: `${BASE}/tools`,
    type: 'website',
  },
  alternates: { canonical: `${BASE}/tools` },
};

export default function ToolsPage() {
  const activeTools = getActiveTools();
  const featuredTools = FEATURED_TOOL_SLUGS.map((slug) =>
    activeTools.find((tool) => tool.slug === slug)
  ).filter((tool): tool is NonNullable<(typeof activeTools)[number]> => Boolean(tool));
  const categorySummary = [
    {
      title: '세금/정산이 급할 때',
      description: '부가세, 카드수수료, 마진처럼 바로 숫자 확인이 필요한 흐름',
    },
    {
      title: '매장 운영을 점검할 때',
      description: '손익분기점, 인건비, 임대료처럼 구조를 보는 계산',
    },
    {
      title: '배달/판촉 결정을 할 때',
      description: '배달 수익, 할인율, 목표 매출처럼 액션 전 판단에 필요한 계산',
    },
  ];

  return (
    <div className="bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.12),_transparent_38%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_42%,#ffffff_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <section className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)] md:p-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-blue-600">
                전체 계산기
              </p>
              <h1 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                지금 필요한 계산기부터
                <br />
                바로 찾을 수 있게 정리했습니다
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                급하게 숫자만 확인하려는 사장님, 어떤 툴부터 써야 할지 모르는
                초보 사장님, 여러 계산기를 비교하려는 운영 담당자까지 빠르게
                찾을 수 있도록 검색과 카테고리 탐색을 함께 붙였습니다.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { value: `${activeTools.length}개`, label: '즉시 사용 가능한 툴' },
                  { value: '로그인 없음', label: '바로 계산 가능한 구조' },
                  { value: '4개 흐름', label: '세금·운영·마케팅·유틸리티' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                  >
                    <p className="text-xl font-black text-slate-900">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-[1.75rem] border border-blue-100 bg-slate-950 p-5 text-white shadow-[0_22px_70px_-40px_rgba(15,23,42,0.8)]">
              <p className="text-sm font-semibold text-blue-200">급하면 여기부터</p>
              <div className="mt-4 space-y-3">
                {featuredTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-blue-300/40 hover:bg-white/10"
                  >
                    <p className="font-semibold text-white">{tool.name}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {tool.description}
                    </p>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-[2rem] border border-slate-100 bg-white/90 p-4 shadow-sm md:p-6">
            <ToolsListWithFilter tools={activeTools} />
          </div>

          <aside className="space-y-4">
            <section className="rounded-[2rem] border border-slate-100 bg-white/90 p-5 shadow-sm">
              <p className="text-sm font-semibold text-blue-600">처음 쓰는 사장님용</p>
              <h2 className="mt-2 text-lg font-bold text-slate-900">
                이런 상황이면 이렇게 찾으세요
              </h2>
              <div className="mt-4 space-y-3">
                {categorySummary.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                  >
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </div>
  );
}
