import type { Metadata } from 'next';
import { getTipsList } from '@/lib/tips';
import TipCard from '@/components/tips/TipCard';
import AdBanner from '@/components/common/AdBanner';

export const metadata: Metadata = {
  title: '장사 팁',
  description:
    '소상공인·자영업자를 위한 경영, 세금, 마케팅 꿀팁. 마진·부가세·배달 수수료 등 실무 정리.',
};

export default function TipsListPage() {
  const tips = getTipsList();

  return (
    <div className="mx-auto max-w-[480px] px-4 py-8 pb-24">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">장사 팁</h1>
      <p className="mb-6 text-sm text-gray-500">
        사장님을 위한 경영·세금·운영 꿀팁을 모았습니다.
      </p>

      {tips.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            알찬 콘텐츠를 준비하고 있습니다. 조금만 기다려 주세요!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={tip.slug}>
              <TipCard tip={tip} />
              {/* 3~4번째 카드 사이 광고 슬롯 */}
              {(index + 1) % 3 === 0 && index < tips.length - 1 && (
                <AdBanner
                  position={`tips-list-${Math.floor((index + 1) / 3)}`}
                  type="adsense"
                  className="my-4"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
