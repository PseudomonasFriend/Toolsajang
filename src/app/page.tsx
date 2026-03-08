import type { Metadata } from 'next';
import Link from 'next/link';
import { getActiveTools } from '@/data/tools';
import ToolCard from '@/components/tools/ToolCard';
import TipCard from '@/components/tips/TipCard';
import AdBanner from '@/components/common/AdBanner';
import JsonLd from '@/components/common/JsonLd';
import { getLatestTips } from '@/lib/tips';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com';
const FEATURED_TOOL_SLUGS = [
  'vat-calculator',
  'margin-calculator',
  'break-even-calculator',
  'card-fee-calculator',
  'delivery-profit-calculator',
  'sales-forecast-calculator',
];

const categoryCopy = {
  '재무/회계': {
    summary: '부가세, 마진, 카드수수료, 대출 상환처럼 매일 만나는 숫자를 빠르게 정리합니다.',
    keywords: ['부가세 계산기', '마진 계산기', '카드수수료 계산기'],
  },
  '매장운영': {
    summary: '손익분기점, 인건비율, 임대료 비중 등 운영 지표를 바로 비교할 수 있습니다.',
    keywords: ['손익분기점 계산기', '인건비 계산기', '임대료 계산기'],
  },
  마케팅: {
    summary: '목표 매출, 할인율, 배달 수익성처럼 판촉과 광고 전후 판단에 필요한 계산을 돕습니다.',
    keywords: ['할인 계산기', '매출 목표 계산기', '배달 수익 계산기'],
  },
  유틸리티: {
    summary: 'QR 생성, 상호명 아이디어, 글자 수 계산처럼 바로 써먹는 운영 도구를 제공합니다.',
    keywords: ['QR 생성기', '상호명 추천', '글자 수 세기'],
  },
} as const;

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '툴사장은 어떤 계산기를 제공하나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '부가세 계산기, 마진 계산기, 손익분기점 계산기, 인건비 계산기, 카드수수료 계산기 등 사장님이 자주 찾는 장사 계산기를 무료로 제공합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '로그인 없이 바로 사용할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네. 툴사장의 모든 계산기는 회원가입이나 로그인 없이 바로 사용할 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '툴사장은 어떤 상황에서 가장 유용한가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '메뉴 가격을 정하거나, 부가세를 분리 계산하거나, 인건비와 임대료 비율을 확인하고, 배달 수익성을 검토할 때 빠르게 판단할 수 있습니다.',
      },
    },
  ],
};

export const metadata: Metadata = {
  alternates: { canonical: BASE },
};

