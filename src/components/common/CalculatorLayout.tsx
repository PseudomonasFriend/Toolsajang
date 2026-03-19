import type { ReactNode } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/common/AdBanner';
import { getActiveTools, getToolBySlug } from '@/data/tools';
import { getLatestTips } from '@/lib/tips';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  currentToolSlug: string;
}

/** 모든 툴 페이지의 공통 레이아웃 래퍼 */
export default function CalculatorLayout({
  title,
  description,
  children,
  currentToolSlug,
}: CalculatorLayoutProps) {
  const currentTool = getToolBySlug(currentToolSlug);
  const relatedTools = getActiveTools()
    .filter(
      (tool) =>
        tool.slug !== currentToolSlug &&
        (!currentTool || tool.category === currentTool.category)
    )
    .slice(0, 4);
  const latestTips = getLatestTips(3);

  return (
    <div className="bg-[linear-gradient(180deg,#f8fbff_0%,#f8fafc_32%,#ffffff_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <nav aria-label="경로 탐색" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-blue-600">
            홈
          </Link>
          <span>/</span>
          <Link href="/tools" className="transition hover:text-blue-600">
            계산기 모음
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-700">{title}</span>
        </nav>

        <section className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)] md:p-8">
          <div className="flex flex-wrap gap-2">
            {['무료', '로그인 없음', '즉시 계산'].map((label) => (
              <span
                key={label}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
              >
                {label}
              </span>
            ))}
          </div>

          <h1 className="mt-4 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            {description}
          </p>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
              {children}
            </section>

            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-xl font-bold text-slate-900">
                {title}가 필요한 순간
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  `${title} 결과를 빠르게 확인하고 가격이나 비용 구조를 판단해야 할 때`,
                  '매장 운영 회의를 하거나 숫자를 공유할 때 핵심 지표를 바로 정리하고 싶을 때',
                  '계산 후 다음 액션으로 이어질 관련 계산기와 장사 팁까지 함께 보고 싶을 때',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-xl font-bold text-slate-900">
                계산 결과를 더 잘 활용하는 방법
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>입력값을 여러 시나리오로 바꿔 보면서 손익 구조와 가격 전략을 비교해 보세요.</li>
                <li>결과값은 바로 실행하기보다 관련 비용, 수수료, 세금 항목과 함께 검토하는 것이 좋습니다.</li>
                <li>같은 카테고리의 계산기를 같이 쓰면 운영 숫자를 더 입체적으로 판단할 수 있습니다.</li>
              </ul>
            </section>

            <AdBanner
              position="tool-result-bottom"
              type="adsense"
              className="rounded-[2rem]"
            />

            <AdBanner
              position="tool-page-bottom"
              type="custom"
              className="rounded-[2rem]"
            />
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">함께 쓰면 좋은 계산기</h2>
              <div className="mt-4 space-y-3">
                {relatedTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="block rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50/60"
                  >
                    <p className="font-semibold text-slate-900">{tool.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900">관련 장사 팁</h2>
                <Link
                  href="/tips"
                  className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  전체 보기
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {latestTips.map((tip) => (
                  <Link
                    key={tip.slug}
                    href={`/tips/${tip.slug}`}
                    className="block rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50/60"
                  >
                    <p className="font-semibold text-slate-900">{tip.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{tip.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
