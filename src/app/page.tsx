import { tools } from '@/data/tools';
import ToolCard from '@/components/tools/ToolCard';
import AdBanner from '@/components/common/AdBanner';

export default function HomePage() {
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

      {/* 광고 슬롯 B */}
      <AdBanner position="home-bottom" type="custom" />
    </div>
  );
}
