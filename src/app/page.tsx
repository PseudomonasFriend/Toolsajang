import type { Metadata } from 'next';
import Link from 'next/link';
import { tools } from '@/data/tools';
import ToolCard from '@/components/tools/ToolCard';
import TipCard from '@/components/tips/TipCard';
import AdBanner from '@/components/common/AdBanner';
import { getLatestTips } from '@/lib/tips';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com';

export const metadata: Metadata = {
  alternates: { canonical: BASE },
};

export default function HomePage() {
  const latestTips = getLatestTips(3);

  return (
    <div className="mx-auto max-w-[480px] px-4 py-8">
      {/* 히어로 섹션 */}
      <section className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          사장님 계산은
          <br />
          <span className="text-blue-600">툴사장</span>에서 끝
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          복잡한 엑셀 대신 3초 만에 결과를 확인하세요
        </p>
      </section>

      {/* 인기 툴 그리드 */}
      <section className="mb-6" aria-label="인기 툴 목록">
        <h2 className="mb-4 text-lg font-bold text-gray-900">인기 툴</h2>
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* 광고 슬롯 A */}
      <AdBanner position="home-mid" type="adsense" className="mb-6" />

      {/* 장사 팁 미리보기 */}
      <section className="mb-6" aria-label="최신 장사 팁">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">장사 팁</h2>
          {latestTips.length > 0 && (
            <Link
              href="/tips"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              전체 보기
            </Link>
          )}
        </div>
        {latestTips.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              알찬 콘텐츠를 준비하고 있습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {latestTips.map((tip) => (
              <TipCard key={tip.slug} tip={tip} />
            ))}
          </div>
        )}
      </section>

      {/* 광고 슬롯 B */}
      <AdBanner position="home-bottom" type="custom" />
    </div>
  );
}