export default function HomePage() {
  const latestTips = getLatestTips(4);
  const activeTools = getActiveTools();
  const featuredTools = FEATURED_TOOL_SLUGS.map((slug) =>
    activeTools.find((tool) => tool.slug === slug)
  ).filter((tool): tool is NonNullable<(typeof activeTools)[number]> => Boolean(tool));
  const remainingTools = activeTools.filter(
    (tool) => !FEATURED_TOOL_SLUGS.includes(tool.slug)
  );
  const categoryEntries = Object.entries(categoryCopy).map(([category, copy]) => ({
    category,
    copy,
    count: activeTools.filter((tool) => tool.category === category).length,
  }));

  return (
    <div className="bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.14),_transparent_42%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_48%,#ffffff_100%)]">
      <JsonLd id="home-faq-jsonld" data={faqJsonLd} />

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section className="grid gap-6 rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)] backdrop-blur md:grid-cols-[minmax(0,1.2fr)_360px] md:p-10">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-blue-600">
              무료 장사 계산기 모음
            </p>
            <h1 className="mt-4 text-3xl font-black leading-tight text-gray-900 md:text-5xl">
              사장님이 매일 찾는
              <br />
              숫자와 판단을
              <span className="text-blue-600"> 한곳에서</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              툴사장은 부가세 계산기, 마진 계산기, 손익분기점 계산기,
              카드수수료 계산기처럼 자영업 운영에 자주 쓰는 비즈니스 도구를
              로그인 없이 바로 쓸 수 있게 정리한 무료 툴 모음입니다.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/tools"
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                인기 계산기 바로 쓰기
              </Link>
              <Link
                href="/tips"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
              >
                장사 팁 같이 보기
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { value: `${activeTools.length}+`, label: '즉시 사용 가능한 계산기' },
                { value: '100%', label: '로그인 없이 바로 사용' },
                { value: `${latestTips.length}편`, label: '최근 운영 인사이트' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-100 bg-slate-50/90 p-4"
                >
                  <p className="text-2xl font-black text-slate-900">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-blue-100 bg-slate-950 p-6 text-white shadow-[0_22px_70px_-40px_rgba(15,23,42,0.8)]">
            <p className="text-sm font-semibold text-blue-200">오늘 많이 찾는 계산기</p>
            <div className="mt-4 space-y-3">
              {featuredTools.slice(0, 4).map((tool, index) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="flex items-start justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-blue-300/40 hover:bg-white/10"
                >
                  <div>
                    <p className="text-xs font-semibold text-blue-200">
                      TOP {index + 1}
                    </p>
                    <p className="mt-1 font-semibold text-white">{tool.name}</p>
                    <p className="mt-1 text-sm text-slate-300">{tool.description}</p>
                  </div>
                  <span className="mt-1 text-sm text-blue-200">열기</span>
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-white/10 p-4">
              <p className="text-sm font-semibold text-white">툴사장을 찾는 이유</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
                <li>부가세 분리 계산과 마진 계산을 몇 초 안에 끝낼 수 있습니다.</li>
                <li>손익분기점, 인건비율, 임대료 비중처럼 운영 숫자를 바로 비교할 수 있습니다.</li>
                <li>계산 후 바로 이어서 읽을 수 있는 장사 팁과 내부 링크가 연결됩니다.</li>
              </ul>
            </div>
          </aside>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-100 bg-white/90 p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">핵심 계산기</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                검색 의도가 가장 강한 툴부터 바로 배치했습니다
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                부가세 계산기, 마진 계산기, 손익분기점 계산기처럼 실제 검색량과
                사용 빈도가 높은 장사 계산기를 먼저 배치해 빠르게 진입할 수
                있게 구성했습니다.
              </p>
            </div>
            <Link
              href="/tools"
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              전체 계산기 보기
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[2rem] border border-slate-100 bg-white/90 p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600">카테고리별 탐색</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  장사 운영 흐름에 맞춰 계산기를 묶었습니다
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                총 {activeTools.length}개 툴
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {categoryEntries.map(({ category, copy, count }) => (
                <div
                  key={category}
                  className="rounded-2xl border border-slate-100 bg-slate-50/85 p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-slate-900">{category}</h3>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                      {count}개
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {copy.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {copy.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {remainingTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <AdBanner position="home-mid" type="adsense" className="rounded-[2rem]" />

            <section className="rounded-[2rem] border border-slate-100 bg-white/90 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-blue-600">최근 장사 팁</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">
                    계산기와 같이 보면 더 좋은 인사이트
                  </h2>
                </div>
                {latestTips.length > 0 && (
                  <Link
                    href="/tips"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    전체 보기
                  </Link>
                )}
              </div>

              {latestTips.length === 0 ? (
                <div className="mt-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                  장사 팁 콘텐츠를 정리 중입니다.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {latestTips.map((tip) => (
                    <TipCard key={tip.slug} tip={tip} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-100 bg-white/90 p-6 shadow-sm md:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div>
              <p className="text-sm font-semibold text-blue-600">무료 운영 가이드</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                툴사장은 계산기만 모아둔 사이트가 아닙니다
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                자영업 운영에서 중요한 것은 숫자를 빠르게 확인한 뒤 바로 다음
                행동으로 이어지는 것입니다. 툴사장은 계산기와 장사 팁을 함께
                배치해 메뉴 가격 검토, 비용 구조 점검, 배달 수익성 판단 같은
                의사결정을 더 빠르게 내리도록 설계했습니다.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                {
                  title: '빠른 계산',
                  description:
                    '공급가액, 세율, 원가, 매출 목표처럼 필요한 숫자를 입력하면 즉시 결과를 확인할 수 있습니다.',
                },
                {
                  title: '연결된 판단',
                  description:
                    '계산 결과 뒤에 이어서 읽을 수 있는 장사 팁과 관련 계산기를 같이 제안합니다.',
                },
                {
                  title: '검색 친화 구조',
                  description:
                    '부가세 계산기, 손익분기점 계산기, 마진 계산기 같은 핵심 검색어마다 상세 페이지와 내부 링크를 강화합니다.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5"
                >
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-100 bg-white/90 p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600">자주 묻는 질문</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                툴사장을 처음 쓰는 사장님이 가장 많이 묻는 것
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                question: '회원가입 없이 바로 사용할 수 있나요?',
                answer:
                  '네. 툴사장의 계산기는 로그인 없이 바로 열고 바로 계산할 수 있게 구성되어 있습니다.',
              },
              {
                question: '어떤 계산기부터 써보는 게 좋나요?',
                answer:
                  '메뉴 가격이나 세금 정산이 고민이라면 부가세 계산기와 마진 계산기를, 매장 운영을 점검하고 싶다면 손익분기점 계산기와 인건비 관련 계산기를 먼저 추천합니다.',
              },
              {
                question: '검색엔진에서 찾는 키워드를 중심으로 구성돼 있나요?',
                answer:
                  '네. 부가세 계산기, 손익분기점 계산기, 인건비 계산기처럼 검색 의도가 뚜렷한 키워드를 중심으로 상세 페이지와 내부 링크를 강화하고 있습니다.',
              },
            ].map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5"
              >
                <h3 className="text-base font-bold text-slate-900">{item.question}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <AdBanner position="home-bottom" type="custom" className="mt-8 rounded-[2rem]" />
      </div>
    </div>
  );
}
