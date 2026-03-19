import type { Metadata } from 'next';
import { getTipsList } from '@/lib/tips';
import TipCard from '@/components/tips/TipCard';
import AdBanner from '@/components/common/AdBanner';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com';

export const metadata: Metadata = {
  title: '장사 팁',
  description:
    '소상공인·자영업자를 위한 경영, 세금, 마케팅 꿀팁. 마진·부가세·배달 수수료 등 실무 정리.',
  openGraph: {
    title: '장사 팁 | 툴사장',
    description: '소상공인·자영업자를 위한 경영, 세금, 마케팅 꿀팁. 마진·부가세·배달 수수료 등 실무 정리.',
    url: `${BASE}/tips`,
    type: 'website',
  },
  alternates: { canonical: `${BASE}/tips` },
};

export default function TipsListPage() {
  const tips = getTipsList();

  /* 카테고리 목록 추출 (순서 고정) */
  const categoryOrder = ['경영', '세금', '마케팅', '매장운영', '인사', '배달', '창업'];
  const categories = categoryOrder.filter((cat) =>
    tips.some((tip) => tip.category === cat)
  );

  return (
    <div className="bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.10),_transparent_38%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_42%,#ffffff_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-6 md:py-10">
        {/* 헤더 */}
        <section className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)] md:p-8">
          <p className="text-sm font-semibold tracking-[0.18em] text-blue-600">
            장사 팁
          </p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
            사장님을 위한 경영·세금·운영 꿀팁
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            매출 올리는 방법부터 세금 절감, 인건비 관리, 배달 수익성 개선까지
            소상공인 운영에 바로 적용할 수 있는 실전 팁 {tips.length}편을 정리했습니다.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
              >
                {cat} {tips.filter((t) => t.category === cat).length}편
              </span>
            ))}
          </div>
        </section>

        {/* 팁 목록 */}
        {tips.length === 0 ? (
          <div className="mt-6 rounded-[2rem] border border-slate-100 bg-white/90 p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              알찬 콘텐츠를 준비하고 있습니다. 조금만 기다려 주세요!
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tips.map((tip, index) => (
              <div key={tip.slug}>
                <TipCard tip={tip} />
                {/* 3번째 카드마다 광고 슬롯 삽입 (최대 3개, 모바일 단일 열에서만 노출) */}
                {(index + 1) % 3 === 0 &&
                  index < tips.length - 1 &&
                  Math.floor((index + 1) / 3) <= 3 && (
                    <AdBanner
                      position={`tip-list-${Math.floor((index + 1) / 3)}`}
                      type="adsense"
                      className="mt-4 sm:hidden"
                    />
                  )}
              </div>
            ))}
          </div>
        )}

        {/* 하단 광고 */}
        <AdBanner
          position="tips-bottom"
          type="adsense"
          className="mt-8 rounded-[2rem]"
        />
      </div>
    </div>
  );
}
